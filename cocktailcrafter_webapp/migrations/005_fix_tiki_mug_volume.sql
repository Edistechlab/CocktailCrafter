-- Migration: 005_fix_tiki_mug_volume.sql
-- Description: Set Tiki Mug volume to 450ml (was NULL)
-- Date: 2026-03-11

UPDATE GlassType SET volume = 450 WHERE name LIKE '%Tiki%';
