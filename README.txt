STOCK SCAN — v1.58

PART DETAILS + USER FIELD PERMISSIONS
- Builds on confirmed stable v1.57.
- PART DETAILS now has a cleaner label/value layout.
- Admin sees all supported Find a Part fields.
- Normal Users use their existing Find Part field visibility permissions.
- Supported detail permissions include Part Number, Description, Barcode, Supplier, Buy Price, Sell Price, Category, Location, Quantity, Minimum Qty and Maximum Qty when data exists.
- Buy/Sell prices are formatted as currency when numeric.
- Source remains visible for troubleshooting/data provenance.
- Existing import, AL400C multiple results, camera barcode search and 12/13-digit matching are unchanged.

WHAT TO TEST — STOP AT FIRST FAILURE
1. Confirm STOCK SCAN — v1.58 and ✓ Up to date.
2. Admin > FIND A PART > search AL400C.
3. Open each AL400C result and confirm the new labelled detail layout.
4. Confirm Buy Price and Supplier match export.xls.
5. Admin > USERS & PERMISSIONS > choose a Normal User.
6. Turn OFF one Find Part field such as Buy Price and save.
7. Log in as that Normal User > FIND A PART > open AL400C.
8. Confirm the disabled field is NOT shown and permitted fields ARE shown.
9. Re-enable the field and confirm it returns.
10. Camera barcode search > open result.
11. Quick SCAN PARTS > barcode > ADD TO SCAN regression.
