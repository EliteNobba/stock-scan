STOCK SCAN — v1.51

FIND A PART CAMERA FIX
- Fixes “Camera scan failed: Barcode scanner is unavailable”.
- v1.50 referenced the wrong ZXing browser object.
- FIND A PART now uses the same ZXing.BrowserMultiFormatReader API already used by the proven main SCAN PARTS scanner.
- Successful camera scan fills the Find a Part field and searches automatically.
- Cancel closes/resets the camera.
- Real MechanicDesk export.xls import/search remains unchanged.

WHAT TO TEST — STOP AT FIRST FAILURE
1. Confirm STOCK SCAN — v1.51 and ✓ Up to date.
2. Admin > FIND A PART.
3. Tap SCAN BARCODE WITH CAMERA.
4. Confirm camera opens without “barcode scanner is unavailable”.
5. Scan a known barcode from export.xls.
6. Confirm matching part appears automatically.
7. Test CANCEL SCAN.
8. Confirm AL400C text search still works.
9. Normal User > FIND A PART > test camera scan.
10. Quick normal SCAN PARTS > barcode > ADD TO SCAN regression.
