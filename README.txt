STOCK SCAN — v1.64

SECTION VISIBILITY IN FIND A PART
- FIND A PART shows which Sections the logged-in user can search.
- Result cards identify their Section.
- PART DETAILS shows the Section.
- v1.63 section access filtering remains unchanged.
- MechanicDesk import controls remain visible to Normal Users during development/testing only; final production will hide them.

WHAT TO TEST — STOP AT FIRST FAILURE
1. Confirm v1.64 and ✓ Up to date.
2. Admin > FIND A PART. 'Searching sections:' should list all Sections.
3. Search AL400C. Results should identify Work.
4. Open both results. PART DETAILS should show Section: Work.
5. Normal User with Work access > FIND A PART. 'Searching sections:' should include Work.
6. Search AL400C; results/details should show Work.
7. Admin removes Work access from that user.
8. Normal User > FIND A PART. Work must disappear and AL400C Work results must not appear.
9. Restore Work access and confirm results return.
10. Camera barcode search and SCAN PARTS regression.
