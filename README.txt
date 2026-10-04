STOCK SCAN — v1.26

UPDATER FIX
- Removed every automatic UPDATE NOW confirmation from the updater.
- Opening or waking the app performs a silent status check only.
- If current: header shows ✓ Up to date.
- If a genuinely newer published version exists: header shows Update available — vX.
- CHECK UPDATE never creates a popup.
- Restored the small header update-status element beside CHECK UPDATE.
- version.json remains the dedicated, uncached published-version source.
- Existing scan/photo/login/permissions functions remain unchanged.

WHAT TO TEST
1. Upload ALL v1.26 files including version.json.
2. Confirm STOCK SCAN — v1.26.
3. Wait after opening: no update popup. Header should show ✓ Up to date.
4. Press top CHECK UPDATE: Checking… then ✓ Up to date, with no popup.
5. Turn screen off, wake and return: no popup; header returns to ✓ Up to date.
6. Settings > CHECK FOR UPDATE should say ✓ v1.26 IS UP TO DATE.
7. Quick barcode > ADD TO SCAN regression.
