STOCK SCAN — v1.36

NEW: CHANGE A REVIEWED DECISION
- Re-review still has SAVE CHANGES for correcting fields/photo/section without changing status.
- If the reviewed part is APPROVED, Admin sees a REJECT button at the bottom.
- If the reviewed part is REJECTED, Admin sees an APPROVE button at the bottom.
- Changing the decision asks for confirmation.
- Decision changes are recorded in reviewHistory with Admin, date/time, previous status and new status.
- Original submitter/submission details remain intact.
- Admin-only Reviewed Parts security retained.

WHAT TO TEST
1. Confirm STOCK SCAN — v1.36 and ✓ Up to date.
2. Admin > REVIEWED PARTS > open an APPROVED part > RE-REVIEW / EDIT.
3. Confirm SAVE CHANGES is still present and a REJECT button appears.
4. Change a field > SAVE CHANGES; confirm status remains APPROVED.
5. Reopen > press REJECT > confirm prompt > confirm item now shows REJECTED.
6. Reopen that same item > confirm button now says APPROVE.
7. Press APPROVE > confirm prompt > confirm item now shows APPROVED.
8. Open an originally REJECTED item and confirm it offers APPROVE.
9. Normal User: confirm REVIEWED PARTS is unavailable.
10. Quick barcode > ADD TO SCAN regression.
