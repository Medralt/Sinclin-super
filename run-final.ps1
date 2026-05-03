$log = "C:\sinclin\core\data\anamnese\current.log"
$out = "C:\sinclin\core\data\anamnese\final.json"

Write-Output "=== INICIO ==="

if (!(Test-Path $log)) {
    Write-Output "ERRO: LOG NAO EXISTE"
    pause
    exit
}

$data = @{
    nome = ""
    idade = ""
    queixa = ""
    intensidade = ""
}

foreach ($line in Get-Content $log) {

    try {
        $obj = $line | ConvertFrom-Json
    } catch {
        continue
    }

    if ($obj.step -eq "coletar_nome") { $data.nome = $obj.input }
    if ($obj.step -eq "coletar_idade") { $data.idade = $obj.input }
    if ($obj.step -eq "coletar_queixa") { $data.queixa = $obj.input }
    if ($obj.step -eq "coletar_intensidade") { $data.intensidade = $obj.input }
}

$data | ConvertTo-Json -Depth 5 | Set-Content $out

Write-Output "
=== RESULTADO ==="
Get-Content $out

Write-Output "
=== FINAL OK ==="

pause
