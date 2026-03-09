-- Migration 002: Add Raspberry Syrup bottle + fix Clover Club recipe
-- Applied: 2026-03-09

INSERT IGNORE INTO `Bottle` (`id`, `name`, `category`, `type`, `alcoholContent`, `sugarContent`, `acidity`, `createdAt`, `updatedAt`)
VALUES ('fix_raspberry_syrup_001', 'Raspberry Syrup', 'Syrup', 'Syrup', 0, 55, 0.2, NOW(), NOW());

UPDATE `Cocktail` SET `mixList` = '[{"bottleId":"cmmgep3je0001o1nwu7e8off1","name":"Gin","amount":1.5,"pourOrder":1},{"bottleId":"cmmgep3pp00ioo1nwgfpska2u","name":"Lemon Juice","amount":0.75,"pourOrder":1},{"bottleId":"fix_raspberry_syrup_001","name":"Raspberry Syrup","amount":0.5,"pourOrder":1},{"bottleId":"cmmgep3qv00mgo1nwc960yavi","name":"Simple Syrup","amount":0.25,"pourOrder":1}]'
WHERE `name` = 'Clover Club';
