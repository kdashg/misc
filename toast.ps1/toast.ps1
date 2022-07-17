# E.g. powershell -file toast.ps1 "A Toast" "...to toast!" > /dev/null
# (If you don't use -file, you might not be able to quote strings with spaces)
[reflection.assembly]::loadwithpartialname("System.Windows.Forms")
[reflection.assembly]::loadwithpartialname("System.Drawing")
$notify = new-object system.windows.forms.notifyicon
$notify.icon = [System.Drawing.SystemIcons]::Information
$notify.visible = $true
$title = "Toast!"
$text = "[toast.ps1 by kdashg]"
if ( $args.count -ge 1 ) {
   $title = $args[0]
}
if ( $args.count -ge 2 ) {
   $text = $args[1]
}
$notify.showballoontip(10,$title,$text,[system.windows.forms.tooltipicon]::None)
