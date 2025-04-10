$procs = Get-Process dwm
$procs = $($procs; Get-Process firefox)
Write-Output $procs
pause
foreach ($p in $procs) {
   Write-Output "$($p.name)@$($p.id):"
   pause
   $stats = Get-Counter "\GPU Process Memory(pid_$($p.id)*)\*"
   foreach ($s in $stats) {
      ($s.CounterSamples | where CookedValue) | Get-Member | Write-Output
      #Write-Output "Process $($p.Name) GPU Engine Usage $([math]::Round($cooked,2))%"
      Write-Output $s
      #echo $stats
   }
}
