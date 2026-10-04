STOCK SCAN — v1.19

Foundation build: Admin Delete User.

NEW IN v1.19
- Admin can delete an existing user from EDIT USER.
- DELETE USER requires confirmation.
- The currently logged-in account cannot delete itself.
- The last enabled Admin is protected from deletion.
- Existing editable roles, section access and Find Part field permissions remain.
- Core v1.16 scan/photo workflow remains unchanged.
- Permanent app.js naming continues.

IMPORTANT
Authentication/permissions are still a device-local prototype. Do not use a real work password yet.
Production employee security, shared accounts, invitations and audit history will be enforced by the future private backend.

WHAT TO TEST
1. Confirm STOCK SCAN — v1.19.
2. Login as Admin.
3. SETTINGS > USERS & PERMISSIONS.
4. Create a disposable Normal User if needed.
5. EDIT USER > DELETE USER.
6. Choose Cancel first and confirm the user remains.
7. Delete again and confirm deletion; user should disappear from the list.
8. Confirm the deleted username can no longer log in.
9. Confirm you cannot delete the account currently logged in.
10. Quick regression: SCAN PARTS > NEW SCAN > barcode > ADD TO SCAN.
