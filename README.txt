STOCK SCAN — v1.69

FIX
- Approved Add Part photos now use the actual stored photoId when FIND A PART builds its result record.
- PART DETAILS can therefore retrieve the approved part photo from IndexedDB.
- Existing Photo permission still controls whether the photo is shown.
- Alternating Find a Part shading retained and strengthened.

WHAT TO TEST — STOP AT FIRST FAILURE
1. Publish v1.69 while v1.68 is open; confirm automatic UPDATE detection.
2. Update and confirm v1.69 and Up to date.
3. Admin > FIND A PART > find an APPROVED Add Part that has a photo.
4. Open PART DETAILS. Confirm the photo appears.
5. Search for multiple results and confirm visible shaded / white alternating boxes.
6. Normal User with Photo permission ON > same approved part > photo appears.
7. Photo permission OFF > same part > photo does not appear.
8. Quick MechanicDesk AL400C, camera barcode and SCAN PARTS regression tests.
