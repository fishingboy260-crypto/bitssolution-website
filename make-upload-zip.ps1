# Builds the zip to upload to ServerFreak cPanel (public_html).
# Run:  powershell -ExecutionPolicy Bypass -File "C:\Claude\Website\make-upload-zip.ps1"
# Output: C:\Claude\Website\_publish\bitssolution-upload-YYYY-MM-DD.zip
# Same file list as .github/workflows/upload-package.yml.
Add-Type -AssemblyName System.IO.Compression, System.IO.Compression.FileSystem

$root = $PSScriptRoot
$outDir = Join-Path $root "_publish"
New-Item -ItemType Directory -Force $outDir | Out-Null
$zipPath = Join-Path $outDir ("bitssolution-upload-" + (Get-Date -Format "yyyy-MM-dd") + ".zip")
if (Test-Path $zipPath) { Remove-Item $zipPath -Confirm:$false }

# Never upload: git files, .htaccess (cPanel manages it), preview-only pages, tools.
$skipTop = @('.git', '.github', '.gitignore', '.htaccess', 'concepts', 'README.md', 'css.zip', 'make-upload-zip.ps1', '_publish')

$files = Get-ChildItem $root -Recurse -File | Where-Object {
    $rel = $_.FullName.Substring($root.Length + 1)
    $skipTop -notcontains ($rel -split '\\')[0]
}

# Entry names use "/" so cPanel (Linux) extracts real folders.
$zip = [IO.Compression.ZipFile]::Open($zipPath, 'Create')
try {
    foreach ($f in $files) {
        $entry = $f.FullName.Substring($root.Length + 1).Replace('\', '/')
        [IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $f.FullName, $entry, 'Optimal') | Out-Null
    }
} finally { $zip.Dispose() }

Write-Host ("Made: " + $zipPath) -ForegroundColor Green
Write-Host ("{0} files, {1:N0} KB" -f $files.Count, ((Get-Item $zipPath).Length / 1KB))
