STOCK SCAN — v1.73

UPDATE CHECK STATUS FIX
- Retains the successful v1.72 service-worker/updater redesign.
- Fixes manual CHECK UPDATE so a same/current published version returns:
  ✓ Up to date
- Manual check shows Checking… while checking.
- Newer version still changes the button/status to UPDATE / Update available.
- Failed manual checks show Check failed.
- Automatic 15-second and wake checks remain silent and do not install updates.
- No localStorage or IndexedDB data is cleared.
- v1.71/v1.72 photo detail fix and Find result shading retained.

WHAT TO TEST — STOP AT FIRST FAILURE
1. Publish all v1.73 files together.
2. Wait for v1.72 to show Update available — v1.73.
3. Press UPDATE once and reach STOCK SCAN — v1.73.
4. Close/reopen twice; it must stay v1.73.
5. Press CHECK UPDATE.
6. It must briefly show Checking… then ✓ Up to date.
7. Admin > FIND A PART > approved Add Part with photo > PART DETAILS; photo must appear.
8. Confirm Find results alternate shaded / white.
9. Quick AL400C, camera barcode and SCAN PARTS regression.
