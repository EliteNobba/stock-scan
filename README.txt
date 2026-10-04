STOCK SCAN — v1.38

IMPROVED REVIEW AUDIT DETAILS
- Review History now records both BEFORE and AFTER values for future re-review field edits.
- History displays the exact field changed and old value → new value.
- Section IDs are displayed as section names where possible.
- Decision changes continue to display APPROVED → REJECTED / REJECTED → APPROVED.
- Older v1.37 history remains readable; new detailed before/after data begins with v1.38 edits.
- SCAN PARTS remains visible to Normal Users during development/testing.
- Final production build requirement: hide/remove SCAN PARTS for Normal Users.

WHAT TO TEST
1. Confirm STOCK SCAN — v1.38 and ✓ Up to date.
2. Admin > REVIEWED PARTS > RE-REVIEW / EDIT.
3. Change Description from one value to another and SAVE CHANGES.
4. Reopen > Review History should show Description: old value → new value.
5. Change Section and another field > SAVE > reopen.
6. Confirm both changed fields and their old → new values are shown.
7. Change approval decision and confirm the status transition still appears.
8. Normal User: SCAN PARTS should still be visible for testing.
9. Quick barcode > ADD TO SCAN regression.
