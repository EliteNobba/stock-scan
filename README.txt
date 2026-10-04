STOCK SCAN — v1.27

CRITICAL UPDATE FIX
- Corrected the internal APP_VERSION runtime constant. It had incorrectly remained at 1.22 even though the visible header/version.json showed newer versions.
- Header, runtime APP_VERSION, version.json and service worker are now all v1.27.
- No automatic update popup.
- Same published/running version displays ✓ Up to date.

WHAT TO TEST
1. Upload ALL v1.27 files including version.json.
2. Confirm STOCK SCAN — v1.27.
3. Wait: beside CHECK UPDATE must show ✓ Up to date.
4. Press CHECK UPDATE: Checking… then ✓ Up to date.
5. Settings check must say ✓ v1.27 IS UP TO DATE.
6. Screen off/on: no popup and ✓ Up to date.
7. Quick barcode > ADD TO SCAN.
