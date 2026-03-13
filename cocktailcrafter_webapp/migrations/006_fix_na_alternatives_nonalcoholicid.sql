-- Migration: 006_fix_na_alternatives_nonalcoholicid.sql
-- Description: Set nonAlcoholicId on 14 alcoholic bottles whose Lyre's NA
--              alternatives were stored as parentId children but NOT linked
--              via nonAlcoholicId → NA toggle showed "No alternative" warning
-- Date: 2026-03-13

-- Coffee Liqueur → Lyre's Coffee Originale
UPDATE Bottle SET nonAlcoholicId = 'cmmgg6qjy000aepiw6pmye9ac' WHERE id = 'cmmgep3nz00dco1nwwr7os5qm';
UPDATE Bottle SET nonAlcoholicId = 'cmmgg6qjy000aepiw6pmye9ac' WHERE id = 'fix_coffee_liqueur_001';

-- Almond Liqueur → Lyre's Amaretti
UPDATE Bottle SET nonAlcoholicId = 'cmmgg6qjz000bepiw0khom91d' WHERE id = 'cmmgep3od00eeo1nwea1ipwih';

-- Aperitif Bitter → Lyre's Italian Spritz
UPDATE Bottle SET nonAlcoholicId = 'cmmgg6qjx0009epiw692znwmv' WHERE id = 'cmmgep3ol00f4o1nw104oclvj';

-- Bianco Vermouth → Lyre's Aperitif White
UPDATE Bottle SET nonAlcoholicId = 'cmmgg6qjx0008epiwrblrzyff' WHERE id = 'cmmgep3ml009go1nwlaohj401';

-- Blanche (Absinthe) → Lyre's Absinthe
UPDATE Bottle SET nonAlcoholicId = 'cmmgg6qk0000cepiwk0eb4wgn' WHERE id = 'cmmgep3pi00i2o1nw2mc9c0jo';

-- Blanco (Tequila) → Lyre's Agave Blanco
UPDATE Bottle SET nonAlcoholicId = 'cmmgg6qjt0005epiwm5klubep' WHERE id = 'cmmgep3m1007oo1nwnu0bwiwk';

-- Classic Vodka → Lyre's Classico
UPDATE Bottle SET nonAlcoholicId = 'cmmlyreclassico0001vodka' WHERE id = 'cmmgep3mr00a0o1nwowbk1o9v';

-- Gold Rum → Lyre's Cane Spirit
UPDATE Bottle SET nonAlcoholicId = 'cmmlyrecanespirit001rum' WHERE id = 'cmmgep3lg005uo1nwmsry6orw';

-- London Dry Gin → Lyre's Dry London Spirit
UPDATE Bottle SET nonAlcoholicId = 'cmmgg6qjq0002epiw2r2wf55j' WHERE id = 'cmmgep3km0038o1nwzqdr6mpr';

-- Reposado (Tequila) → Lyre's Agave Reserva
UPDATE Bottle SET nonAlcoholicId = 'cmmlyreagavareserva001teq' WHERE id = 'cmmgep3m50080o1nw3czxbgfd';

-- Scotch Single Malt → Lyre's Highland Malt
UPDATE Bottle SET nonAlcoholicId = 'cmmgg6qjp0001epiw57lor76m' WHERE id = 'cmmgep3jz0016o1nw91d4gbjl';

-- Sparkling Wine → Lyre's American Sparkling
UPDATE Bottle SET nonAlcoholicId = 'cmmlyress00sparklingw1ne' WHERE id = 'cmmgep3jn000bo1nw11qorpck';

-- Spiced Rum → Lyre's Spiced Cane Spirit
UPDATE Bottle SET nonAlcoholicId = 'cmmlyrespicedcane001rum' WHERE id = 'cmmgep3ln006eo1nwh33n4zg2';
