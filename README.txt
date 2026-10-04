STOCK SCAN — v1.25

UPDATER REBUILD IN v1.25
- Update checks now use a dedicated version.json file instead of reading the app HTML.
- version.json is explicitly excluded from the service-worker cache.
- The running app version is compared numerically against the published version.
- Same version = ✓ Up to date.
- Older published/cached version = ✓ Up to date; never downgrade.
- Only a strictly newer published version can show NEW VERSION AVAILABLE.
- Header status automatically shows the result after launch/wake.
- Existing login, permissions, password, scan and photo functions are unchanged.

DEPLOYMENT NOTE
Upload ALL files from this package to GitHub, including version.json. version.json must always match the released app version.

WHAT TO TEST
1. Upload all v1.25 files, including version.json.
2. Confirm STOCK SCAN — v1.25.
3. Wait briefly: top status should become ✓ Up to date.
4. Press top CHECK UPDATE: Checking… then ✓ Up to date. It must NOT offer v1.25 as an update.
5. Settings > CHECK FOR UPDATE: ✓ v1.25 IS UP TO DATE.
6. Turn phone screen off, wake it and return. No false update prompt should appear.
7. Quick regression: barcode > ADD TO SCAN.
