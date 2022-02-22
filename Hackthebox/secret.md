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
