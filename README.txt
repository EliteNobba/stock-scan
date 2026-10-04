STOCK SCAN — v1.32

PENDING REVIEW PERMISSION / EDIT FIX
- Normal Users no longer see Reassign Section, APPROVE or REJECT.
- Normal Users can still edit/delete only their own pending submissions.
- Admin can now edit Description, Photo, Barcode, Suggested Part No, Category and Location while reviewing.
- Admin can change Reassign Section.
- Admin SAVE CHANGES saves edits/section, closes the review and returns to Pending Parts.
- SAVE CHANGES does NOT approve the part; it remains pending until Admin explicitly presses APPROVE.
- Admin APPROVE / REJECT remain separate actions.

WHAT TO TEST
1. Confirm STOCK SCAN — v1.32 and ✓ Up to date.
2. Normal User > own Pending Part > VIEW / EDIT.
3. Confirm NO Reassign Section, APPROVE or REJECT controls are visible.
4. Edit a field and SAVE CHANGES; confirm it returns to Pending Parts and stays pending.
5. Admin > same pending part > REVIEW.
6. Confirm Admin can edit fields/photo and sees Reassign Section + APPROVE + REJECT.
7. Change section and another field > SAVE CHANGES.
8. Confirm review closes, item remains Pending, reopen and verify both changes saved.
9. Press APPROVE and confirm it leaves Pending.
10. Quick barcode > ADD TO SCAN regression.
