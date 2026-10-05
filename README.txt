STOCK SCAN — v1.59

FIND PART PERMISSION REFRESH FIX
- Fixes a Find Part field not returning after Admin re-enables it.
- PART DETAILS now refreshes the logged-in user's permissions from the latest saved user record before deciding which fields to show.
- v1.58 permission hiding and detail layout retained.
- v1.57 search/result navigation and v1.52 barcode/import engine unchanged.

WHAT TO TEST — STOP AT FIRST FAILURE
1. Confirm STOCK SCAN — v1.59 and ✓ Up to date.
2. Admin > USERS & PERMISSIONS > Normal User.
3. Turn Buy Price OFF and save.
4. Log in as that Normal User > FIND A PART > AL400C > details. Buy Price must be hidden.
5. Log back in as Admin > re-enable Buy Price for the same user and save.
6. Log back in as that Normal User > FIND A PART > AL400C > details.
7. Buy Price must now be visible again.
8. Repeat OFF then ON with another field such as Supplier.
9. Camera barcode search > open result.
10. Quick SCAN PARTS > barcode > ADD TO SCAN regression.
