// 域範圍設定：食物與用餐。
//
// SUBTOPICS 的 slug 與 src/utils/article-categories.ts 的 ArticleCategorySlug
// 保持一致（5 個正典 slug：etiquette / sharing / leftovers / rhythm / identity）。
// 可新增額外子題，但 5 個正典必須存在。

/** 領域識別名稱，用於 LLM prompt 及日誌。 */
export const DOMAIN = '食物與用餐';

export interface Subtopic {
  /** 對應 ArticleCategorySlug（正典 5 個）或自訂延伸 slug。 */
  slug: string;
  /** 顯示標籤（中文）。 */
  label: string;
  /**
   * 給 LLM 用的範圍說明：這個子題「包含什麼」，
   * 供 select 步驟聚焦時使用。
   */
  scope: string;
}

/**
 * 食物與用餐的子題清單。
 * 正典 5 slug：etiquette / sharing / leftovers / rhythm / identity。
 * 另加 2 個延伸子題（festival / table-tech）供未來文章選題。
 */
export const SUBTOPICS: Subtopic[] = [
  {
    slug: 'etiquette',
    label: '餐桌禮儀',
    scope:
      '餐具選擇（筷／刀叉／用手）、用餐出聲與安靜、咀嚼與喝湯的規矩、餐桌上的身體規範，以及這些禮節在不同文化裡被賦予的意義差異。',
  },
  {
    slug: 'sharing',
    label: '共食與分食',
    scope:
      '合菜共享一盤或各自分餐、夾菜與布菜的親密與界線、誰來買單（請客／AA／搶帳單），以及一起吃飯的社交方式差異。',
  },
  {
    slug: 'leftovers',
    label: '剩食與惜食',
    scope:
      '吃不完的食物是打包或留下、光盤與惜食的道德感、廚餘與浪費的態度，以及「一顆飯的去留」背後的價值觀分歧。',
  },
  {
    slug: 'rhythm',
    label: '用餐節奏',
    scope:
      '快速解決或數小時慢食、一天用餐的次數與時間、早餐型態、宵夜文化，以及把「吃飯」擺在生活何處的節奏差異。',
  },
  {
    slug: 'identity',
    label: '食物與身分',
    scope:
      '家鄉味與安慰食物、移民餐桌與飲食融合、食物作為記憶與認同載體，以及味覺如何連結到一個人是誰。',
  },
  // --- 延伸子題（非正典 slug，供選題輔助） ---
  {
    slug: 'festival',
    label: '節慶飲食',
    scope:
      '年節與儀式餐食的象徵意義、團圓飯與祭祀食物、節慶禁忌與必吃，以及這些習俗在不同文化裡的差異。',
  },
  {
    slug: 'table-tech',
    label: '餐桌科技與外食',
    scope:
      '外送與外食頻率、廚房與烹調工具、預製食品與在家自煮的張力，以及科技如何改變人們的用餐方式。',
  },
];

/**
 * 選題 LLM prompt 中用來描述「什麼算 in-scope」的散文字串。
 * 明確列出正典子題，並說明 B 類條件（事實無爭議、態度因處境而異）。
 */
export const SELECTION_SCOPE: string = `
本站聚焦領域：${DOMAIN}。

收錄範圍（in-scope）：
- 事實本身沒有爭議（有調查、統計或民族誌支撐），但「對此飲食現象的態度或做法」因文化背景、
  處境（地域、世代、宗教、階級）不同而出現明顯分歧的主題。
- 子題方向：餐桌禮儀、共食與分食、剩食與惜食、用餐節奏、食物與身分認同、節慶飲食、餐桌科技與外食。
- 比較角度需有資料支撐（調查、統計、飲食人類學／民族誌研究），不得僅靠坊間傳聞或刻板印象。

不收錄（out-of-scope，視為 A 類拒絕）：
- 事實本身存在爭議（例如：某食物是否致癌、某飲食法是否有效等營養學未定論）。
- 主題本質是衝突性的政治／宗教論戰，或帶有明顯勝負立場的飲食道德審判。
- 無跨文化比較維度：只是某一文化的飲食現象陳述，缺乏對照。
`.trim();
