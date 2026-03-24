-- Run this once in Vercel Postgres query editor after connecting the integration
-- Vercel Dashboard → Storage → Your DB → Query

CREATE TABLE IF NOT EXISTS content_batches (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date          DATE NOT NULL UNIQUE,
  service_block CHAR(1) NOT NULL,
  generated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status        TEXT NOT NULL DEFAULT 'pending_review',
  topic_hint    TEXT
);

CREATE TABLE IF NOT EXISTS content_posts (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id          UUID NOT NULL REFERENCES content_batches(id) ON DELETE CASCADE,
  platform          TEXT NOT NULL,
  content_type      TEXT NOT NULL,
  raw_content       TEXT NOT NULL,
  edited_content    TEXT,
  status            TEXT NOT NULL DEFAULT 'pending',
  sort_order        INT NOT NULL DEFAULT 0,
  pushed_at         TIMESTAMPTZ,
  metricool_post_id TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_posts_batch_id ON content_posts(batch_id);
CREATE INDEX IF NOT EXISTS idx_batches_date ON content_batches(date);
