# ginny-comments — 留言與投題 API（Cloudflare Worker + D1）

純靜態前端（GitHub Pages）打不到資料庫，所以留言與投題走這個獨立的 Worker，資料存在自己的 D1。前端用 `fetch` 呼叫。

## 端點

| 方法 | 路徑 | 說明 |
|------|------|------|
| GET | `/api/comments?slug=<slug>` | 列出某篇文章的留言 |
| POST | `/api/comments` | 新增留言 `{ slug, name, body, token? }` |
| GET | `/api/topics` | 列出讀者投的主題 |
| POST | `/api/topics` | 投一個主題 `{ title, note?, name?, token? }` |
| POST | `/api/admin/hide` | 隱藏濫用內容 `{ type:'comment'\|'topic', id }`（需 `Authorization: Bearer <ADMIN_TOKEN>`） |

防濫用：同 IP（只存 SHA-256 雜湊，不存原始 IP）60 秒最多 3 則；設了 `TURNSTILE_SECRET` 才會驗 Turnstile。留言預設即時顯示，濫用內容用 admin 端點隱藏。

## 部署（需要你的 Cloudflare 帳號）

```bash
cd worker
pnpm install
npx wrangler login           # 瀏覽器登入你的 Cloudflare（這步只有你能做）

# 1. 建 D1 資料庫，把回傳的 database_id 貼進 wrangler.jsonc
pnpm run db:create

# 2. 套用資料表
pnpm run db:migrate

# 3. 設密鑰（IP 雜湊鹽、admin token；Turnstile 可選）
npx wrangler secret put IP_SALT          # 隨便一串長亂碼
npx wrangler secret put ADMIN_TOKEN      # 你自己記的管理密碼
# npx wrangler secret put TURNSTILE_SECRET   # 之後想開 Turnstile 再設

# 4. 部署
pnpm run deploy
```

部署後會得到一個 `https://ginny-comments.<account>.workers.dev` 網址。把它填到前端的 API base（見站台 `src/data/site.ts` 的 `COMMENTS_API`），重建前端即可。之後可在 Cloudflare 把 Worker 綁到 `api.ginny.me` 自訂網域。

## 本機開發

```bash
pnpm run db:migrate:local
npx wrangler dev            # 本機起 Worker + 本機 D1
```

## 隱藏濫用內容

```bash
curl -X POST https://<worker-url>/api/admin/hide \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"type":"comment","id":123}'
```
