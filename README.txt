STOCK SCAN — v1.56

FIND A PART RESULT TAP FIX
- Fixes visible Find a Part results not opening when tapped.
- Each result now has its own direct PART DETAILS action rather than relying on the later delegated click handler.
- Result buttons are explicitly type="button" so they cannot behave like submit/navigation controls.
- v1.55 visible result text fix retained.
- MechanicDesk import, text search, camera barcode search and 12/13-digit barcode matching unchanged.

WHAT TO TEST — STOP AT FIRST FAILURE
1. Confirm STOCK SCAN — v1.56 and ✓ Up to date.
2. Admin > FIND A PART > search AL400C.
3. Confirm the two AL400C results contain visible text.
4. Tap the FIRST result. PART DETAILS must open and contain data.
5. BACK TO RESULTS.
6. Tap the SECOND result. PART DETAILS must open and contain data.
7. Test camera barcode search > tap its result.
8. Quick SCAN PARTS > barcode > ADD TO SCAN regression.
