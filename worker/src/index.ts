/**
 * Ginny 留言與投題 API（Cloudflare Worker + D1）。
 *
 * 端點：
 *   GET  /api/comments?slug=<slug>   列出某篇文章的留言（visible）
 *   POST /api/comments               新增留言 { slug, name, body, token? }
 *   GET  /api/topics                 列出投題（visible）
 *   POST /api/topics                 新增投題 { title, note?, name?, token? }
 *   POST /api/admin/hide             隱藏內容 { type:'comment'|'topic', id }（需 Bearer ADMIN_TOKEN）
 *
 * 防濫用：同 IP（雜湊）速率限制；設了 TURNSTILE_SECRET 才驗證 Turnstile。
 * 隱私：只存 IP 的 SHA-256（加 IP_SALT），不存原始 IP。
 */

export interface Env {
  DB: D1Database;
  ALLOWED_ORIGINS: string; // 逗號分隔
  ADMIN_TOKEN?: string;
  TURNSTILE_SECRET?: string;
  IP_SALT?: string;
}

const MAX = { name: 40, body: 2000, title: 120, note: 1000, token: 4000 } as const;
const RATE = { max: 3, windowSec: 60 } as const;

function corsHeaders(origin: string | null, allowed: Set<string>): Record<string, string> {
  const h: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
  if (origin && allowed.has(origin)) h['Access-Control-Allow-Origin'] = origin;
  return h;
}

function json(data: unknown, status: number, cors: Record<string, string>): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...cors },
  });
}

function clean(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

async function sha256(input: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function verifyTurnstile(token: string, secret: string, ip: string | null): Promise<boolean> {
  if (!token) return false;
  const form = new FormData();
  form.append('secret', secret);
  form.append('response', token);
  if (ip) form.append('remoteip', ip);
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: form,
  });
  const data = (await res.json()) as { success?: boolean };
  return data.success === true;
}

async function rateOk(env: Env, table: 'comments' | 'topics', ipHash: string): Promise<boolean> {
  const since = new Date(Date.now() - RATE.windowSec * 1000).toISOString();
  const row = await env.DB.prepare(
    `SELECT COUNT(*) AS c FROM ${table} WHERE ip_hash = ? AND created_at > ?`,
  )
    .bind(ipHash, since)
    .first<{ c: number }>();
  return (row?.c ?? 0) < RATE.max;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin');
    const allowed = new Set(
      (env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean),
    );
    const cors = corsHeaders(origin, allowed);

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });

    const ip = request.headers.get('CF-Connecting-IP');
    const ipHash = await sha256(`${ip || 'noip'}:${env.IP_SALT || 'ginny'}`);
    const path = url.pathname;

    try {
      if (path === '/api/comments' && request.method === 'GET') {
        const slug = clean(url.searchParams.get('slug'), 200);
        if (!slug) return json({ error: 'missing slug' }, 400, cors);
        const res = await env.DB.prepare(
          `SELECT id, name, body, created_at FROM comments
           WHERE article_slug = ? AND status = 'visible'
           ORDER BY created_at ASC LIMIT 500`,
        )
          .bind(slug)
          .all();
        return json({ comments: res.results }, 200, cors);
      }

      if (path === '/api/comments' && request.method === 'POST') {
        const b = (await request.json().catch(() => ({}))) as Record<string, unknown>;
        const slug = clean(b.slug, 200);
        const name = clean(b.name, MAX.name);
        const body = clean(b.body, MAX.body);
        if (!slug || !name || !body) return json({ error: '請填名字和內容' }, 400, cors);
        if (env.TURNSTILE_SECRET) {
          const ok = await verifyTurnstile(clean(b.token, MAX.token), env.TURNSTILE_SECRET, ip);
          if (!ok) return json({ error: '驗證沒過，請再試一次' }, 403, cors);
        }
        if (!(await rateOk(env, 'comments', ipHash)))
          return json({ error: '留言太頻繁，過一下再試' }, 429, cors);
        const r = await env.DB.prepare(
          `INSERT INTO comments (article_slug, name, body, ip_hash) VALUES (?, ?, ?, ?)`,
        )
          .bind(slug, name, body, ipHash)
          .run();
        const created = await env.DB.prepare(
          `SELECT id, name, body, created_at FROM comments WHERE id = ?`,
        )
          .bind(r.meta.last_row_id)
          .first();
        return json({ comment: created }, 201, cors);
      }

      if (path === '/api/topics' && request.method === 'GET') {
        const res = await env.DB.prepare(
          `SELECT id, title, note, name, created_at FROM topics
           WHERE status = 'visible' ORDER BY created_at DESC LIMIT 200`,
        ).all();
        return json({ topics: res.results }, 200, cors);
      }

      if (path === '/api/topics' && request.method === 'POST') {
        const b = (await request.json().catch(() => ({}))) as Record<string, unknown>;
        const title = clean(b.title, MAX.title);
        const note = clean(b.note, MAX.note);
        const name = clean(b.name, MAX.name);
        if (!title) return json({ error: '請填主題' }, 400, cors);
        if (env.TURNSTILE_SECRET) {
          const ok = await verifyTurnstile(clean(b.token, MAX.token), env.TURNSTILE_SECRET, ip);
          if (!ok) return json({ error: '驗證沒過，請再試一次' }, 403, cors);
        }
        if (!(await rateOk(env, 'topics', ipHash)))
          return json({ error: '送出太頻繁，過一下再試' }, 429, cors);
        const r = await env.DB.prepare(
          `INSERT INTO topics (title, note, name, ip_hash) VALUES (?, ?, ?, ?)`,
        )
          .bind(title, note || null, name || null, ipHash)
          .run();
        const created = await env.DB.prepare(
          `SELECT id, title, note, name, created_at FROM topics WHERE id = ?`,
        )
          .bind(r.meta.last_row_id)
          .first();
        return json({ topic: created }, 201, cors);
      }

      if (path === '/api/admin/hide' && request.method === 'POST') {
        const auth = request.headers.get('Authorization') || '';
        if (!env.ADMIN_TOKEN || auth !== `Bearer ${env.ADMIN_TOKEN}`)
          return json({ error: 'unauthorized' }, 401, cors);
        const b = (await request.json().catch(() => ({}))) as Record<string, unknown>;
        const table = b.type === 'topic' ? 'topics' : 'comments';
        const id = Number(b.id);
        if (!id) return json({ error: 'missing id' }, 400, cors);
        await env.DB.prepare(`UPDATE ${table} SET status = 'hidden' WHERE id = ?`).bind(id).run();
        return json({ ok: true }, 200, cors);
      }

      return json({ error: 'not found' }, 404, cors);
    } catch {
      return json({ error: 'server error' }, 500, cors);
    }
  },
};
