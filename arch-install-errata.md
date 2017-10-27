# During setup

### If using syslinux for the bootloader
syslinux can't use ext4 with the 64bit feature, which is now the default in mkfs.ext4.
Instead, create without the 64bit feature:

~~~
$ mkfs.ext4 -O \^64bit /dev/sda1
~~~

### Use fs labels instead of uuids

~~~
$ e2label /dev/sda1 foo
$ genfstab -L /mnt > /mnt/etc/fstab
~~~

## Bootloader: syslinux

~~~
$ pacman -S syslinux
$ cp /usr/lib/syslinux/bios/*.c32 /boot/syslinux/
$ extlinux --install /boot/syslinux/
~~~

### Edit /boot/syslinux/syslinux.cfg
Use: `APPEND root=LABEL=foo rw`

For non-stop boots, comment out all `UI` entries and use `PROMPT 0`.

### altmbr
An alternative MBR which Syslinux provides is: altmbr.bin.
This MBR does not scan for bootable partitions; instead, the last byte of the MBR is set to a value indicating which partition to boot from.
Here is an example of how altmbr.bin can be copied into position:

~~~
$ printf '\x5' | cat /usr/lib/syslinux/bios/altmbr.bin - | dd bs=440 count=1 iflag=fullblock of=/dev/sda
~~~

In this case, a single byte of value 5 (hexadecimal) is appended to the contents of altmbr.bin and the resulting 440 bytes are written to the MBR on device sda.
Syslinux was installed on the first logical partition (/dev/sda5) of the disk.

# After first boot

## No ethernet on first start, so setup netctl

~~~
$ cd /etc/netctl
$ cp examples/ethernet-dhcp .
~~~

In `ethernet-dhcp`, update 'Interface' (from `ip link`) and uncomment `IP6=stateless`.

~~~
$ netctl enable ethernet-dhcp
$ netctl start ethernet-dhcp
~~~

## Create a user

~~~
useradd -m -G wheel <username> ((-m creates ~))
~~~


## sudo
Install, and in `/etc/sudoers`, uncomment `%wheel` entry.

## GUI

~~~
$ pacman -S xfce4
$ pacman -S xterm ((not installed by default!))
$ echo 'exec startxfce4' > ~/.xinitrc
$ startx ((when desired))
~~~

## Lockscreen

~~~
$ pacman -S slock
~~~

## Disable terminal beep

~~~
$ echo 'set bell-style none' > ~/.inputrc
$ bash ((to refresh))
~~~
