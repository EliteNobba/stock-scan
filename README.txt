Stock Scan iPhone PWA v1.1

Scanner fix release.
- Uses ZXing BrowserMultiFormatReader.decodeFromVideoDevice for continuous camera decoding.
- Forces ZXing path instead of relying on BarcodeDetector.
- Shows decoder/camera diagnostics below preview.
- Rear camera preference is handled by ZXing when device id is omitted.
- Cache version bumped to stock-scan-v1.1 and app JS renamed so iPhone does not reuse v1 scanner code.

Upload all files in this folder to the ROOT of the GitHub Pages stock-scan repository, replacing existing index.html/styles.css/manifest.webmanifest/sw.js where prompted and adding app-v1.1.js.
