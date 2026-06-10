-- Ginny 留言與投題資料表（D1 / SQLite）
-- 日期時間一律 TEXT（ISO 8601）；boolean 不用，狀態用 TEXT enum。

CREATE TABLE IF NOT EXISTS comments (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  article_slug TEXT NOT NULL,
  name         TEXT NOT NULL,
  body         TEXT NOT NULL,
  created_at   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  status       TEXT NOT NULL DEFAULT 'visible',   -- visible | hidden
  ip_hash      TEXT
);

CREATE INDEX IF NOT EXISTS idx_comments_slug
  ON comments (article_slug, status, created_at);
CREATE INDEX IF NOT EXISTS idx_comments_rate
  ON comments (ip_hash, created_at);

CREATE TABLE IF NOT EXISTS topics (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  title      TEXT NOT NULL,
  note       TEXT,
  name       TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  status     TEXT NOT NULL DEFAULT 'visible',     -- visible | hidden
  ip_hash    TEXT
);

CREATE INDEX IF NOT EXISTS idx_topics_status
  ON topics (status, created_at);
CREATE INDEX IF NOT EXISTS idx_topics_rate
  ON topics (ip_hash, created_at);
