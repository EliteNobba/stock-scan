STOCK SCAN — v1.20

NEW IN v1.20
- Admin enters a temporary password when creating a user.
- New users must change that temporary password on first successful login before entering the app.
- Current Scan items now have EDIT and REMOVE.
- EDIT allows quantity changes and adding/replacing the item photo.
- Existing user editing/deletion safeguards remain.
- Core barcode scanner and IndexedDB photo storage remain unchanged.

IMPORTANT
Authentication is still a device-local prototype. Do not use a real work password yet. Production accounts and permissions will be enforced by the future private backend.

WHAT TO TEST
1. Confirm STOCK SCAN — v1.20.
2. Login as Admin and create a Normal User with a temporary password.
3. Log out and login as that Normal User using the temporary password.
4. Confirm the app forces CHANGE PASSWORD before Home can be used.
5. Enter and confirm a new password; confirm Home opens.
6. Log out and confirm the old temporary password no longer works.
7. Confirm the new password does work.
8. As Admin, scan/add an item, open CURRENT SCAN, tap EDIT.
9. Change quantity and add/change photo, then SAVE CHANGES.
10. Confirm Current Scan shows the updated quantity/photo and the photo opens large.
11. Quick regression: scan another barcode and ADD TO SCAN.
