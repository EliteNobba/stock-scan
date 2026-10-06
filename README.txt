STOCK SCAN — v1.74

ACCOUNT STARTUP RECOVERY
Built directly from the stable v1.72 baseline.

- Retains the successful v1.72 service-worker/update architecture.
- Does NOT include the v1.73 update-check rewrite.
- Before first-time setup is evaluated, checks for existing users in stockscan_users_v117.
- If existing users are present but stockscan_auth_v117 is missing, restores ONLY the setup/auth marker.
- Does not create, replace, edit or delete any user.
- Does not clear localStorage.
- Does not clear IndexedDB or photos.
- If there really are no existing users, normal FIRST-TIME ADMIN SETUP remains available.

WHAT TO TEST — STOP AT FIRST FAILURE
1. Publish all v1.74 files to GitHub.
2. Do NOT create a new Admin before testing.
3. Open Stock Scan on the PC.
4. If existing users are still stored, FIRST-TIME ADMIN SETUP should disappear and normal Login should return.
5. Confirm your existing Admin/User login works.
6. Repeat on iPhone.
7. Confirm existing users/settings are present.
8. Only after account recovery passes, continue with photo/detail testing.
