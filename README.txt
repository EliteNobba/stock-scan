Stock Scan iPhone PWA v1.6

Changes from v1.5:
- Clear STOCK SCAN — v1.6 version at top.
- ADD TO SCAN now opens a large ITEM ADDED confirmation panel.
- Confirmation shows item/quantity and whether a photo is attached.
- SAVE SCAN now opens a large SCAN SAVED confirmation panel with name, line count, total quantity and saved time.
- Save refuses an empty scan and gives visible feedback.
- Removed structuredClone dependency from save/open path where practical.
- Cache/service-worker bumped to v1.6 so iPhone is less likely to keep stale v1.5 files.
- Existing working barcode scanner and data-file functionality retained.

Camera permission note:
iOS controls camera permission. A website/PWA cannot silently force camera access to Always Allow.
