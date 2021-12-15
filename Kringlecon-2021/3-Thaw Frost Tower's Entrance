# Introduction
This challenge will grant us access to Jacks Frost Tower casino, it's ranked 2/5 christmas trees in difficulty. To gain access to this challenge you will need a wifi-adapter that you recived at the entrance. The description for the  challenge is:
Turn up the heat to defrost the entrance to Frost Tower. Click on the Items tab in your badge to find a link to the Wifi Dongle's CLI interface. Talk to Greasy Gopherguts outside the tower for tips.

To access this challenge you have to go up to the left window of the Frost Tower. This is just in range for your wifi adapter to access the wifi network inside of the building.

# Reconnaissance
Upon opening your wifi adapter you are prompted to use either iwlist or iwconfig. In short terms, iwlist will be used to find the network, while iwconfig will connect us to the network.
```
elf@ba5601fa8f6d:~$ iwlist scanning
wlan0     Scan completed :
          Cell 01 - Address: 02:4A:46:68:69:21
                    Frequency:5.2 GHz (Channel 40)
                    Quality=48/70  Signal level=-62 dBm  
                    Encryption key:off
                    Bit Rates:400 Mb/s
                    ESSID:"FROST-Nidus-Setup"
```
To connect I used this stack exchange link to explain the basics. https://unix.stackexchange.com/questions/92799/connecting-to-wifi-network-through-command-line
In short it is:
```
elf@5814182a0370:~$ iwconfig wlan0 essid FROST-Nidus-Setup key s:off

** New network connection to Nidus Thermostat detected! Visit http://nidus-setup:8080/ to complete setup
(The setup is compatible with the 'curl' utility)
```
Success, we are connected. And immedietly we are prompted with the next step. To enumerate the nidus-setup and find out what we can find.

# Enumeration
Well, the mission is to thaw the entrance so we have to find out whats on that webpage.

```
elf@5814182a0370:~$ curl http://nidus-setup:8080/
◈──────────────────────────────────────────────────────────────────────────────◈

Nidus Thermostat Setup

◈──────────────────────────────────────────────────────────────────────────────◈

WARNING Your Nidus Thermostat is not currently configured! Access to this
device is restricted until you register your thermostat » /register. Once you
have completed registration, the device will be fully activated.

In the meantime, Due to North Pole Health and Safety regulations
42 N.P.H.S 2600(h)(0) - frostbite protection, you may adjust the temperature.

API

The API for your Nidus Thermostat is located at http://nidus-setup:8080/apidoc
```
So it seems like we can either register the product or check out the apidoc. If we check out the register page first, this is what we are prompted with:
```
to the Nidus Thermostat registration! Simply enter your serial number
below to get started. You can find the serial number on the back of your
Nidus Thermostat as shown below:
Serial Number: ______________________


             +------------+
             |   Submit   |
             +------------+
```

So we can try to brute force this, but it's better to enumerate further.

```
elf@5814182a0370:~$ curl http://nidus-setup:8080/apidoc
◈──────────────────────────────────────────────────────────────────────────────◈

Nidus Thermostat API

◈──────────────────────────────────────────────────────────────────────────────◈

The API endpoints are accessed via:

http://nidus-setup:8080/api/<endpoint>

Utilize a GET request to query information; for example, you can check the
temperatures set on your cooler with:

curl -XGET http://nidus-setup:8080/api/cooler

Utilize a POST request with a JSON payload to configuration information; for
example, you can change the temperature on your cooler using:

curl -XPOST -H 'Content-Type: application/json' \
  --data-binary '{"temperature": -40}' \
  http://nidus-setup:8080/api/cooler


● WARNING: DO NOT SET THE TEMPERATURE ABOVE 0! That might melt important furniture

Available endpoints

┌─────────────────────────────┬────────────────────────────────┐
│ Path                        │ Available without registering? │ 
├─────────────────────────────┼────────────────────────────────┤
│ /api/cooler                 │ Yes                            │ 
├─────────────────────────────┼────────────────────────────────┤
│ /api/hot-ice-tank           │ No                             │ 
├─────────────────────────────┼────────────────────────────────┤
│ /api/snow-shower            │ No                             │ 
├─────────────────────────────┼────────────────────────────────┤
│ /api/melted-ice-maker       │ No                             │ 
├─────────────────────────────┼────────────────────────────────┤
│ /api/frozen-cocoa-dispenser │ No                             │ 
├─────────────────────────────┼────────────────────────────────┤
│ /api/toilet-seat-cooler     │ No                             │ 
├─────────────────────────────┼────────────────────────────────┤
│ /api/server-room-warmer     │ No                             │ 
└─────────────────────────────┴────────────────────────────────┘
```
Perfect, we can change the cooler temperature without registering the product! So by simply adjusting the temperature there we are able to melt the entrance.
The output also provides us with the commands nessecary.
If you're careless you can easily melt everything by just increasing the temperature an insane amount. If you want to be careful you can increase the temperature slowly. The outcome is the same anyway.

```
elf@5814182a0370:~$ curl -XPOST -H 'Content-Type: application/json'  --data-binary '{"temperature": 1000}'  http://nidus-setup:8080/api/cooler
{
  "temperature": 1000.05,
  "humidity": 67.94,
  "wind": 15.76,
  "windchill": 1233.38,
  "WARNING": "ICE MELT DETECTED!"
}
```

Success, the entrance is thawed and you can enter!
