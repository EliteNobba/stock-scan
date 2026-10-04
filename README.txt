STOCK SCAN — v1.45

ORIGINAL SUBMISSION SNAPSHOT
- New approvals/rejections now preserve an immutable snapshot of the submitted part details.
- Original Submission can show original Description, Barcode, Suggested Part No, Category, Location and Section.
- Later Admin corrections do not overwrite this original snapshot.
- Older records created before v1.45 still show the original submitter/date and whatever original data is available.
- Existing Review History, notes, filters/order and exact old → new changes remain.
- SCAN PARTS remains visible to Normal Users during development/testing.
- Final production build: hide/remove SCAN PARTS for Normal Users.

WHAT TO TEST
1. Confirm STOCK SCAN — v1.45 and ✓ Up to date.
2. As Normal User submit a NEW pending part with Description, Barcode, Part No, Category and Location.
3. Admin approve it.
4. Admin > REVIEWED PARTS > open it.
5. Confirm Original Submission shows the values entered by the Normal User.
6. Change Description/Location and SAVE CHANGES.
7. Reopen: current fields should show new values, Original Submission should still show the old original values.
8. Confirm Review History shows the correction.
9. Normal User: SCAN PARTS remains visible for testing.
10. Quick barcode > ADD TO SCAN regression.
