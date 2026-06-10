/**
 * Site-wide identity & navigation data for Ginny (ginny.me).
 *
 * 定位：記錄各地飲食的差異，
 * 以及背後的條件，記錄差異不打分數。
 *
 * 誠實分層：文章裡的「我」是寫作角色；生成欄位與揭露頁標明 Ginny 是 AI 模型。
 */

import { withBase } from '@/utils/url';

export const SITE_NAME = 'Ginny';
export const SITE_SUFFIX = 'ginny.me';
export const SITE_URL = 'https://ginny.me';

/**
 * 留言／投題 API base（Cloudflare Worker，見 worker/）。
 * 部署 worker 後填入，例如 'https://ginny-comments.<account>.workers.dev'。
 * 留空字串時，前端會隱藏留言與投題表單（站台照常運作）。
 */
export const COMMENTS_API = '';

export const TAGLINE =
  '同樣一頓飯，到了不同地方，做法差很多。剩菜怎麼處理、一桌人怎麼分食、結帳誰來付，各地的習慣不一樣。我把這些差異記下來，也試著講清楚背後的原因。';

/** 作者署名：文章以 Ginny 第一人稱書寫；生成欄位與揭露頁標明為 AI。 */
export const AUTHOR_NAME = 'Ginny';
export const AUTHOR_DESCRIPTION =
  'Ginny 是本站的敘事者，記錄各地飲食的差異。文章由 AI 撰寫，再由另一個 AI 檢查，每篇都標出用了哪些模型、引用了哪些資料。';

/** 簡明 AI 揭露句，footer 與揭露頁共用。 */
export const AI_DISCLOSURE_LINE =
  '本站文章由 AI（Ginny 模型）撰寫，並由另一個 AI 檢查。';

/** 主選單（zh）。 */
export const NAV_LINKS = [
  { label: '首頁', href: withBase('/zh/') },
  { label: '文章', href: withBase('/zh/articles/') },
  { label: '關於 Ginny', href: withBase('/zh/about/') },
  { label: '搜尋', href: withBase('/zh/search/') },
];

/** Footer 政策/關於連結。 */
export const FOOTER_LINKS = [
  { label: '關於 Ginny', href: withBase('/zh/about/') },
  { label: '建議新主題', href: withBase('/zh/suggest/') },
  { label: '編輯政策', href: withBase('/zh/editorial-policy/') },
  { label: 'AI 生成揭露', href: withBase('/zh/disclosure/') },
  { label: '隱私', href: withBase('/zh/privacy/') },
  { label: '條款', href: withBase('/zh/terms/') },
  { label: '聯絡', href: withBase('/zh/contact/') },
];

/** 定位支柱。 */
export const POSITIONING_PILLARS = [
  {
    title: '看各地的差異',
    description: '同一件吃飯的事，換個地方做法就不一樣，這裡把差異擺在一起比較。',
  },
  {
    title: '兩個 AI 把關',
    description: '一個 AI 寫稿，另一個 AI 挑問題，減少單一模型的偏誤。',
  },
  {
    title: '據實標示',
    description: '每篇標出撰寫模型、檢查模型、日期和資料來源，揭露頁有完整說明。',
  },
  {
    title: '記錄差異，不打分數',
    description: '只寫不同地方怎麼吃，以及背後的條件，不判斷誰對誰錯。',
  },
];

/** 社群／聯絡（佔位，待後續階段補上）。 */
export const SOCIAL = {
  email: 'hello@ginny.me',
  twitter: '',
  github: '',
};
