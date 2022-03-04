---
tags:
  - post
  - kringlecon2021Post
title: Shellcode Primer
layout: post.njk
---
# Introduction
This is Jacks shellcode school, it is a great challenge to brush up on your assembly skills. The challenge takes you upon a set of ways to read, write and manipulate the stack. There are 10 steps to theis challenge, but we will only be focusing at the last step as it is a collection of the previous ones.
Complete the Shellcode Primer in Jack's office. According to the last challenge, what is the secret to KringleCon success? "All of our speakers and organizers, providing the gift of ____, free to the community." Talk to Chimney Scissorsticks in the NetWars area for hints

# The challenge
The final challenge is reading a file northpolesecrets.txt and getting the first part of the string above.
Here is the syscall table that will be crucial to solving the challenge. https://blog.rchapman.org/posts/Linux_System_Call_Table_for_x86_64/

We are provided with the following code:
```
; TODO: Get a reference to this
db '/var/northpolesecrets.txt',0

; TODO: Call sys_open

; TODO: Call sys_read on the file handle and read it into rsp

; TODO: Call sys_write to write the contents from rsp to stdout (1)

; TODO: Call sys_exit

```

So we have to open the file, read the file out to a place we can safekeep it, the write the contents to stdout and finally exit gracefully.

## Reference the file
To get a hold of the filename, we need to call a function directly under the address. The following code adds the address on top of the stack, there we can easily retrive it.
```
; TODO: Get a reference to this
call getWord
db '/var/northpolesecrets.txt',0
getWord:
```

## Open the file
To open it we have to check the linux system call table. there you see that the sys_open needs **2 in rax**, the **filename in rdi**, the **int flags in rsi** and finally **intmode in rdx**. We can safely set 0 n rsi and rdx, this will not cause any harm. So all we need to do is get the file name in rdi, the filename is stored in the stack, so we can easily just pop it out.

```
; TODO: Call sys_open
mov rax, 2 ; syscall (sys_open)
pop rdi ; filename
mov rsi, 0
mov rdx, 0
syscall
```

## Read the file
So the file is open, now to read it, we can just check the linux system call table again. What we need to start reading the file is **0 in rax**, the **unsigned int fd in rdi**, the **char *buf in rsi** and finally **size_t count in rdx**. A great hint in how to achive this is that the file descriptor is returned by the sys_open. The value returned is set in rax, so we can just move that over. Also the the buffer is a place in the memory we can write to, the stack is perfect for that as that is what it should be used for. Lastly, the buffersize that we are going to use is an int we dont know, but better to be safe than sorry. (I cheated here and set the exact value).

```
; TODO: Call sys_read on the file handle and read it into rsp
mov rdi, rax ; the file descriptor returned from sys_open
mov rax, 0 ; syscall (sys_read)
mov rsi, rsp ; buffer
mov rdx, 138 ; length
syscall
```

## Write the contents to stdout
So the file is read and now it needs to be written out to someplace to recive our secrets. This is what we need **1 in rax**, the **unsigned int fd in rdi**, the **const char *buf in rsi** and finally **size_t count in rdx**. Hints we recived here is that the filedescriptor for stdout is always 1, and the best value for count is the return value from sys_read.
```
; TODO: Call sys_write to write the contents from rsp to stdout (1)
mov rdx, rax ; length
mov rax, 1 ; syscall (sys_read)
mov rdi, 1 ; handle (stdout)
mov rsi, rsp ; buffer
syscall
```

## Return 0
Well, all that is left to do is to return 0 and exit gracefully. Here you can just check the linux system calls, and you have your answer.
```
; TODO: Call sys_exit
mov rax, 60
mov rdi, 0
syscall
```

The total code is collection of the above. But more importantly, what's in the file!?
**Secret to KringleCon success: all of our speakers and organizers, providing the gift of cyber security knowledge, free to the community.**

# Wrapping up
Hope you learned something, but most importantly, you can cheat at this challenge. Upon compleating it, we are informed that by setting ?cheat after the URL (before the #) to unlock the solutions.
