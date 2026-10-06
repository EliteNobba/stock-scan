STOCK SCAN — v1.65

SEARCHING SECTIONS DISPLAY FIX
- Fixes the missing 'Searching sections:' line on FIND A PART.
- Root cause: in v1.64 the Searching Sections element was nested inside the MechanicDesk import-status paragraph.
- Updating the MechanicDesk status replaced that paragraph's content and removed the Searching Sections element.
- v1.65 gives Searching Sections its own separate display element.
- All v1.64 section filtering, result Section labels and PART DETAILS Section display are retained.

WHAT TO TEST — STOP AT FIRST FAILURE
1. Confirm v1.65 and ✓ Up to date.
2. Admin > FIND A PART.
3. Directly below the MechanicDesk parts-loaded status, confirm 'Searching sections:' is visible and lists the Admin sections.
4. Search AL400C. Confirm results identify Work.
5. Open both results. Confirm PART DETAILS shows Section: Work.
6. Normal User with Work access > FIND A PART. Confirm 'Searching sections:' includes Work.
7. Remove Work access from that Normal User.
8. Login as Normal User > FIND A PART. Confirm Work is absent and AL400C Work results do not appear.
9. Restore Work access and confirm results return.
10. Quick camera barcode and SCAN PARTS regression.
