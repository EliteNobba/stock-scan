STOCK SCAN — v1.57

FIND A PART DETAIL NAVIGATION FIX
- Actual root cause found: showPartDetail() called show('partdetail'), but this app's navigation function is go().
- Changed it to go('partdetail').
- Result buttons are wired immediately after search results are rendered.
- Keeps v1.55 visible-text fix and all v1.52 import/barcode fixes.

WHAT TO TEST — STOP AT FIRST FAILURE
1. Confirm STOCK SCAN — v1.57 and ✓ Up to date.
2. Admin > FIND A PART > search AL400C.
3. Confirm two visible AL400C results.
4. Tap FIRST result.
5. PART DETAILS must open and show data.
6. BACK TO RESULTS, tap SECOND result.
7. Confirm its PART DETAILS.
8. Camera barcode search > tap result > details.
9. Quick SCAN PARTS > barcode > ADD TO SCAN regression.
