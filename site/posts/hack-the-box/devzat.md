---
tags:
  - post
  - hackTheBoxPost
title: devzat
layout: post.njk
---

# Notes

Nmap shows 

```
──(kali㉿kali)-[~/Documents/HTB/Devzat]                                                                                                                                                                                              [5/6]
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
Connecting to port 8000 ssh
```
──(kali㉿kali)-[~/Documents/HTB/Devzat]                                                                                                                                                                                                   
└─$ ssh 10.10.11.118 -p 8000                                                                                   255 ⨯                                                                                                                       
Unable to negotiate with 10.10.11.118 port 8000: no matching host key type found. Their offer: ssh-rsa               
                                                                                                                     
┌──(kali㉿kali)-[~/Documents/HTB/Devzat]                                                                             
└─$ ssh -oHostKeyAlgorithms=+ssh-rsa 10.10.11.118 -p 8000                                                      255 ⨯ 
The authenticity of host '[10.10.11.118]:8000 ([10.10.11.118]:8000)' can't be established.                           
RSA key fingerprint is SHA256:f8dMo2xczXRRA43d9weJ7ReJdZqiCxw5vP7XqBaZutI.                                           
This key is not known by any other names                                                                             
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes                                             
Warning: Permanently added '[10.10.11.118]:8000' (RSA) to the list of known hosts.                                   
                                                                                          17 hours 12 minutes earlier
devbot: test has left the chat                                                                                       
devbot: test stayed on for 31 minutes                                                                                
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

```
