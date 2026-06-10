// 來源白名單設定（食物與用餐領域）。
//
// access 欄位說明：
//   'real'  = 有穩定的公開 API 或可程式化下載的資料集（E3 fetch 可接）。
//   'stub'  = 目前無程式化存取路徑，E3 會以 stub 替代；TODO 標示待補。
//
// 重要：一般性論壇（Reddit、PTT、Dcard、微博⋯⋯）因 ToS／著作權疑慮一律排除（spec §10.5）。
// 本白名單只收錄調查機構、統計局、學術資料庫、或已授權的多語語料庫。

export interface SourceWhitelistEntry {
  /** 唯一識別碼，英文 kebab-case。 */
  id: string;
  /** 顯示名稱。 */
  name: string;
  /** 資料性質。 */
  kind: 'survey' | 'stats-office' | 'academic' | 'discourse';
  /** 覆蓋地區代碼或名稱（例如 'TW', 'JP', 'global', 'OECD'）。 */
  regions: string[];
  /** 資料語言（ISO 639-1 或 'multi'）。 */
  languages: string[];
  /** 來源可信度。 */
  credibility: 'high' | 'medium' | 'low';
  /**
   * 程式化存取成熟度：
   *   'real'  = 有穩定 API / 資料集下載，E3 可直接對接。
   *   'stub'  = 尚無程式化路徑，E3 以 stub 替代。
   */
  access: 'real' | 'stub';
  /** 官方入口網址（供人工查閱）。 */
  url?: string;
  /** 補充說明或 TODO。 */
  notes?: string;
}

export const SOURCE_WHITELIST: SourceWhitelistEntry[] = [
  // ── 調查機構 ────────────────────────────────────────────────────────────────
  {
    id: 'pew-research',
    name: 'Pew Research Center',
    kind: 'survey',
    regions: ['global'],
    languages: ['en'],
    credibility: 'high',
    access: 'real',
    url: 'https://www.pewresearch.org/datasets/',
    notes:
      '提供公開可下載的調查微資料（需免費註冊）；涵蓋全球生活態度調查，飲食習慣、家庭用餐、宗教飲食規範等題組可用。',
  },
  {
    id: 'world-values-survey',
    name: 'World Values Survey (WVS)',
    kind: 'survey',
    regions: ['global'],
    languages: ['multi'],
    credibility: 'high',
    access: 'real',
    url: 'https://www.worldvaluessurvey.org/WVSDocumentationWV7.jsp',
    notes:
      'Wave 7 資料集可直接下載（CSV/SPSS/R）；含家庭、社交、價值觀題組，可支撐用餐社交與待客態度的跨文化對照。',
  },

  // ── 統計局 / 國際組織 ────────────────────────────────────────────────────────
  {
    id: 'oecd-stats',
    name: 'OECD Statistics (Health, Time Use, Food)',
    kind: 'stats-office',
    regions: ['OECD'],
    languages: ['en'],
    credibility: 'high',
    access: 'real',
    url: 'https://stats.oecd.org/',
    notes:
      'OECD.Stat 提供 SDMX/JSON API；時間運用（用餐花費時間）、健康與飲食、家戶食品支出等指標可程式化查詢。',
  },
  {
    id: 'fao-faostat',
    name: 'FAO / FAOSTAT',
    kind: 'stats-office',
    regions: ['global'],
    languages: ['en'],
    credibility: 'high',
    access: 'real',
    url: 'https://www.fao.org/faostat/en/',
    notes:
      'FAOSTAT 提供食物供給、食物平衡表、各國膳食結構資料，含 API 與 bulk download；食物消費與浪費的核心統計來源。',
  },
  {
    id: 'unep-food-waste',
    name: 'UNEP Food Waste Index',
    kind: 'academic',
    regions: ['global'],
    languages: ['en'],
    credibility: 'high',
    access: 'stub',
    url: 'https://www.unep.org/resources/publication/unep-food-waste-index-report-2024',
    notes:
      '各國家戶／餐飲端食物浪費估計；以報告 PDF 為主，尚無穩定 API，E3 暫 stub。剩食與惜食題目的關鍵佐證。',
  },
  {
    id: 'tw-dgbas',
    name: '中華民國主計總處（DGBAS）',
    kind: 'stats-office',
    regions: ['TW'],
    languages: ['zh'],
    credibility: 'high',
    access: 'stub',
    url: 'https://www.dgbas.gov.tw/',
    notes:
      '家庭收支調查含食品與外食支出。data.gov.tw 有部分 CSV，但缺穩定機器可讀 API；E3 暫以 stub 替代。',
  },
  {
    id: 'jp-estat',
    name: '日本統計局 e-Stat',
    kind: 'stats-office',
    regions: ['JP'],
    languages: ['ja', 'en'],
    credibility: 'high',
    access: 'real',
    url: 'https://api.e-stat.go.jp/',
    notes: 'e-Stat 提供 REST API（需免費 appId）；家計調查的食料支出、外食與在家飲食結構可查詢。',
  },
  {
    id: 'usda-ers',
    name: 'USDA Economic Research Service',
    kind: 'stats-office',
    regions: ['US'],
    languages: ['en'],
    credibility: 'high',
    access: 'real',
    url: 'https://www.ers.usda.gov/data-products/',
    notes:
      'USDA ERS 食物支出（Food Expenditure Series）、外食佔比、份量趨勢等資料集；多為可下載 CSV/API。',
  },
  {
    id: 'eurostat',
    name: 'Eurostat',
    kind: 'stats-office',
    regions: ['EU'],
    languages: ['en', 'multi'],
    credibility: 'high',
    access: 'real',
    url: 'https://ec.europa.eu/eurostat/web/json-and-unicode-web-services',
    notes: 'Eurostat JSON-API；家戶食品消費支出、外食、用餐時間相關指標覆蓋 EU27 成員國。',
  },
  {
    id: 'our-world-in-data',
    name: 'Our World in Data',
    kind: 'academic',
    regions: ['global'],
    languages: ['en'],
    credibility: 'high',
    access: 'real',
    url: 'https://ourworldindata.org/',
    notes:
      '彙整 FAO/世界銀行等來源的飲食結構、食物供給、食物浪費圖表；多附可下載 CSV，適合做跨國對照的事實錨點。',
  },

  // ── 學術資料庫 ──────────────────────────────────────────────────────────────
  {
    id: 'food-anthropology-academic',
    name: '飲食人類學／民族誌研究（通用入口）',
    kind: 'academic',
    regions: ['global'],
    languages: ['multi'],
    credibility: 'high',
    access: 'stub',
    url: 'https://scholar.google.com/',
    notes:
      'TODO: 指向 Google Scholar / Semantic Scholar 的飲食人類學、餐桌禮儀、共食研究關鍵字查詢；E3 以 stub 產生示例引用，待整合 Semantic Scholar API。',
  },

  // ── 語料庫（discourse）────────────────────────────────────────────────────────
  {
    id: 'cc100-multilingual',
    name: 'CC-100 多語網頁語料庫',
    kind: 'discourse',
    regions: ['global'],
    languages: ['multi'],
    credibility: 'medium',
    access: 'stub',
    url: 'https://data.statmt.org/cc-100/',
    notes:
      '已授權的公開爬取語料（CommonCrawl 子集）；可供飲食用語與文化語言模式分析，但非原始民調數據，引用時需標明來源性質。' +
      '注意：一般性論壇（Reddit、PTT、Dcard、微博⋯⋯）因 ToS／著作權疑慮一律排除（spec §10.5）。E3 暫 stub。',
  },
];

/**
 * 回傳適用於當前領域的來源白名單。
 * 目前回傳全部（單領域站點）；未來可依 domain 參數過濾。
 */
export function sourcesForDomain(): SourceWhitelistEntry[] {
  return SOURCE_WHITELIST;
}
