STOCK SCAN - iPhone PWA Prototype v1.0

WHAT IS INCLUDED
- iPhone-style Home screen
- New Scan sessions
- Rear-camera barcode scanner
- Manual barcode fallback
- Quantity +/-
- Take item photo
- Current Scan
- Remove scanned items
- Save/reopen scans locally
- Part Search placeholder
- PWA manifest + offline app shell

IMPORTANT
Camera access on iPhone requires the app to be served from an HTTPS website (localhost is the development exception). Opening index.html directly from Files will not provide normal camera/PWA behaviour.

SCANNER
The app tries the browser BarcodeDetector API first. If unavailable it loads ZXing from the CDN. Once the next hosting/test step is set up, we can test this on the actual iPhone and then package the barcode library locally if required.

NEXT BUILD
- MechanicDesk parts database import/sync
- Our Data database
- barcode lookup + 13-to-12 digit fallback
- multiple item photos
- export scan data for Excel
- phone scan integration with Supplier Order Generator
- stronger IndexedDB storage + backup/export
