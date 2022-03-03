---
tags:
  - post
  - kringlecon2021Post
title: Kringlecon 2021 - Customer Complaint Analysis
---

# Introduction
It truely isn't christmas without wireshark. This challenge wants us to find three trolls in a packet dump of a customer complaint system.
The description we are given is as follows: A human has accessed the Jack Frost Tower network with a non-compliant host. Which three trolls complained about the human? Enter the troll names in alphabetical order separated by spaces. Talk to Tinsel Upatree in the kitchen for hints.

We are provided with a pcap file jackfrosttower-network.pcap

# The contents
The contents of the pcap is as promised, a bunch of HTTP Post to the complaint form. We will be focusing only on this.
By following the tpc stream you can see what each post is, there are too many to bother bruteforce it. 
Therefore we will be looking for anomalies.
Thi biggest anomali is a complaint sent by Muffy VonDuchess Sebastian. Her name is unique, and the contents have a compleatly different style of writing. In addition, a techinical difference is that her packet doesn not have the reserved bit set (referred to as the bad bit). 
So, what is she saying:
```
name= Muffy VonDuchess Sebastian
troll_id=I don't know. There were several of them.
guest_info=Room 1024
description=I have never in my life been in a facility with such a horrible staff. They are rude and insulting. What kind of place is this! You can be sure that I or my lawyer will be speaking directly with Mr.Frost
```
So she is held in rom 1024, and seems human. Lets see what that can give us.
Further investigation leads us to three intresting packets. They have the following text.

```
name=Hagg
troll_id=2013
guest_info=Incredibly angry lady in room 1024
description=Lady+call+front+desk.+I+am+walk+by+so+I+pick+up+phone.+She+is+ANGRY+and+shout+at+me.+Say+she+has+never+been+so+insult.+I+say+she+probably+has+but+just+didn%27t+hear+it.&submit=Submit

name=Flud
troll_id=2083
guest_info=Very cranky+lady in room 1024
description=Lady+call+front+desk.+Complain+%22employee%22+is+rude.+Say+she+is+insult+and+want+to+speak+to+manager.+Send+Flud+to+room.+Lady+say+troll+call+her+towels+thief.+I+say+stop+steal+towels+if+is+bother+her.&submit=Submit

name=Yaqh
troll_id=2796
guest_info=Snooty lady in room 1024
description=Lady+call+desk+and+ask+for+more+towel.+Yaqh+take+to+room.+Yaqh+ask+if+she+want+more+towel+because+she+is+like+to+steal.+She+say+Yaqh+is+insult.+Yaqh+is+not+insult.+Yaqh+is+Yaqh.&submit=Submit
```

I think we found our three trolls. They all complained about the same room and references this old snooty lady. Well, just arrange the names in alphabetical order and we have our flag!
