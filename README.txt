STOCK SCAN — v1.28

UPDATE BUTTON BEHAVIOUR
- If the running app is current, the top button reads CHECK UPDATE and status reads ✓ Up to date.
- If a newer published version is detected automatically, the top button changes to UPDATE.
- The status beside it shows Update available — vX.
- Pressing UPDATE now performs the update directly; there is no need to press CHECK UPDATE first.
- After reload, when running and published versions match, the button returns to CHECK UPDATE and status becomes ✓ Up to date.
- No automatic popup interrupts the user.

IMPORTANT DEPLOYMENT
Upload/replace ALL files from the v1.28 package, not only version.json. In particular replace index.html, app.js, sw.js and version.json.

WHAT TO TEST
1. Upload ALL v1.28 files.
2. Confirm heading says STOCK SCAN — v1.28.
3. It should settle on CHECK UPDATE + ✓ Up to date.
4. Press CHECK UPDATE: Checking… then ✓ Up to date.
5. Screen off/on: still no popup.
6. Quick barcode > ADD TO SCAN.
