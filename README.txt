STOCK SCAN — v1.50

FIND A PART — CAMERA BARCODE SEARCH
- Adds SCAN BARCODE WITH CAMERA directly to FIND A PART.
- Reuses the app's existing ZXing camera barcode scanner.
- A successful scan automatically places the barcode into the Find a Part search field and runs the search.
- CANCEL SCAN stops the camera.
- Text search remains available.
- Real MechanicDesk export.xls import from v1.49 remains unchanged.
- SCAN PARTS remains visible to Normal Users during development/testing.

WHAT TO TEST — STOP AT FIRST FAILURE
1. Confirm STOCK SCAN — v1.50 and ✓ Up to date.
2. Admin > FIND A PART.
3. Confirm SCAN BARCODE WITH CAMERA is visible.
4. Tap it and allow camera access if requested.
5. Scan a barcode that you know exists in export.xls.
6. Confirm the barcode is detected and the matching part appears automatically.
7. Try CANCEL SCAN and confirm the camera closes.
8. Confirm normal text search for AL400C still works.
9. Normal User > FIND A PART > confirm camera barcode search is also available.
10. Close/reopen and confirm imported MechanicDesk data still searches.
11. Quick normal SCAN PARTS > barcode > ADD TO SCAN regression.
