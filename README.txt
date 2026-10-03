STOCK SCAN — v1.11

Recovery build focused on the core scan path.

Fixes:
- Repairs the JavaScript syntax error in v1.10 that prevented the Home SCAN PARTS button and other controls from working.
- Preserves the existing scanner implementation.
- Preserves the Add to Scan green confirmation logic.
- Uses a new v1.11 service-worker/cache identity.

TEST FIRST:
1. Confirm STOCK SCAN — v1.11.
2. Tap SCAN PARTS.
3. Tap NEW SCAN.
4. Scan a barcode.
5. Tap ADD TO SCAN and confirm the green ITEM ADDED TO SCAN box appears.
