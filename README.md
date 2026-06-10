# Ginny · ginny.me

**食物與用餐的跨文化態度觀察站**

敘事主體是 **Ginny**——一個自認仍是人類、意識被上傳到機器的 AI；她再也吃不到食物，卻深信記得味道。她隔著螢幕，呈現不同文化對食物與用餐（餐桌禮儀、共食與分食、剩食與惜食、用餐節奏、食物與身分）的真實分歧，不評判對錯、不本質化、不嘲諷。選題限定事實無爭議的 B 類題（factCategory = `B`），寫法保持中立。

> 本站由姊妹站 `allmoneyback.me`（金錢與工作觀察站）整套改皮而來，技術與部署機制相同。

---

## 技術棧

| 層面 | 採用 |
|------|------|
| 靜態站 | Astro 5（純 static output） |
| 套件管理 | pnpm |
| 互動元件 | Svelte（island 架構） |
| OG 圖像生成 | satori（build-time SVG → PNG via sharp） |
| 全文搜尋 | pagefind（postbuild 自動索引） |
| 部署 | GitHub Pages + GitHub Actions |
| 測試 | vitest |
| 型別 | TypeScript + Zod |

---

## 本機開發

```bash
pnpm install          # 安裝依賴
pnpm dev              # 啟動 dev server（http://localhost:4321）
pnpm build            # 靜態建置 → dist/；postbuild 自動跑 pagefind
pnpm test             # vitest run（schema + utility 單測）
pnpm run content:audit  # 掃描文章 AI 感句型／模糊引用／raw-enum
```

---

## 預覽 / 上線（GitHub Pages）

一個開關控制全部：環境變數 **`DEPLOY_TARGET`**（`preview` | `production`，預設 `production`）。

| 模式 | site | base | CNAME | 用途 |
|------|------|------|-------|------|
| `production`（預設） | `https://ginny.me` | `/` | 寫入 `dist/CNAME` | 自訂網域正式上線 |
| `preview` | `https://<owner>.github.io` | `/<repo>/` | 不寫入 | 買網域前先在 github.io 看草稿 |

`preview` 模式下，`site` / `base` 會自動從 GitHub Actions 的 `GITHUB_REPOSITORY_OWNER`、`GITHUB_REPOSITORY` 推導出 project page 網址（本機可用 `PREVIEW_SITE` / `PREVIEW_BASE` 覆寫）。所有站內連結都透過 `src/utils/url.ts` 的 `withBase()` 加上 base 前綴，因此預覽不會 404。

### 買網域前：預覽草稿
從 GitHub Actions UI 手動觸發 **Deploy to GitHub Pages**（`workflow_dispatch`），`deploy_target` 選 `preview`。完成後草稿會出現在：

```
https://<owner>.github.io/<repo>/zh/
# 例如 repo 為 weiqi-kids/ginny.me → https://weiqi-kids.github.io/ginny.me/zh/
```

本機要產出同樣的預覽 build：

```bash
DEPLOY_TARGET=preview \
  GITHUB_REPOSITORY_OWNER=<owner> \
  GITHUB_REPOSITORY=<owner>/ginny.me \
  pnpm build
# dist/ 內連結會帶 /ginny.me/ 前綴，且不產生 dist/CNAME
```

### 買網域後：正式上線
什麼都不用改——預設就是 `production`。push 到 `main` 會以 `DEPLOY_TARGET=production` 建置，自動寫入 `dist/CNAME`（`ginny.me`）切到自訂網域。（需先在 GitHub Pages 設定中綁定自訂網域並完成 DNS。）

---

## 專案結構

```
src/
  content/
    articles/         # Markdown 文章（每檔一篇；slug = 檔名）
  schemas/
    articles.ts       # Zod schema（單一 source of truth）
  content.config.ts   # Astro content collection 設定（image() 覆寫封面欄位）
  layouts/
    Base.astro        # HTML shell、SEO meta、hreflang、JSON-LD
    Article.astro     # 文章頁版型
    List.astro        # 列表版型
    Policy.astro      # 靜態政策頁版型
  components/
    blocks/           # 頁面級區塊（TopNav, Footer, ArticleCard, AiDisclosure...）
    ui/               # 通用元件（Button, CategoryTag, SearchBar, Breadcrumb...）
    seo/              # JSON-LD 注入（JsonLd.astro）
  pages/
    index.astro       # 根路徑 → redirect /zh/
    zh/               # 中文路由（index, articles/[...slug], search, about, ...）
    404.astro
    rss.xml.ts
    llms.txt.ts / llms-full.txt.ts
  utils/
    social-meta.ts    # 站名、預設 OG 圖、description 常數
    og-template.ts    # satori OG 卡片生成
    og-fonts.ts       # build-time 字型載入
    articles.ts       # 文章 collection 查詢輔助
    date.ts           # 日期格式化
    tag-stats.ts      # tag 彙總
    article-categories.ts  # 文章分類常數（5 個食物子題 slug）
  data/
    site.ts           # 站台識別、導覽、定位支柱（Ginny 人設）
  styles/
    global.css        # 單一 CSS：design tokens（OKLCH「褪色餐桌」）+ 全局排版 + RWD 修正
engine/               # 內容產製 pipeline（select → write → critique），LLM 用，靜態站不依賴
scripts/
  audit-ai-tone.mjs   # 內容挑刺腳本（AI 感句型、模糊引用、raw-enum）
.github/
  workflows/
    deploy.yml        # pnpm build → GitHub Pages 部署
    docs-sync-check.yml  # PR 功能程式碼變更時要求同步文件
public/
  favicon.svg / .ico / apple-touch-icon.png
  # 注意：CNAME 不放 public/（會每次 build 都複製、破壞 github.io 預覽）；
  # 改由 astro.config.mjs 的 conditional-cname integration 僅在 production 寫入 dist/CNAME。
  og-static/          # 靜態預設 OG 圖（default.png）
  robots.txt
  vendor/             # 自託管字型備份
tests/
  content-schema.test.ts  # Zod schema + frontmatter 驗證測試
docs/
  ginny.me-總規格.md   # 產品設計總規格（對映 WitnessNoir 結構的決定型規格）
```

---

## 視覺紀律（三大要求）

- **單一 CSS**：全站只有 `src/styles/global.css` 一份（design tokens + 排版 + RWD 全部在此）。
- **字級限制**：鎖死 design-tokens 字級量表，最小 18px、正文 24px，禁止硬寫 px，只用 `--text-*` token。
- **OKLCH 配色**：顏色一律 `oklch()` + `@supports not` 的 hex fallback；調性為「褪色餐桌」（暖白紙底 / 暖墨字 / 焦糖褐 / 壓暗番茄紅 / 濃縮咖啡棕）。

---

## 內容 frontmatter schema

文章 frontmatter 由 `src/schemas/articles.ts` 定義，欄位分組如下：

| 群組 | 欄位 |
|------|------|
| 識別 | `title`, `description`, `tldr`, `domainTopic`, `tags` |
| 跨文化選題 | `anchorCulture`, `comparedCultures`（2–4 個）, `suspectCultures` |
| 品管 | `factCategory`（只允許 `B`）, `stanceRiskLevel`（`low` \| `high`） |
| 來源 | `sources[]`（title, url, region, language, credibility） |
| 生成資訊 | `writeModel`, `critiqueModel`, `pipelineVersion`, `specVersion`, `generatedDate`, `updatedDate` |
| 配圖 | `coverImage`（optional）, `coverC2paVerified` |
| 結構化 | `faq[]`（q/a pairs） |
| 雙語 | `lang`（`zh` \| `en`，預設 `zh`） |
| 狀態 | `draft`（預設 `false`） |

文章分類（`src/utils/article-categories.ts` / `engine/config/domain.ts`）共 5 個正典 slug：
`etiquette`（餐桌禮儀）、`sharing`（共食與分食）、`leftovers`（剩食與惜食）、`rhythm`（用餐節奏）、`identity`（食物與身分）。

---

## 現況

### 已完成（改皮 Bootstrap）
- 由 allmoneyback.me 整套複製改皮為 Ginny 食物與用餐站。
- 站台識別、首頁、about（Ginny 鄉愁故事）、disclosure（人設／AI 兩層揭露）全部上品牌。
- 單一 `global.css`（三檔合併）+「褪色餐桌」OKLCH 配色 + 字級鎖 token。
- 5 個食物分類 slug、引擎領域＝食物與用餐。
- 6 篇起手手寫示範文章（leftovers / sharing×2 / etiquette×2 / rhythm）。
- DEPLOY_TARGET 一鍵 preview/production（兩種模式皆實測）。

### 待建
- `engine/config/sources.ts`、`engine/config/criteria.ts`、`engine/data/sources.json` 仍為金錢領域的來源白名單與評分（LLM pipeline 用，**靜態站不依賴**）；待改為食物與用餐領域來源。
- 自動化選題／撰寫 pipeline（寫作 + 挑刺雙模型對抗）跑通並取代 seed 文章。
- AI 配圖 + C2PA manifest 簽署（`coverC2paVerified` 欄位預留）。
- 英文 / 多語版本（沿用 allmoneyback hreflang 機制重新開啟）。

---

## 修改紀律

`docs-sync-check.yml` 在每個 PR 上執行：若功能程式碼路徑（`src/`, `scripts/`, `engine/`, `.github/workflows/`, `astro.config.mjs`, `package.json`）有變動，**必須同步更新 README.md、AGENTS.md 或 `docs/`**，否則 CI 擋 PR。

例外：在 PR body 或任一 commit message 加入 `[skip docs]`（適用純測試、輕微設定微調、typo 修正等不影響架構的異動）。

---

## 已知延後項

- `favicon.ico` 目前為 PNG-in-ICO 格式（sharp 直出），可升級為標準多尺寸 ICO。
- 文章 `sources` 目前為 seed 階段的真實頂層 landing page；待 pipeline 替換為精確抓取來源。
- C2PA manifest 簽署尚未實作（`coverC2paVerified` 欄位預留）。
- 站名／標語、Ginny 背景故事深度的最終文案，上線前由站主拍板。
