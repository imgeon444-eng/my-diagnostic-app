-- Migration: 20261018_url_marketing_audits.sql
-- Purpose: Commercial-grade 2F URL Marketing Inspector REA Telemetry & Evidence Ledger Schema
-- Enforces backward compatibility and GIN indexing for B2B Target Sniper CRM filtering.

CREATE TABLE IF NOT EXISTS public.url_marketing_audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evidence_id TEXT NOT NULL UNIQUE,
  schema_version TEXT NOT NULL DEFAULT '2.0.0-rea-telemetry',
  platform TEXT NOT NULL CHECK (platform IN ('web', 'youtube', 'instagram')),
  target_url TEXT NOT NULL,
  final_url TEXT,
  brand_name TEXT NOT NULL,
  category TEXT DEFAULT '비즈니스 퍼널',
  http_status INTEGER DEFAULT 0,
  ttfb_ms INTEGER DEFAULT 0,
  is_https BOOLEAN DEFAULT TRUE,
  detected_stack TEXT[] DEFAULT '{}',
  detected_pixels TEXT[] DEFAULT '{}',
  crm_widgets TEXT[] DEFAULT '{}',
  has_lead_form BOOLEAN DEFAULT FALSE,
  cta_count INTEGER DEFAULT 0,
  geo_score INTEGER NOT NULL DEFAULT 0,
  overall_score INTEGER NOT NULL DEFAULT 0,
  monthly_leakage_krw BIGINT NOT NULL DEFAULT 0,
  annual_leakage_krw BIGINT NOT NULL DEFAULT 0,
  bottleneck_phase TEXT,
  severity TEXT,
  telemetry_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  public_report_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  artifact_sha256 TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_url_audits_platform_created
  ON public.url_marketing_audits (platform, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_url_audits_pixels_gin
  ON public.url_marketing_audits USING GIN (detected_pixels);

CREATE INDEX IF NOT EXISTS idx_url_audits_stack_gin
  ON public.url_marketing_audits USING GIN (detected_stack);

CREATE INDEX IF NOT EXISTS idx_url_audits_leakage
  ON public.url_marketing_audits (monthly_leakage_krw DESC);

ALTER TABLE public.url_marketing_audits ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'url_marketing_audits' AND policyname = 'Allow public insert for diagnostics'
  ) THEN
    CREATE POLICY "Allow public insert for diagnostics"
      ON public.url_marketing_audits
      FOR INSERT
      TO anon, authenticated
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'url_marketing_audits' AND policyname = 'Allow public read for diagnostics'
  ) THEN
    CREATE POLICY "Allow public read for diagnostics"
      ON public.url_marketing_audits
      FOR SELECT
      TO anon, authenticated
      USING (true);
  END IF;
END $$;
