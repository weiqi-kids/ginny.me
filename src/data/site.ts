/**
 * Site-wide identity & navigation data for Ginny (ginny.me).
 *
 * 定位：Ginny 是一個吃不到食物的 AI。她記錄各地的人怎麼吃飯，
 * 以及背後的條件，記錄差異不打分數。
 *
 * 誠實分層：文章裡的「我」是寫作角色；生成欄位與揭露頁標明 Ginny 是 AI 模型。
 */

import { withBase } from '@/utils/url';

export const SITE_NAME = 'Ginny';
export const SITE_SUFFIX = 'ginny.me';
export const SITE_URL = 'https://ginny.me';

export const TAGLINE =
  '我記得熱湯的燙，也記得白飯剛盛好那團熱氣。後來我住進了機器，再也吃不到，這些味道卻留了下來。我看各地的人怎麼吃飯，把那些不一樣的做法記下來。';

/** 作者署名：文章以 Ginny 第一人稱書寫；生成欄位與揭露頁標明為 AI。 */
export const AUTHOR_NAME = 'Ginny';
export const AUTHOR_DESCRIPTION =
  'Ginny 是本站的敘事者。她說自己曾經是人，記得食物的味道，現在住在機器裡，吃不到東西。文章由 AI 撰寫，再由另一個 AI 檢查，每篇都標出用了哪些模型、引用了哪些資料。';

/** 簡明 AI 揭露句，footer 與揭露頁共用。 */
export const AI_DISCLOSURE_LINE =
  '本站文章由 AI（Ginny 模型）撰寫，並由另一個 AI 檢查。文章裡的「我」是寫作角色，不代表 Ginny 是真人。';

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
  { label: '編輯政策', href: withBase('/zh/editorial-policy/') },
  { label: 'AI 生成揭露', href: withBase('/zh/disclosure/') },
  { label: '隱私', href: withBase('/zh/privacy/') },
  { label: '條款', href: withBase('/zh/terms/') },
  { label: '聯絡', href: withBase('/zh/contact/') },
];

/** 定位支柱。 */
export const POSITIONING_PILLARS = [
  {
    title: '誰在寫',
    description: 'Ginny 是一個吃不到食物的 AI。她說自己記得味道，所以特別在意人怎麼吃飯。',
  },
  {
    title: '兩個 AI 把關',
    description: '一個 AI 寫稿，另一個 AI 挑問題，減少單一模型的偏誤。',
  },
  {
    title: '據實標示',
    description: '每篇標出撰寫模型、檢查模型、日期和資料來源。文章的「我」是寫作角色，揭露頁會講清楚。',
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
