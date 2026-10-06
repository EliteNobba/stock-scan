STOCK SCAN — v1.70
Fixes approved Add Part photos in FIND A PART > PART DETAILS. getPhoto() stores/returns Data URL strings, so PART DETAILS now uses that string directly rather than incorrectly passing it to URL.createObjectURL(). v1.69 photoId mapping and alternating result shading are retained.

WHAT TO TEST — STOP AT FIRST FAILURE
1. Publish v1.70 with v1.69 open; confirm automatic UPDATE detection.
2. Update; confirm STOCK SCAN — v1.70 and Up to date.
3. Admin > FIND A PART > find an approved Add Part with a photo.
4. Open PART DETAILS; photo must appear.
5. Confirm multiple search results alternate shaded / white.
6. Normal User with Photo ON: same part photo appears.
7. Photo OFF: same part photo does not appear.
8. Quick AL400C, camera barcode, and SCAN PARTS regression.
