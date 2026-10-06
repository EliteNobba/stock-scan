STOCK SCAN — v1.72

SERVICE WORKER / UPDATER REDESIGN
- Prevents old index.html versions from being restored by the service worker.
- index.html/navigation is now always network-only and is never stored in the Stock Scan service-worker cache.
- Only versioned static assets are cached.
- Activation removes older Stock Scan caches.
- UPDATE asks the registration to update, waits for service-worker controllerchange, and reloads only after the new worker actually takes control.
- If iOS does not transfer control promptly, the app says: “vX ready — close and reopen Stock Scan”.
- No localStorage or IndexedDB data is cleared.
- v1.71 photo/detail fix and Find result shading are retained.

WHAT TO TEST — STOP AT FIRST FAILURE
1. Leave GitHub on v1.71 until ready to publish v1.72.
2. Publish all v1.72 files together.
3. On the phone, wait for Update available — v1.72.
4. Press UPDATE once.
5. Either:
   A) it changes to v1.72 itself, or
   B) it says “v1.72 ready — close and reopen Stock Scan”; close/reopen once.
6. Confirm STOCK SCAN — v1.72 and Up to date.
7. Close/reopen the app TWO more times. It must remain v1.72 every time.
8. Admin > FIND A PART > approved Add Part with photo > PART DETAILS; photo must appear.
9. Confirm Find results alternate shaded / white.
10. Quick AL400C, camera barcode and SCAN PARTS regression.
