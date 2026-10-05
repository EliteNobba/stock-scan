STOCK SCAN — v1.54

FIND A PART RESULT DISPLAY FIX
- Fixes v1.53 showing the correct number of AL400C result cards but leaving the cards blank.
- Result rendering now accepts the field names used by both MechanicDesk imports and approved custom parts.
- Part Details uses the same tolerant field mapping.
- No change to the confirmed v1.52 barcode matching/import engine.

WHAT TO TEST — STOP AT FIRST FAILURE
1. Confirm STOCK SCAN — v1.54 and ✓ Up to date.
2. Admin > FIND A PART > search AL400C.
3. Confirm TWO result cards appear and BOTH contain visible Part Number/Description information.
4. Tap the first result and confirm PART DETAILS contains data.
5. Back to Results, tap the second result and confirm its details.
6. Test camera barcode search and confirm the result text is visible.
7. Quick SCAN PARTS > barcode > ADD TO SCAN regression.
