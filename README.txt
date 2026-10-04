STOCK SCAN — v1.33

NORMAL USER REVIEW CONTROL FIX
- Fixed APPROVE and REJECT still being visible to Normal Users.
- Root cause: existing button CSS could override the HTML hidden attribute.
- Role-specific controls now use both role logic and explicit display:none.
- Added global [hidden] protection so hidden controls cannot be made visible by normal button styling.
- Admin still sees APPROVE and REJECT.
- Normal User still sees SAVE CHANGES and DELETE PENDING PART for their own submission.
- Reassign Section remains Admin-only.

WHAT TO TEST
1. Confirm STOCK SCAN — v1.33 and ✓ Up to date.
2. Login Normal User > PENDING PARTS > VIEW / EDIT.
3. Confirm NO Reassign Section, APPROVE or REJECT controls are visible. Stop if any are visible.
4. Confirm SAVE CHANGES and DELETE PENDING PART are still visible.
5. Login Admin > open same pending part.
6. Confirm Reassign Section, SAVE CHANGES, APPROVE and REJECT are visible.
7. Quick barcode > ADD TO SCAN regression.
