STOCK SCAN — v1.52

BARCODE MATCH FIX
- Fixes FIND A PART camera scans returning No match for the known 13-digit / 12-digit barcode issue.
- Exact match first; then 13-digit barcodes are also compared using their first 12 digits.
- Trims whitespace and spreadsheet-style trailing .0.
- Text Part No / Description search and export.xls import remain unchanged.

WHAT TO TEST — STOP AT FIRST FAILURE
1. Confirm v1.52 and ✓ Up to date.
2. Admin > FIND A PART.
3. Scan the same barcode that gave No match in v1.51.
4. Confirm the matching MechanicDesk part appears.
5. Scan a normal exact-match barcode.
6. Search AL400C manually.
7. Quick SCAN PARTS > barcode > ADD TO SCAN regression.
