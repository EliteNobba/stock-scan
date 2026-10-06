STOCK SCAN — v1.66

CLEAN FIND A PART + ADMIN DATA SETTINGS + AUTO UPDATE CHECK
- FIND A PART now contains everyday search/scanner controls rather than data-file setup.
- MechanicDesk Parts File, Import into Section and Import Parts File moved to Settings > App / Data Settings > Data Files.
- FIND A PART gives a setup prompt if no MechanicDesk data is loaded.
- While the app is open/visible it silently checks version.json every 15 seconds.
- Returning from background/screen-off still triggers an immediate check.
- Automatic checks never popup or install. A newer version changes the top button to UPDATE.
- v1.65 section filtering/display retained.

WHAT TO TEST — STOP AT FIRST FAILURE
1. Confirm v1.66 and ✓ Up to date.
2. Admin > FIND A PART. MechanicDesk file/import controls must be gone.
3. Confirm Searching sections is still visible.
4. Search AL400C and open both results.
5. Admin > SETTINGS > APP / DATA SETTINGS > DATA FILES.
6. Confirm FIND A PART — MECHANICDESK DATA has Parts File, Import into Section and IMPORT PARTS FILE.
7. Confirm existing imported parts still work; re-import export.xls into Work if desired.
8. Normal User > FIND A PART. Text search and camera barcode search must work.
9. For the updater, leave the app open after a newer build is published. Within about 15 seconds it should show Update available and change the button to UPDATE without a popup.
10. Quick SCAN PARTS regression.
