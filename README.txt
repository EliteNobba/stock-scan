STOCK SCAN — v1.22

FIXED / ADDED IN v1.22
- Normal User SETTINGS now opens a restricted User Settings screen instead of doing nothing.
- Normal User Settings includes Change Password and Check for Update only.
- Admin Settings remain restricted to Admin users.
- CHECK FOR UPDATE now always shows visible status: checking, up to date, new version, or failed.
- Update check has a timeout instead of silently appearing to do nothing.
- Header CHECK UPDATE button has more spacing from the version text.
- Automatic update check when returning to the app remains.
- v1.21 temporary-password, reset-password and Current Scan Edit/Photo features remain unchanged.

WHAT TO TEST
1. Confirm STOCK SCAN — v1.22.
2. Login as a Normal User.
3. Press SETTINGS — User Settings must open.
4. Confirm no Users/Permissions, Sections or Admin Data controls are visible.
5. Press CHECK FOR UPDATE — visible text must change to Checking, then ✓ v1.22 IS UP TO DATE (or a clear failure message).
6. Check the extra space between the version text and CHECK UPDATE at the top.
7. Login as Admin and confirm SETTINGS still opens Admin Settings.
8. Quick regression: barcode > ADD TO SCAN.
