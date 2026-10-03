STOCK SCAN — v1.14

Recovery build focused on the core scan path.

Fixes:
- Repairs the JavaScript syntax error in v1.14 that prevented the Home SCAN PARTS button and other controls from working.
- Preserves the existing scanner implementation.
- Preserves the Add to Scan green confirmation logic.
- Uses a new v1.14 service-worker/cache identity.

TEST FIRST:
1. Confirm STOCK SCAN — v1.14.
2. Tap SCAN PARTS.
3. Tap NEW SCAN.
4. Scan a barcode.
5. Tap ADD TO SCAN and confirm the green ITEM ADDED TO SCAN box appears.


v1.14: Fixed SCAN ANOTHER ITEM being blocked when browser localStorage is over quota. The current scan can continue in memory even if persistence fails. Scanner decoding code unchanged.


v1.17: Fixed full-size photo viewer by adding the missing viewer dialog to index.html and making thumbnails real tappable buttons with direct event handlers. Core scanner and IndexedDB photo storage unchanged.


v1.17: Added device-local prototype Login, Admin Users/Permissions and dynamic Sections. Renamed versioned JavaScript to app.js. Production authentication is not yet backend-secured.
