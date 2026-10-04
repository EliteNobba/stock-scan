STOCK SCAN — v1.41
DECISION NOTES
- Optional Decision Note before reversing an already-reviewed decision.
- Note is stored in Review History with Admin and date/time.
- Existing filters, old → new values and scanning retained.
- SCAN PARTS remains visible to Normal Users during testing.
- Final production build: hide/remove SCAN PARTS for Normal Users.

WHAT TO TEST
1. Confirm v1.41 and ✓ Up to date.
2. Admin > REVIEWED PARTS > open Approved record.
3. Enter Decision Note "Incorrect part details".
4. Press REJECT and confirm.
5. Reopen > Review History: note, Admin and date/time should appear.
6. Change back to Approved without a note; it should still work.
7. Test Review History filters.
8. Normal User: SCAN PARTS remains visible.
9. Quick barcode > ADD TO SCAN regression.
