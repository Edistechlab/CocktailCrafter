-- =============================================================================
-- Migration 003: Fix last 10 cocktails + 2 bottle records
-- Generated: 2026-03-09
-- Target: MySQL (Production)
-- =============================================================================
-- Applies the following changes:
--   • Creates new Bottle: Drambuie (fix_drambuie_001)
--   • Fixes Honey-Ginger Syrup: alcoholContent = 0
--   • Fixes Crème de Mûre: alcoholContent = 16
--   • Rewrites recipe JSON for 10 cocktails (broken IDs, missing pourOrder,
--     duplicate ingredients, wrong names)
-- =============================================================================

START TRANSACTION;

-- ---------------------------------------------------------------------------
-- 0. New Bottle: Drambuie
-- ---------------------------------------------------------------------------
INSERT INTO `Bottle` (`id`, `name`, `category`, `type`, `alcoholContent`, `sugarContent`, `acidity`, `createdAt`, `updatedAt`)
VALUES (
  'fix_drambuie_001',
  'Drambuie',
  'Liqueur',
  'Liqueur',
  40,
  20,
  0,
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  `name`           = VALUES(`name`),
  `category`       = VALUES(`category`),
  `type`           = VALUES(`type`),
  `alcoholContent` = VALUES(`alcoholContent`),
  `sugarContent`   = VALUES(`sugarContent`),
  `acidity`        = VALUES(`acidity`),
  `updatedAt`      = NOW();

-- ---------------------------------------------------------------------------
-- 1. Fix bottle data
-- ---------------------------------------------------------------------------

-- Honey-Ginger Syrup: alcoholContent was NULL → 0
UPDATE `Bottle`
SET `alcoholContent` = 0,
    `updatedAt`      = NOW()
WHERE `id` = 'cmmhaha1w0000119gw5jinwru';

-- Crème de Mûre: alcoholContent was NULL → 16
UPDATE `Bottle`
SET `alcoholContent` = 16,
    `updatedAt`      = NOW()
WHERE `id` = 'cmmhaha3m00001ev56h2us4oi';

-- ---------------------------------------------------------------------------
-- 2. Fix cocktail recipes
-- ---------------------------------------------------------------------------

-- 1. Rusty Nail
--    Fixes: broken Scotch Whisky ID → Scotch Single Malt,
--           broken Drambuie ID → fix_drambuie_001,
--           amounts corrected (1.5oz + 0.75oz), pourOrder present
UPDATE `Cocktail`
SET `recipe` = '[{"bottleId":"cmmgep3jz0016o1nw91d4gbjl","name":"Scotch Single Malt","amount":1.5,"pourOrder":1},{"bottleId":"fix_drambuie_001","name":"Drambuie","amount":0.75,"pourOrder":1}]',
    `updatedAt` = NOW()
WHERE `name` = 'Rusty Nail';

-- 2. Kir Royale
--    Fixes: broken Champagne ID, broken Crème de Cassis ID,
--           amounts corrected (Cassis 0.5oz p1, Champagne 4oz p2)
UPDATE `Cocktail`
SET `recipe` = '[{"bottleId":"cmmgep3oa00e8o1nwt39qicg1","name":"Crème de Cassis","amount":0.5,"pourOrder":1},{"bottleId":"cmmgep3p200gmo1nwz3zuw5d5","name":"Champagne","amount":4,"pourOrder":2}]',
    `updatedAt` = NOW()
WHERE `name` = 'Kir Royale';

-- 3. Screwdriver
--    Fixes: missing pourOrder
UPDATE `Cocktail`
SET `recipe` = '[{"bottleId":"cmmgep3ji0005o1nw11qwqv97","name":"Vodka","amount":2,"pourOrder":1},{"bottleId":"cmmgep3pm00ieo1nwl3fd8emz","name":"Orange Juice","amount":4,"pourOrder":2}]',
    `updatedAt` = NOW()
WHERE `name` = 'Screwdriver';

-- 4. Naked and Famous
--    Fixes: missing pourOrder
UPDATE `Cocktail`
SET `recipe` = '[{"bottleId":"cmmgep3jm000ao1nwvx8o3tp6","name":"Mezcal","amount":0.75,"pourOrder":1},{"bottleId":"cmmhaha03000012p6betp0tjy","name":"Yellow Chartreuse","amount":0.75,"pourOrder":1},{"bottleId":"cmmgep3om00f8o1nwo3o2vrgk","name":"Aperol","amount":0.75,"pourOrder":1},{"bottleId":"cmmgep3pr00iwo1nw8lhyzmpp","name":"Lime Juice","amount":0.75,"pourOrder":2}]',
    `updatedAt` = NOW()
WHERE `name` = 'Naked and Famous';

-- 5. Penicillin
--    Fixes: duplicate Honey Syrup removed (keep only Honey-Ginger Syrup at 0.75oz),
--           name "Blended Scotch" → "Scotch Blended",
--           float ingredient Talisker → Scotch Single Malt (name "Islay Single Malt" removed),
--           missing pourOrder added
UPDATE `Cocktail`
SET `recipe` = '[{"bottleId":"cmmgep3k4001oo1nwellioomj","name":"Scotch Blended","amount":2,"pourOrder":1},{"bottleId":"cmmgep3pp00ioo1nwgfpska2u","name":"Lemon Juice","amount":0.75,"pourOrder":2},{"bottleId":"cmmhaha1w0000119gw5jinwru","name":"Honey-Ginger Syrup","amount":0.75,"pourOrder":2},{"bottleId":"cmmgep3jz0016o1nw91d4gbjl","name":"Scotch Single Malt","amount":0.25,"pourOrder":3}]',
    `updatedAt` = NOW()
WHERE `name` = 'Penicillin';

-- 6. Bramble
--    Fixes: missing pourOrder
UPDATE `Cocktail`
SET `recipe` = '[{"bottleId":"cmmgep3je0001o1nwu7e8off1","name":"Gin","amount":1.5,"pourOrder":1},{"bottleId":"cmmgep3pp00ioo1nwgfpska2u","name":"Lemon Juice","amount":0.75,"pourOrder":2},{"bottleId":"cmmgep3qv00mgo1nwc960yavi","name":"Simple Syrup","amount":0.5,"pourOrder":2},{"bottleId":"cmmhaha3m00001ev56h2us4oi","name":"Crème de Mûre","amount":0.5,"pourOrder":3}]',
    `updatedAt` = NOW()
WHERE `name` = 'Bramble';

-- 7. Last Word
--    Fixes: missing pourOrder
UPDATE `Cocktail`
SET `recipe` = '[{"bottleId":"cmmgep3je0001o1nwu7e8off1","name":"Gin","amount":0.75,"pourOrder":1},{"bottleId":"cmmhaha6b0000txph3373eliv","name":"Green Chartreuse","amount":0.75,"pourOrder":1},{"bottleId":"cmmgep3ob00eao1nwu689hpe8","name":"Maraschino Liqueur","amount":0.75,"pourOrder":1},{"bottleId":"cmmgep3pr00iwo1nw8lhyzmpp","name":"Lime Juice","amount":0.75,"pourOrder":2}]',
    `updatedAt` = NOW()
WHERE `name` = 'Last Word';

-- 8. Tequila Sunrise
--    Fixes: missing pourOrder
UPDATE `Cocktail`
SET `recipe` = '[{"bottleId":"cmmgep3m1007oo1nwnu0bwiwk","name":"Tequila","amount":1.5,"pourOrder":1},{"bottleId":"cmmgep3pm00ieo1nwl3fd8emz","name":"Orange Juice","amount":3,"pourOrder":2},{"bottleId":"cmmgep3qx00moo1nwitbb1r9z","name":"Grenadine","amount":0.5,"pourOrder":3}]',
    `updatedAt` = NOW()
WHERE `name` = 'Tequila Sunrise';

-- 9. Amaretto Sour
--    Fixes: Bourbon name "(Cask Strength preferred)" → "Bourbon", missing pourOrder
UPDATE `Cocktail`
SET `recipe` = '[{"bottleId":"cmmgep3o700dyo1nwfoyh7as3","name":"Amaretto","amount":1.5,"pourOrder":1},{"bottleId":"cmmgep3jr000io1nw2k85pm7x","name":"Bourbon","amount":0.75,"pourOrder":1},{"bottleId":"cmmgep3pp00ioo1nwgfpska2u","name":"Lemon Juice","amount":1,"pourOrder":2},{"bottleId":"cmmgep3qv00mgo1nwc960yavi","name":"Simple Syrup","amount":0.25,"pourOrder":2}]',
    `updatedAt` = NOW()
WHERE `name` = 'Amaretto Sour';

-- 10. Millionaire
--     Fixes: Absinthe (0.1oz) added, missing pourOrder
UPDATE `Cocktail`
SET `recipe` = '[{"bottleId":"cmmgep3jr000io1nw2k85pm7x","name":"Bourbon","amount":1.5,"pourOrder":1},{"bottleId":"cmmgep3jn000co1nwr864ucvh","name":"Absinthe","amount":0.1,"pourOrder":1},{"bottleId":"cmmgep3pp00ioo1nwgfpska2u","name":"Lemon Juice","amount":0.75,"pourOrder":2},{"bottleId":"cmmgep3qx00moo1nwitbb1r9z","name":"Grenadine","amount":0.5,"pourOrder":2}]',
    `updatedAt` = NOW()
WHERE `name` = 'Millionaire';

-- ---------------------------------------------------------------------------
-- Verification queries (run after COMMIT to confirm)
-- ---------------------------------------------------------------------------
-- SELECT id, name, alcoholContent FROM Bottle WHERE id IN (
--   'fix_drambuie_001', 'cmmhaha1w0000119gw5jinwru', 'cmmhaha3m00001ev56h2us4oi'
-- );
--
-- SELECT name, recipe FROM Cocktail WHERE name IN (
--   'Rusty Nail', 'Kir Royale', 'Screwdriver', 'Naked and Famous',
--   'Penicillin', 'Bramble', 'Last Word', 'Tequila Sunrise',
--   'Amaretto Sour', 'Millionaire'
-- );

COMMIT;
