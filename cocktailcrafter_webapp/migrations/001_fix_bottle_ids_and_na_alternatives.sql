-- Migration 001: Fix broken bottle IDs in recipes + add missing bottles + NA alternatives
-- Applied: 2026-03-09
-- Description: 7 cocktail recipes had old/invalid bottle IDs. Added 3 missing bottles.
--              Set non-alcoholic alternatives for Whiskey/Bourbon family.

-- Add missing bottles
INSERT IGNORE INTO `Bottle` (`id`, `name`, `category`, `type`, `alcoholContent`, `sugarContent`, `acidity`, `createdAt`, `updatedAt`)
VALUES
  ('fix_cherry_liqueur_001', 'Cherry Liqueur', 'Liqueur', 'Liqueur', 24, 30, 0, NOW(), NOW()),
  ('fix_apricot_brandy_001', 'Apricot Brandy', 'Liqueur', 'Brandy', 30, 25, 0, NOW(), NOW()),
  ('fix_passion_fruit_syrup01', 'Passion Fruit Syrup', 'Syrup', 'Syrup', 0, 60, 0.3, NOW(), NOW());

-- Set NA alternatives for Whiskey family
UPDATE `Bottle` SET `nonAlcoholicId` = 'cmmgg6qjm0000epiww60c0w0p' WHERE `name` = 'Bourbon' AND `nonAlcoholicId` IS NULL;
UPDATE `Bottle` SET `nonAlcoholicId` = 'cmmgg6qjm0000epiww60c0w0p' WHERE `name` IN ('Whiskey','Tennessee Whiskey','Irish Whiskey') AND `nonAlcoholicId` IS NULL;

-- Fix Negroni
UPDATE `Cocktail` SET `mixList` = '[{"bottleId":"cmmgep3je0001o1nwu7e8off1","name":"Gin","amount":1,"pourOrder":1},{"bottleId":"cmmgep3ol00f6o1nwinexd6jf","name":"Campari","amount":1,"pourOrder":1},{"bottleId":"cmmgep3mi0096o1nwz7p1ekwb","name":"Sweet Vermouth","amount":1,"pourOrder":1}]' WHERE `name` = 'Negroni';

-- Fix Daiquiri
UPDATE `Cocktail` SET `mixList` = '[{"bottleId":"cmmgep3lc005io1nw328zeizv","name":"White Rum","amount":2,"pourOrder":1},{"bottleId":"cmmgep3pr00iwo1nw8lhyzmpp","name":"Lime Juice","amount":0.75,"pourOrder":1},{"bottleId":"cmmgep3qv00mgo1nwc960yavi","name":"Simple Syrup","amount":0.5,"pourOrder":1}]' WHERE `name` = 'Daiquiri';

-- Fix Gimlet
UPDATE `Cocktail` SET `mixList` = '[{"bottleId":"cmmgep3je0001o1nwu7e8off1","name":"Gin","amount":2,"pourOrder":1},{"bottleId":"cmmgep3pr00iwo1nw8lhyzmpp","name":"Lime Juice","amount":0.75,"pourOrder":1},{"bottleId":"cmmgep3qv00mgo1nwc960yavi","name":"Simple Syrup","amount":0.75,"pourOrder":1}]' WHERE `name` = 'Gimlet';

-- Fix Singapore Sling
UPDATE `Cocktail` SET `mixList` = '[{"bottleId":"cmmgep3je0001o1nwu7e8off1","name":"Gin","amount":1.5,"pourOrder":1},{"bottleId":"fix_cherry_liqueur_001","name":"Cherry Liqueur","amount":0.5,"pourOrder":1},{"bottleId":"cmmgep3nx00d4o1nwgbkk3giv","name":"Triple Sec","amount":0.25,"pourOrder":1},{"bottleId":"cmmgep3pu00j4o1nwasmem21y","name":"Pineapple Juice","amount":4,"pourOrder":2},{"bottleId":"cmmgep3pr00iwo1nw8lhyzmpp","name":"Lime Juice","amount":0.5,"pourOrder":2}]' WHERE `name` = 'Singapore Sling';

-- Fix Zombie
UPDATE `Cocktail` SET `mixList` = '[{"bottleId":"cmmgep3lc005io1nw328zeizv","name":"White Rum","amount":1.5,"pourOrder":1},{"bottleId":"cmmgep3lj0064o1nwcank12o2","name":"Dark Rum","amount":1.5,"pourOrder":1},{"bottleId":"fix_apricot_brandy_001","name":"Apricot Brandy","amount":0.5,"pourOrder":1},{"bottleId":"cmmgep3pu00j4o1nwasmem21y","name":"Pineapple Juice","amount":2,"pourOrder":2},{"bottleId":"cmmgep3pr00iwo1nw8lhyzmpp","name":"Lime Juice","amount":1,"pourOrder":2}]' WHERE `name` = 'Zombie';

-- Fix Hurricane
UPDATE `Cocktail` SET `mixList` = '[{"bottleId":"cmmgep3lc005io1nw328zeizv","name":"White Rum","amount":2,"pourOrder":1},{"bottleId":"cmmgep3lj0064o1nwcank12o2","name":"Dark Rum","amount":2,"pourOrder":1},{"bottleId":"fix_passion_fruit_syrup01","name":"Passion Fruit Syrup","amount":1,"pourOrder":1},{"bottleId":"cmmgep3pm00ieo1nwl3fd8emz","name":"Orange Juice","amount":2,"pourOrder":2},{"bottleId":"cmmgep3pr00iwo1nw8lhyzmpp","name":"Lime Juice","amount":1,"pourOrder":2}]' WHERE `name` = 'Hurricane';

-- Fix Whiskey Sour
UPDATE `Cocktail` SET `mixList` = '[{"bottleId":"cmmgep3jr000io1nw2k85pm7x","name":"Bourbon","amount":2,"pourOrder":1},{"bottleId":"cmmgep3pp00ioo1nwgfpska2u","name":"Lemon Juice","amount":0.75,"pourOrder":1},{"bottleId":"cmmgep3qv00mgo1nwc960yavi","name":"Simple Syrup","amount":0.5,"pourOrder":1}]' WHERE `name` = 'Whiskey Sour';
