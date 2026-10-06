STOCK SCAN — v2.01 LIVE LOGIN DIAGNOSTIC FIX

- Built from v2.0.
- Keeps the PocketBase backend unchanged.
- Makes LIVE LOGIN independent of the legacy prototype startup code.
- The login button must now always display a result:
  Connecting to PocketBase…
  Connected ✓ ...
  or Login failed — ...
- Does not create/change/delete PocketBase users.
- Does not clear local data.

WHAT TO TEST — STOP AT FIRST FAILURE
1. Publish all v2.01 files to GitHub.
2. Open on Windows and confirm STOCK SCAN — v2.01.
3. Enter the PocketBase user email/password.
4. Press LOGIN TO LIVE STOCK SCAN.
5. It MUST immediately say Connecting to PocketBase…
6. Then it must show either Connected ✓ ... or Login failed — <reason>.
7. Stop and report the exact message. Do not test iPhone until Windows passes.
