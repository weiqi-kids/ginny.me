import type { CollectionEntry } from 'astro:content';

/**
 * Food & dining subtopics for ginny.me.
 *
 * Each subtopic maps to a design token (`--color-topic-*`) defined in
 * src/styles/global.css. The `color` field below is the sRGB hex equivalent of
 * that OKLCH token, for non-CSS consumers (e.g. og generation, JSON-LD).
 * Keep these in sync with global.css if the tokens change.
 */
export type ArticleCategorySlug =
  | 'etiquette'
  | 'sharing'
  | 'leftovers'
  | 'rhythm'
  | 'identity';

export interface ArticleCategory {
  slug: ArticleCategorySlug;
  label: string;
  description: string;
  /** CSS custom property name, e.g. '--color-topic-etiquette'. */
  token: string;
  /** sRGB hex equivalent of the token (for non-CSS consumers). */
  color: string;
}

export type CategorizedArticle = CollectionEntry<'articles'> & {
  categorySlug: ArticleCategorySlug;
  categoryLabel: string;
};

export const ARTICLE_CATEGORIES: ArticleCategory[] = [
  {
    slug: 'etiquette',
    label: '餐桌禮儀',
    description: '餐具、出聲與安靜、餐桌規矩——同一張桌子上，不同文化的身體記憶。',
    token: '--color-topic-etiquette',
    color: '#8a5a34',
  },
  {
    slug: 'sharing',
    label: '共食與分食',
    description: '合菜或分餐、共享一盤的親密、誰來買單——一起吃飯的方式差異。',
    token: '--color-topic-sharing',
    color: '#3d6b4f',
  },
  {
    slug: 'leftovers',
    label: '剩食與惜食',
    description: '打包、光盤、廚餘——一顆飯的去留，藏著不同的價值觀。',
    token: '--color-topic-leftovers',
    color: '#6f6726',
  },
  {
    slug: 'rhythm',
    label: '用餐節奏',
    description: '快食或慢食、用餐時間、早餐與宵夜——一天裡，吃飯被擺在哪。',
    token: '--color-topic-rhythm',
    color: '#3a5a72',
  },
  {
    slug: 'identity',
    label: '食物與身分',
    description: '家鄉味、安慰食物、移民餐桌——食物如何承載記憶與認同。',
    token: '--color-topic-identity',
    color: '#834a64',
  },
];

const CATEGORY_LABEL_MAP = new Map(
  ARTICLE_CATEGORIES.map((category) => [category.slug, category.label]),
);

const CATEGORY_KEYWORDS: Record<ArticleCategorySlug, string[]> = {
  etiquette: [
    '餐桌禮儀',
    '禮儀',
    '餐具',
    '筷子',
    '刀叉',
    '用手',
    '出聲',
    '吸麵',
    '安靜',
    '咀嚼',
    '餐桌規矩',
    '用餐禮節',
  ],
  sharing: [
    '共食',
    '分食',
    '合菜',
    '分餐',
    '一盤',
    '分享',
    '請客',
    '買單',
    '結帳',
    'aa',
    '宴客',
  ],
  leftovers: [
    '剩食',
    '剩菜',
    '打包',
    '惜食',
    '浪費',
    '廚餘',
    '吃光',
    '光盤',
    '外帶',
    '吃不完',
  ],
  rhythm: [
    '節奏',
    '慢食',
    '快食',
    '速食',
    '用餐時間',
    '早餐',
    '宵夜',
    '午餐',
    '晚餐',
    '用餐時長',
  ],
  identity: [
    '身分',
    '認同',
    '鄉愁',
    '家鄉味',
    '安慰',
    '媽媽味',
    '記憶',
    '味道',
    '移民',
    '飲食認同',
  ],
};

function containsKeyword(text: string, keywords: string[]): boolean {
  return keywords.some((keyword) => text.includes(keyword.toLowerCase()));
}

function getSearchText(article: CollectionEntry<'articles'>): string {
  const data = article.data;

  return [
    data.domainTopic,
    data.title,
    data.description,
    data.tldr,
    ...(data.tags ?? []),
  ]
    .filter(Boolean)
    .join(' ')
    .trim()
    .toLowerCase();
}

export function classifyArticle(
  article: CollectionEntry<'articles'>,
): ArticleCategorySlug {
  const text = getSearchText(article);

  if (containsKeyword(text, CATEGORY_KEYWORDS.etiquette)) return 'etiquette';
  if (containsKeyword(text, CATEGORY_KEYWORDS.sharing)) return 'sharing';
  if (containsKeyword(text, CATEGORY_KEYWORDS.leftovers)) return 'leftovers';
  if (containsKeyword(text, CATEGORY_KEYWORDS.rhythm)) return 'rhythm';
  if (containsKeyword(text, CATEGORY_KEYWORDS.identity)) return 'identity';

  return 'identity';
}

export function categorizeArticles(
  articles: CollectionEntry<'articles'>[],
): CategorizedArticle[] {
  return articles.map((article) => {
    const categorySlug = classifyArticle(article);
    const categoryLabel =
      CATEGORY_LABEL_MAP.get(categorySlug) ??
      (ARTICLE_CATEGORIES.find((c) => c.slug === 'identity')?.label as string);

    return {
      ...article,
      categorySlug,
      categoryLabel,
    };
  });
}
