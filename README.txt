STOCK SCAN — v1.21

FIXED / ADDED IN v1.21
- Fixed first-login temporary-password flow and blocked bypassing it.
- Admin can RESET PASSWORD with a new temporary password; it must be changed at next login.
- Edit heading now shows EDIT USER - Username.
- Added CHECK FOR UPDATE in the header and Settings, plus an automatic check when the app becomes active.
- Fixed stale cache/script version references that could keep older JavaScript loaded.
- Current Scan EDIT / add-change photo from v1.20 remains.
- Core scanner/photo/save workflow remains unchanged.

IMPORTANT
Authentication is still a device-local prototype. Do not use a real work password yet.

WHAT TO TEST
1. Confirm STOCK SCAN — v1.21.
2. Create a Normal User with a temporary password.
3. Log out and log in with that temporary password.
4. Confirm CHANGE PASSWORD opens immediately.
5. Save a new password; then verify old password fails and new password works.
6. Admin > EDIT USER - Username > RESET PASSWORD.
7. Log in with reset temporary password and confirm CHANGE PASSWORD is forced again.
8. CHECK UPDATE should report v1.21 is up to date.
9. Current Scan > EDIT > add/change photo > SAVE CHANGES.
10. Quick regression: scan barcode > ADD TO SCAN.
