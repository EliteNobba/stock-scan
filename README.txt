STOCK SCAN — v1.30

CRITICAL CACHE / ASSET FIX
- Found the root cause of the mixed-version behaviour: index.html and the service worker were still loading app.js/styles.css with the old v1.18 cache URL.
- This allowed a new heading/version.json to appear while old JavaScript was actually running.
- index.html, app.js, styles.css, manifest cache references, service worker cache and version.json are now all aligned to v1.30.
- This should also fix ADD A PART doing nothing, because the v1.29 Add Part JavaScript can now actually load.
- The v1.29 Add Part -> Pending Admin Approval features are retained.

WHAT TO TEST
1. Upload/replace ALL v1.30 files.
2. Open app. Confirm heading STOCK SCAN — v1.30.
3. Top updater must settle on CHECK UPDATE + ✓ Up to date. Stop if it says Update available v1.30.
4. Login Normal User and press ADD A PART. The Add a Part screen must open. Stop if it does not.
5. Submit without Description/Photo: it must refuse.
6. Add Description + Photo and SUBMIT FOR REVIEW.
7. Login Admin: PENDING PARTS should show 1 waiting.
8. Review details, then APPROVE.
9. Repeat and test REJECT.
10. Quick barcode > ADD TO SCAN.
