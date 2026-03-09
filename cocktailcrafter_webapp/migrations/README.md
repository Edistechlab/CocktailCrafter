# Migrations

Jede Datei = eine Änderung an der Datenbank.

## Workflow

### Beim Entwickeln (lokal):
1. Änderung lokal in SQLite machen
2. SQL-Datei in diesem Ordner erstellen: `002_beschreibung.sql`
3. `git push` → Vercel deployed automatisch den neuen Code

### Beim Deploy (Daten auf Hostinger):
1. Neue `.sql` Dateien seit letztem Deploy in phpMyAdmin ausführen
2. Fertig

## Migrations Log

| Datei | Datum | Beschreibung |
|-------|-------|--------------|
| 001_fix_bottle_ids_and_na_alternatives.sql | 2026-03-09 | Fix 7 Rezepte mit falschen Bottle-IDs, 3 fehlende Flaschen hinzugefügt, Whiskey/Bourbon NA-Alternativen gesetzt |
