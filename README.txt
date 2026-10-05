STOCK SCAN — v1.55

FIND A PART BLANK CARD DISPLAY FIX
- Search was finding the two AL400C records correctly.
- The v1.53/v1.54 clickable result cards are BUTTON elements.
- Existing global button styling made their text white while the result card background was also white.
- v1.55 explicitly makes Find a Part result-card text dark on the white card.
- No change to MechanicDesk import/search/barcode matching logic.

WHAT TO TEST — STOP AT FIRST FAILURE
1. Confirm STOCK SCAN — v1.55 and ✓ Up to date.
2. Admin > FIND A PART.
3. If the imported parts status is already present, do NOT re-import yet.
4. Search AL400C.
5. Confirm TWO cards appear AND the text in both cards is visible.
6. Tap first result and confirm PART DETAILS opens with data.
7. Back and open second result.
8. Test camera barcode search.
9. Quick SCAN PARTS > barcode > ADD TO SCAN regression.
