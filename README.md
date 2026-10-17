# Bits Solution website

Static site (HTML/CSS/JS). Live on ServerFreak cPanel (`public_html`).

## How changes go live

1. Changes are committed to `main`.
2. **Preview:** GitHub Pages rebuilds the sample view automatically (repo → **Settings → Pages** shows the link).
   Preview pages are marked `noindex`, so Google won't list them.
3. **Publish:** when the preview looks right, repo → **Actions → Publish to cPanel → Run workflow**.
   This uploads the changed files to `public_html`.

Nothing reaches the live site until step 3 is run by hand.

## One-time setup for publishing

### 1. FTP account (cPanel)

cPanel → **FTP Accounts** → create e.g. `deploy@bitssolution.biz`, directory `public_html`, strong password.

### 2. GitHub secrets

Repo → **Settings → Secrets and variables → Actions → New repository secret**:

| Name           | Value                                                     |
| -------------- | --------------------------------------------------------- |
| `FTP_SERVER`   | `ftp.bitssolution.biz` (or the server name cPanel shows)  |
| `FTP_USERNAME` | the full FTP username, e.g. `deploy@bitssolution.biz`     |
| `FTP_PASSWORD` | the FTP password                                          |

If publishing fails with a TLS/SSL error, change `protocol: ftps` to `protocol: ftp` in `.github/workflows/deploy-cpanel.yml`.

## Not uploaded to cPanel

`.htaccess` (cPanel manages it), `README.md`, `.github/`.
Files already on the server that aren't in this repo (e.g. `crewdesk-demo/`) are never touched.

## Known preview-only quirk

The preview lives under `/bitssolution-website/`, so links that start with `/` (like "Back to main site" in
`try-crewdesk.html`) and absolute `https://bitssolution.biz/...` links jump out of the preview. They work normally on the live site.
