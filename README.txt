STOCK SCAN — v1.48

FIND A PART — INVENTORY FOUNDATION
- Existing FIND A PART now searches TWO local sources together:
  1. the loaded MechanicDesk/parts file
  2. approved Add Part records
- Search works by Part No, Description or Barcode.
- Approved Add Part results respect the Normal User's allocated sections.
- Admin can see approved Add Part records from all sections.
- Results identify whether they came from the Parts File or an approved section.
- Pressing Enter in the search box also searches.
- This starts joining official master data and our persistent custom data without changing the master export.
- Existing scanner, Add Part approval and audit systems remain unchanged.
- SCAN PARTS remains visible to Normal Users during development/testing.

WHAT TO TEST
1. Confirm STOCK SCAN — v1.48 and ✓ Up to date.
2. Admin > FIND A PART.
3. Search a known item from your loaded parts/export file by Part No.
4. Search it by Description or Barcode.
5. Search a part that was created through ADD A PART and approved.
6. Confirm both types can appear in FIND A PART.
7. Confirm the result identifies Parts File or the approved section.
8. Normal User: search an approved part in an allocated section — it should appear.
9. Normal User: search an approved part in a section not allocated — it should not appear.
10. Press Enter instead of SEARCH and confirm it searches.
11. Confirm ADD A PART / Pending / Reviewed Parts still work.
12. Quick barcode > ADD TO SCAN regression.
