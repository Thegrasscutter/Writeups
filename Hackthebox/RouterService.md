Dirb and nikto are useless, it always directs to the "suspicious activity screen"
```
+ http://10.129.167.150/_vti_cnf (CODE:200|SIZE:71)                                                                                                                                                                                       
+ http://10.129.167.150/_vti_inf (CODE:200|SIZE:77)                                                                                                                                                                                       
+ http://10.129.167.150/_vti_log (CODE:200|SIZE:69)                                                                                                                                                                                       
+ http://10.129.167.150/_vti_map (CODE:200|SIZE:71)                                                                                                                                                                                       
+ http://10.129.167.150/_vti_rpc (CODE:200|SIZE:70)                                                                                                                                                                                       
+ http://10.129.167.150/_vti_script (CODE:200|SIZE:75)                                                                                                                                                                                    
+ http://10.129.167.150/_vti_txt (CODE:200|SIZE:71)                                                                                                                                                                                       
+ http://10.129.167.150/_www (CODE:200|SIZE:80)                                                                                                                                                                                           
+ http://10.129.167.150/~adm (CODE:200|SIZE:73)                                                                                                                                                                                           
+ http://10.129.167.150/~admin (CODE:200|SIZE:71)                                                                                                                                                                                         
+ http://10.129.167.150/~administrator (CODE:200|SIZE:73)                                                                                                                                                                                 
(!) WARNING: Too many responses for this directory seem to be FOUND.                                                                                                                                                                      
    (Something is going wrong - Try Other Scan Mode)
    (Use mode '-w' if you want to scan it anyway)
                                                                               
-----------------
END_TIME: Sat Feb 26 14:43:58 2022
DOWNLOADED: 107 - FOUND: 101
                                           
```

Used Wfuzz to filter out the output
```
┌──(kali㉿kali)-[~/Documents/HTB/RouterSpace]
└─$ wfuzz -c -w /usr/share/wordlists/seclist/Discovery/Web-Content/directory-list-lowercase-2.3-big.txt --hs "Suspicious activity*" http://10.129.167.150/FUZZ                                                                   130 ⨯ 1 ⚙
 /usr/lib/python3/dist-packages/wfuzz/__init__.py:34: UserWarning:Pycurl is not compiled against Openssl. Wfuzz might not work correctly when fuzzing SSL sites. Check Wfuzz's documentation for more information.
********************************************************
* Wfuzz 3.1.0 - The Web Fuzzer                         *
********************************************************

Target: http://10.129.167.150/FUZZ
Total requests: 1185254

=====================================================================
ID           Response   Lines    Word       Chars       Payload                                                                                                                                                                   
=====================================================================

000000001:   200        536 L    1382 W     25900 Ch    "# directory-list-lowercase-2.3-big.txt"                                                                                                                                  
000000003:   200        536 L    1382 W     25900 Ch    "# Copyright 2007 James Fisher"                                                                                                                                           
000000007:   200        536 L    1382 W     25900 Ch    "# license, visit http://creativecommons.org/licenses/by-sa/3.0/"                                                                                                         
000000014:   200        536 L    1382 W     25900 Ch    "http://10.129.167.150/"                                                                                                                                                  
000000013:   200        536 L    1382 W     25900 Ch    "#"                                                                                                                                                                       
000000006:   200        536 L    1382 W     25900 Ch    "# Attribution-Share Alike 3.0 License. To view a copy of this"                                                                                                           
000000010:   200        536 L    1382 W     25900 Ch    "#"                                                                                                                                                                       
000000008:   200        536 L    1382 W     25900 Ch    "# or send a letter to Creative Commons, 171 Second Street,"                                                                                                              
000000012:   200        536 L    1382 W     25900 Ch    "# on at least 1 host"                                                                                                                                                    
000000011:   200        536 L    1382 W     25900 Ch    "# Priority-ordered case-insensitive list, where entries were found"                                                                                                      
000000009:   200        536 L    1382 W     25900 Ch    "# Suite 300, San Francisco, California, 94105, USA."                                                                                                                     
000000002:   200        536 L    1382 W     25900 Ch    "#"                                                                                                                                                                       
000000005:   200        536 L    1382 W     25900 Ch    "# This work is licensed under the Creative Commons"                                                                                                                      
000000004:   200        536 L    1382 W     25900 Ch    "#"                                                                                                                                                                       
000000039:   301        10 L     16 W       173 Ch      "img"                                                                                                                                                                     
000000547:   301        10 L     16 W       173 Ch      "css"                                                                                                                                                                     
000000920:   301        10 L     16 W       171 Ch      "js"                                                                                                                                                                      
000002576:   301        10 L     16 W       177 Ch      "fonts"
```
