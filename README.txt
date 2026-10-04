STOCK SCAN — v1.29

NEW: ADD PART -> ADMIN APPROVAL FOUNDATION
- Home now includes ADD A PART.
- New part submission requires Description and Photo.
- Optional Barcode, Suggested Part No, Category and Location.
- Submission records who submitted it, date/time and section automatically.
- Submission goes to a Pending Parts queue; it does NOT directly change live part data.
- Admin Home shows PENDING PARTS and number waiting.
- Admin can review the submitted photo/details, reassign the section, APPROVE or REJECT.
- Approved/rejected prototype history retains submitter and reviewer attribution.
- This approval queue is still device-local prototype storage until the private shared backend is built.
- v1.28 updater and stable barcode/photo scan workflow retained.

WHAT TO TEST
1. Confirm STOCK SCAN — v1.29 and updater says ✓ Up to date.
2. Login Normal User. Press ADD A PART.
3. Try submit without Description/Photo: it must refuse.
4. Add Description + Photo, choose section, optionally add barcode/category/location, SUBMIT FOR REVIEW.
5. Login Admin. Home should show PENDING PARTS with 1 waiting.
6. Open PENDING PARTS > REVIEW. Confirm submitter name, time, section, photo and entered details.
7. Reassign section if desired and APPROVE.
8. Confirm pending count clears.
9. Repeat one submission and test REJECT.
10. Quick barcode > ADD TO SCAN regression.
