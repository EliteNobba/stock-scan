STOCK SCAN — v1.71

UPDATER RECOVERY FIX
- Fixes the update loop where UPDATE says Updating to v1.70 and then returns to Update available.
- Root cause: the updater called serviceWorker.update() and immediately reloaded while the old service worker could still control the installed PWA.
- UPDATE now unregisters the old Stock Scan service worker, clears Stock Scan caches, then performs a cache-busted network navigation.
- Local app data, users, imported parts and IndexedDB photos are NOT cleared.
- v1.70 PART DETAILS photo fix is retained.
- Alternating Find a Part shading is retained.

WHAT TO TEST — STOP AT FIRST FAILURE
1. Publish v1.71.
2. On the currently stuck app, wait for Update available — v1.71.
3. Press UPDATE once.
4. Confirm the app opens as STOCK SCAN — v1.71 and shows Up to date.
5. Close and reopen the Home Screen app; confirm it remains v1.71.
6. Admin > FIND A PART > approved Add Part with photo > PART DETAILS; confirm photo appears.
7. Confirm multiple Find results alternate shaded / white.
8. Quick AL400C, camera barcode and SCAN PARTS regression.
