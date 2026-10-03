STOCK SCAN — v1.18

Foundation build: editable Admin user permissions.

NEW IN v1.18
- Admin can open USERS & PERMISSIONS and tap EDIT USER on an existing account.
- Admin can change Normal/Admin role.
- Admin can enable/disable an account.
- Admin can change section access at any time.
- Admin can change the tick-box list controlling which Find Part fields the user may see.
- Safety check prevents disabling/demoting the last enabled Admin.
- Existing v1.17 device-local users/sections are retained.
- Service worker now correctly caches app.js and uses the v1.18 cache identity.
- Core v1.16 scan/photo workflow is unchanged.

IMPORTANT
Authentication/permissions are still a device-local prototype. Do not use a real work password yet. Production employee security will be enforced by the future private backend.

WHAT TO TEST
1. Confirm STOCK SCAN — v1.18.
2. Login as Admin.
3. SETTINGS > USERS & PERMISSIONS.
4. Tap EDIT USER on a test user.
5. Change section tick boxes and Find Part field tick boxes; SAVE CHANGES.
6. Reopen that user and confirm the choices stayed saved.
7. Disable a test normal account and confirm it cannot log in.
8. Confirm SCAN PARTS > NEW SCAN still reads a barcode and Add to Scan still works.
