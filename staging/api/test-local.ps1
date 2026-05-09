$B = "http://localhost:3000"; $SID = "test-session-001"; $P = 0; $F = 0
function T($label, $method, $path, $body = $null) {
  try {
    $r = if ($method -eq "GET") {
      Invoke-RestMethod "$B$path" -Method GET -TimeoutSec 5
    } else {
      Invoke-RestMethod "$B$path" -Method POST -ContentType "application/json" -Body ($body | ConvertTo-Json -Compress) -TimeoutSec 10
    }
    Write-Host "  [OK] $label" -ForegroundColor Green; $script:P++; return $r
  } catch {
    Write-Host "  [FAIL] $label — $($_.Exception.Message)" -ForegroundColor Red; $script:F++; return $null
  }
}
Write-Host "`n[SINCLIN] Teste local`n" -ForegroundColor Cyan
$h = T "GET /health" GET "/health"
if ($h) { Write-Host "       engine=$($h.engine) | sioc=$($h.sioc) | session_manager=$($h.session_manager)" }
T "POST /chat (basico)" POST "/chat" @{ raw_text = "ola, estou com dor de cabeca" } | Out-Null
T "POST /chat (com session_id)" POST "/chat" @{ raw_text = "tenho dor abdominal"; session_id = $SID } | Out-Null
$s = T "POST /sioc (start)"       POST "/sioc" @{ session_id = $SID; raw_text = "" };            if ($s) { Write-Host "       -> $($s.next_step)" }
$s = T "POST /sioc (id)"          POST "/sioc" @{ session_id = $SID; raw_text = "12345678900" }; if ($s) { Write-Host "       -> $($s.next_step)" }
$s = T "POST /sioc (nome)"        POST "/sioc" @{ session_id = $SID; raw_text = "Maria Silva" }; if ($s) { Write-Host "       -> $($s.next_step)" }
$s = T "POST /sioc (idade)"       POST "/sioc" @{ session_id = $SID; raw_text = "40" };          if ($s) { Write-Host "       -> $($s.next_step)" }
$s = T "POST /sioc (queixa)"      POST "/sioc" @{ session_id = $SID; raw_text = "dor abdominal" }; if ($s) { Write-Host "       -> $($s.next_step)" }
$s = T "POST /sioc (intensidade)" POST "/sioc" @{ session_id = $SID; raw_text = "8" };           if ($s) { Write-Host "       -> $($s.next_step)" }
$g = T "GET /sioc/:id" GET "/sioc/$SID"
if ($g -and $g.session) { Write-Host "       paciente=$($g.session.paciente.nome) | queixa=$($g.session.anamnese.queixa)" }
try {
  Invoke-RestMethod "$B/sioc/device/camera" -Method POST -ContentType "application/json" -Body "{`"session_id`":`"$SID`",`"data`":{}}" -TimeoutSec 5 | Out-Null
  Write-Host "  [FAIL] device/camera deveria retornar 404" -ForegroundColor Red; $F++
} catch {
  if ($_.Exception.Response.StatusCode -eq 404) {
    Write-Host "  [OK] device/camera = 404 (inativo — comportamento correto)" -ForegroundColor Green; $P++
  } else {
    Write-Host "  [FAIL] device/camera retornou status inesperado" -ForegroundColor Red; $F++
  }
}
Write-Host "`n==============================" -ForegroundColor Cyan
Write-Host "  $P OK  |  $F FALHA" -ForegroundColor $(if ($F -eq 0) { "Green" } else { "Red" })
if ($F -eq 0) { Write-Host "  SEGURO PARA PUSH`n" -ForegroundColor Green }
else          { Write-Host "  NAO FAZER PUSH — corrija antes`n" -ForegroundColor Red }
