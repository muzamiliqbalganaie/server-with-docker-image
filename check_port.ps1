param(
  [int]$Port = 9527
)

Write-Host "Checking TCP connectivity to localhost:$Port ..."
Test-NetConnection -ComputerName localhost -Port $Port
