STOCK SCAN — v1.63

SECTION-AWARE MECHANICDESK DATA
- FIND A PART MechanicDesk import can now be assigned to a Section.
- The selected section is remembered.
- Existing older MechanicDesk imports default to Work.
- Admin can search all imported MechanicDesk parts.
- Normal Users only see MechanicDesk results if they have access to that Section.
- Approved Add Part section filtering remains.
- v1.62 Users & Permissions and settings history/restore retained.

WHAT TO TEST — STOP AT FIRST FAILURE
1. Confirm v1.63 and ✓ Up to date.
2. Admin > FIND A PART. Confirm 'Import into section' appears.
3. Select Work and import export.xls.
4. Confirm status shows the number of parts and 'Section: Work'.
5. Admin search AL400C and open both results.
6. Normal User WITH Work access > search AL400C. Results must appear and open.
7. Admin > EDIT USERS > remove Work access from that Normal User > SAVE.
8. Login as Normal User > search AL400C. MechanicDesk Work results must NOT appear.
9. Admin > restore Work access. Normal User AL400C results must return.
10. Confirm User Settings History records the Work access change.
11. Camera barcode search and SCAN PARTS regression.
