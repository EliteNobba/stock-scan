Stock Scan iPhone PWA v1.5

Changes in v1.5:
- Direct Microsoft OneDrive sign-in from the PWA.
- Uses Microsoft Graph with Files.ReadWrite.AppFolder least-privilege permission.
- Refresh export.xls directly from the Stock Scan OneDrive app folder.
- Manual export.xls and LoMag import retained as fallback.
- Existing v1.4 scanner, photos, scan sessions, save confirmation and part search retained.

One-time Microsoft setup is required:
1. Register Stock Scan as a Single-page application in Microsoft Entra.
2. Add the exact GitHub Pages app URL as a SPA redirect URI.
3. Add delegated Microsoft Graph permission Files.ReadWrite.AppFolder.
4. Copy the Application (client) ID into DATA FILES > OneDrive Direct Connection.
5. Sign in and consent.
6. Place export.xls in the OneDrive app folder created for Stock Scan.

IMPORTANT: GitHub contains app code only. Private inventory files remain in OneDrive/device storage.
