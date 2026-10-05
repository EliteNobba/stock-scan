STOCK SCAN — v1.60

PERMISSION FIX + USER SETTINGS HISTORY
- Actual Buy Price bug fixed: Users & Permissions saves visibility in `fields`; PART DETAILS was reading `findFields`.
- Added per-user settings history with Admin/date/time and before/after role, enabled, sections and Find Part fields.
- RESTORE PREVIOUS SETTINGS restores an earlier configuration and records the restore.
- History starts with changes made from v1.60 onward.

WHAT TO TEST — STOP AT FIRST FAILURE
1. Confirm v1.60 and ✓ Up to date.
2. Admin > Normal User > turn Buy Price ON > SAVE.
3. Login as Normal User > FIND A PART > AL400C > details.
4. Buy Price MUST appear.
5. Admin > same user > turn Buy Price OFF > SAVE.
6. Login as Normal User and confirm Buy Price is hidden.
7. Admin > same user > USER SETTINGS HISTORY; confirm both changes are recorded.
8. RESTORE PREVIOUS SETTINGS to a setup where Buy Price was ON.
9. Login as Normal User > AL400C; Buy Price must be visible again.
10. Camera barcode search and SCAN PARTS regression.
