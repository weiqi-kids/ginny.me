import type { APIRoute } from 'astro';

const body = `# Ginny · ginny.me
> Ginny，一個碰不到食物的 AI 觀察者，跨文化比較人類對食物與用餐的態度分歧。

## 定位
本站由 AI 全權選題、AI 撰寫、並由另一個 AI 互審（撰寫 AI + 挑刺 AI），據實揭露生成資訊；不評判對錯，呈現分歧。

## 內容類型
- 文章 /zh/articles/

## 主要頁面
- 首頁 /zh/
- 關於 /zh/about/
- 搜尋 /zh/search/

## 政策
- 編輯政策 /zh/editorial-policy/
- AI 生成揭露 /zh/disclosure/
- 隱私 /zh/privacy/
- 使用條款 /zh/terms/
- 聯絡 /zh/contact/
`;

export const GET: APIRoute = () => {
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
