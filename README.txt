STOCK SCAN — v1.62

USERS & PERMISSIONS ORGANISATION + CLEARER HISTORY
- USERS & PERMISSIONS is now a simple menu with CREATE USER and EDIT USERS.
- Existing create-user controls moved to CREATE USER.
- Existing user list moved to EDIT USERS.
- Edit User returns to EDIT USERS.
- USER SETTINGS HISTORY now lists only what changed, e.g. Buy Price: OFF → ON, rather than repeating every field still enabled.
- Restore Previous Settings retained.
- v1.61 Normal User Part Details permission fix retained.

WHAT TO TEST — STOP AT FIRST FAILURE
1. Confirm v1.62 and ✓ Up to date.
2. Admin > USERS & PERMISSIONS. Confirm only CREATE USER and EDIT USERS are shown.
3. Open CREATE USER and confirm the original create-user controls are there.
4. Back > EDIT USERS and confirm existing users are listed.
5. Edit a Normal User > change only Buy Price ON/OFF > SAVE.
6. Re-open that user > USER SETTINGS HISTORY. Confirm it says only Buy Price: ON → OFF (or OFF → ON), not the complete field list.
7. Test RESTORE PREVIOUS SETTINGS.
8. Login as Normal User > FIND A PART > AL400C > confirm details and Buy Price permission still work.
9. Camera barcode search and SCAN PARTS regression.
