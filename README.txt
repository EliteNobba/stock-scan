Stock Scan iPhone PWA v1.7

Built from the confirmed v1.6 scanner baseline.

Changes in v1.7:
- Preserves the working continuous ZXing camera scanner.
- Barcode matching permanently tries the complete scan first, then for an unmatched 13-digit numeric barcode retries the first 12 digits (e.g. 2653547793768 -> 265354779376 / AL400C).
- SCAN SAVED confirmation remains on screen and toast visibility is fixed.
- Saved Scans now have OPEN and DELETE with confirmation.
- Photo thumbnails appear beside items in Current Scan and when a saved scan is opened.
- Part Search now has a tick box for each result to add/remove it from the Stocktake list.
- STOCKTAKE screen stores Minimum and Actual quantities and calculates Order Qty = max(Minimum - Actual, 0).
- CREATE ORDER LIST produces shortages grouped by supplier for the next supplier-order integration step.
- Stocktake selections/minimums/actual counts are stored locally on the device in this version.

Important: private scan/photo data is still local browser/PWA storage in v1.7. It is not uploaded to GitHub. Shared private storage remains the next major integration.
