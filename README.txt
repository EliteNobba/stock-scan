STOCK SCAN — v1.61

NORMAL USER PART DETAILS FIX
- Fixes Normal User results opening with no visible details.
- Existing permission values such as "Part Number" and "Buy Price" are now mapped to the internal PART DETAILS field keys.
- Canonical saved `fields` permissions and latest-user refresh retained.
- v1.60 User Settings History / Restore retained.

WHAT TO TEST — STOP AT FIRST FAILURE
1. Confirm v1.61 and ✓ Up to date.
2. Admin > Normal User: enable Part Number, Description, Supplier and Barcode; turn Buy Price OFF; SAVE.
3. Login as Normal User > FIND A PART > AL400C.
4. Tap first result. PART DETAILS must show permitted fields.
5. Back > tap second result. Details must show.
6. Confirm Buy Price is NOT shown.
7. Admin > same user > turn Buy Price ON > SAVE.
8. Login as Normal User > AL400C > open result. Buy Price MUST show.
9. Admin > same user > USER SETTINGS HISTORY; confirm changes recorded.
10. Camera barcode search > open result.
11. Quick SCAN PARTS regression.
