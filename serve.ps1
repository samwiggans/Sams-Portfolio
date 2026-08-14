# Optional local web server for Sam's Top 5s.
# You don't need this to use the site — double-clicking index.html works fine.
# Run it with:  powershell -ExecutionPolicy Bypass -File serve.ps1
# then open http://localhost:8765 . Ctrl+C to stop.

param([string]$Root = $PSScriptRoot, [int]$Port = 8765)

$listener = New-Object System.Net.Sockets.TcpListener([System.Net.IPAddress]::Loopback, $Port)
$listener.Start()
Write-Output "serving $Root on http://localhost:$Port"

$types = @{ ".html"="text/html"; ".css"="text/css"; ".js"="application/javascript";
            ".json"="application/json"; ".png"="image/png"; ".jpg"="image/jpeg";
            ".jpeg"="image/jpeg"; ".gif"="image/gif"; ".svg"="image/svg+xml"; ".txt"="text/plain" }

while ($true) {
  $client = $listener.AcceptTcpClient()
  try {
    $client.ReceiveTimeout = 2000
    $client.SendTimeout    = 5000
    $stream = $client.GetStream()
    # Browsers open speculative sockets and send nothing; a blocking read on one
    # of those would wedge this single-threaded loop, so time the read out.
    $stream.ReadTimeout = 2000
    $reader = New-Object System.IO.StreamReader($stream)
    $requestLine = $null
    try { $requestLine = $reader.ReadLine() } catch { }
    if (-not $requestLine) { continue }
    $path = ($requestLine -split ' ')[1]
    $path = ($path -split '\?')[0]
    if ($path -eq '/') { $path = '/index.html' }
    $decoded = [System.Uri]::UnescapeDataString($path).TrimStart('/') -replace '/', '\'
    $full = Join-Path $Root $decoded

    if (Test-Path -LiteralPath $full -PathType Leaf) {
      $bytes = [System.IO.File]::ReadAllBytes($full)
      $ext = [System.IO.Path]::GetExtension($full).ToLower()
      $ctype = $types[$ext]; if (-not $ctype) { $ctype = 'application/octet-stream' }
      $header = "HTTP/1.1 200 OK`r`nContent-Type: $ctype`r`nContent-Length: $($bytes.Length)`r`nCache-Control: no-store`r`nConnection: close`r`n`r`n"
    } else {
      $bytes = [System.Text.Encoding]::UTF8.GetBytes("404 not found: $decoded")
      $header = "HTTP/1.1 404 Not Found`r`nContent-Type: text/plain`r`nContent-Length: $($bytes.Length)`r`nConnection: close`r`n`r`n"
    }
    $hb = [System.Text.Encoding]::ASCII.GetBytes($header)
    $stream.Write($hb, 0, $hb.Length)
    $stream.Write($bytes, 0, $bytes.Length)
    $stream.Flush()
  } catch { }
  finally { $client.Close() }
}
