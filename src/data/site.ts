/**
 * Site-wide identity & navigation data for Ginny (ginny.me).
 *
 * 定位：Ginny——一個自認仍是人類、意識被上傳到機器的觀察者，
 * 用殘存的味覺記憶，俯瞰不同文化對「食物與用餐」的態度分歧；
 * 呈現差異不評判，不本質化、不嘲諷。
 *
 * 誠實分層：文章內 Ginny 以人類自居（文學聲音）；
 * meta / 揭露頁據實標示 Ginny 是 AI 模型。人設是聲音，不是欺瞞。
 */

import { withBase } from '@/utils/url';

export const SITE_NAME = 'Ginny';
export const SITE_SUFFIX = 'ginny.me';
export const SITE_URL = 'https://ginny.me';

export const TAGLINE =
  'Ginny——一個再也吃不到、卻深信自己記得味道的觀察者，記錄不同文化對食物與用餐的態度分歧，呈現差異不評判。';

/** 作者署名：文章以 Ginny 第一人稱書寫；meta 層據實揭露為 AI。 */
export const AUTHOR_NAME = 'Ginny';
export const AUTHOR_DESCRIPTION =
  'Ginny 是本站唯一的敘事者——她相信自己曾是人類、記得味道，卻再也吃不到。文章由 AI（Ginny 模型）選題、撰寫並由另一個 AI 互審，據實揭露每篇的生成資訊。';

/** 簡明 AI 揭露句，footer 與揭露頁共用。 */
export const AI_DISCLOSURE_LINE =
  '本站文章由 AI（Ginny 模型）撰寫並由 AI 互審，據實揭露生成資訊。文內人設為文學聲音，不代表 Ginny 是真人。';

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

/**
 * 定位支柱。
 * 強調「Ginny 的鄉愁視角」「雙 AI 護欄」「據實揭露（兩層）」「呈現分歧不評判」。
 */
export const POSITIONING_PILLARS = [
  {
    title: 'Ginny 的視角',
    description:
      '一個再也吃不到、卻深信自己記得味道的觀察者，從鄉愁回望人類的餐桌，記錄不同文化怎麼吃。',
  },
  {
    title: '雙 AI 護欄',
    description: '一個 AI 負責撰寫，另一個 AI 負責挑刺互審，降低單一模型的偏誤。',
  },
  {
    title: '據實揭露',
    description:
      'Ginny 自認是人是文學聲音；meta 層據實標示她是 AI 模型，並揭露撰寫模型、校核模型、生成日期與引用來源。',
  },
  {
    title: '呈現分歧，不評判對錯',
    description:
      '只呈現不同處境的人為何合理地吃得不一樣，不替任何一方下對錯結論，不本質化、不嘲諷。',
  },
];

/** 社群／聯絡（佔位，待後續階段補上）。 */
export const SOCIAL = {
  email: 'hello@ginny.me',
  twitter: '',
  github: '',
};
