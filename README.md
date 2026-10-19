# Bits Solution website

Static site (HTML/CSS/JS). Live on ServerFreak cPanel (`public_html`).

## How changes go live

1. Changes are committed and pushed to `main`.
2. **Preview:** GitHub Pages rebuilds the sample view about a minute later:
   https://fishingboy260-crypto.github.io/bitssolution-website/
   Preview pages are marked `noindex`, so Google won't list them.
3. **Get the upload file**, either:
   - **On this PC:** run
     `powershell -ExecutionPolicy Bypass -File "C:\Claude\Website\make-upload-zip.ps1"`
     → `C:\Claude\Website\_publish\bitssolution-upload-YYYY-MM-DD.zip`
   - **From GitHub:** repo → **Actions** → latest **Upload package** run → **Artifacts** → `upload-to-cpanel` (kept 30 days).
4. **Publish by hand in cPanel** (only when the preview looks right):
   1. *(Recommended)* File Manager → `public_html` → select all → **Compress** → download, as a backup.
   2. File Manager → `public_html` → **Upload** the zip.
   3. Right-click the zip → **Extract** to `/public_html`, allow overwrite.
   4. Delete the uploaded zip from `public_html`.
   5. Open https://bitssolution.biz and press Ctrl+F5.

Nothing reaches the live site until step 4.

## What the upload zip contains

Everything except: `.htaccess` (cPanel manages it), `concepts/` (preview-only design ideas), `README.md`, `.github/`, `css.zip`, `make-upload-zip.ps1`.
Extracting only adds or overwrites files. Files already on the server that aren't in the zip (e.g. `crewdesk-demo/`) are left alone,
and files deleted here are **not** deleted on the server; remove those in File Manager.

## Known preview-only quirk

The preview lives under `/bitssolution-website/`, so links that start with `/` (like "Back to main site" in
`try-crewdesk.html`) and absolute `https://bitssolution.biz/...` links jump out of the preview. They work normally on the live site.
