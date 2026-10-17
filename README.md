# Bits Solution website

Static site (HTML/CSS/JS). Live on ServerFreak cPanel (`public_html`).

## How changes go live

1. Changes are made on a branch and opened as a pull request.
2. Cloudflare Pages builds a **preview link** for the branch and posts it on the pull request.
3. Check the preview. When happy, **merge the pull request** into `main`.
4. The `Publish to cPanel` GitHub Action uploads the changed files to `public_html`.

Nothing reaches the live site until step 3.

## One-time setup

### 1. FTP account for publishing (cPanel)

cPanel → **FTP Accounts** → create e.g. `deploy@bitssolution.biz`, directory `public_html`, strong password.

### 2. GitHub secrets

GitHub repo → **Settings → Secrets and variables → Actions → New repository secret**:

| Name           | Value                                          |
| -------------- | ---------------------------------------------- |
| `FTP_SERVER`   | `ftp.bitssolution.biz` (or the server name cPanel shows) |
| `FTP_USERNAME` | the full FTP username, e.g. `deploy@bitssolution.biz` |
| `FTP_PASSWORD` | the FTP password                               |

If the first publish fails with a TLS/SSL error, change `protocol: ftps` to `protocol: ftp` in `.github/workflows/deploy-cpanel.yml`.

### 3. Cloudflare Pages (preview links)

dash.cloudflare.com → **Workers & Pages → Create → Pages → Connect to Git** → pick this repo.

- Framework preset: **None**
- Build command: *(leave empty)*
- Build output directory: `/`

Every branch / pull request then gets its own preview URL. The `_headers` file keeps the `*.pages.dev` copies out of search engines.

## Not uploaded to cPanel

`.htaccess` (cPanel manages it), `_headers`, `README.md`, `.github/`.
Files already on the server that aren't in this repo (e.g. `crewdesk-demo/`) are never touched.
