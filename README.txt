STOCK SCAN — v1.68

FIND A PART PHOTOS + RESULT SHADING FIX
- Approved custom Add Part records can now show their stored photo in PART DETAILS when the logged-in user has Photo permission.
- Photo remains hidden when Photo permission is disabled.
- Find a Part result shading now uses explicit per-result classes and stronger CSS so the existing card/button styling cannot override it.
- Alternates shaded / white / shaded / white.
- v1.67 automatic 15-second update checking retained.

WHAT TO TEST — STOP AT FIRST FAILURE
1. Leave v1.67 open while v1.68 is published. Confirm it detects v1.68 automatically within about 15 seconds and changes to UPDATE.
2. Update and confirm v1.68 and ✓ Up to date.
3. FIND A PART > search AL400C or another search with multiple results.
4. Confirm results visibly alternate shaded / white / shaded / white.
5. Find an APPROVED part that was submitted through ADD A PART with a photo.
6. Admin > open that part in FIND A PART > PART DETAILS. Confirm its photo appears.
7. Normal User with Photo permission ON > find/open that approved part. Photo must appear.
8. Turn that user's Photo permission OFF > save.
9. Login as that Normal User > open the same part. Photo must NOT appear.
10. Confirm AL400C MechanicDesk details, camera barcode search and SCAN PARTS still work.
