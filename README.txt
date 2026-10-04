STOCK SCAN — v1.49

REAL MECHANICDESK EXPORT IMPORT
- FIND A PART can import the real export.xls/export.xlsx.
- Reads Stocks (or first sheet): B Part No, C Supplier, E Barcode, G Description, K Buy Price.
- Stores imported parts locally so they remain after reopening.
- Searches MechanicDesk data plus approved Add Part records.
- Does not modify export.xls.
- Uses SheetJS over HTTPS to parse legacy .xls.
- Direct OneDrive automatic sync remains a later step.
- SCAN PARTS remains visible to Normal Users during development/testing.

WHAT TO TEST — STOP AT FIRST FAILURE
1. Confirm v1.49 and ✓ Up to date.
2. Admin > FIND A PART.
3. Choose your real export.xls.
4. Tap IMPORT PARTS FILE.
5. Confirm ✓ and imported part count.
6. Search AL400C.
7. Confirm real Description / Barcode / Supplier.
8. Search a known barcode and confirm the item.
9. Close/reopen and search AL400C without re-importing.
10. Search an approved ADD A PART item.
11. Quick barcode > ADD TO SCAN regression.
