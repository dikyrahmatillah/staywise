-- Migration: add isOAuth column to users and flag existing OAuth-like accounts
-- Generated: 2025-10-08
-- NOTE: This SQL is written for PostgreSQL (Supabase). Adjust if using another dialect.

BEGIN;

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "isOAuth" boolean DEFAULT false;

-- Heuristic: mark users who already have verified email and no password as OAuth
UPDATE "User"
SET "isOAuth" = true
WHERE "emailVerified" IS NOT NULL
  AND ("password" IS NULL OR "password" = '');

COMMIT;
