---
layout: post
title: "Beaglebone Driver Problem"
date: 2013-12-07
tags: beagleboard
permalink: /:title
redirect_from:
  - "/programming/troubleshooting/hardware/2013/12/07/beaglebone-black-driver-problem.html"
---

I'll spare you the back story, but in brief installing the USB NIC driver for the beaglebone black is horribly annoying if you're using a UK keyboard layout.

`“The current language is not supported by the Device Driver Installation Wizard.”`

Really? The same message from both `\Drivers\Windows\BONE_D64.exe` and `\BONE_DRV.exe`

My current system locale is English – so that doesn’t sound right. British English, that is. Crack open either of those binaries (I used 7-zip) and you’ll find `dpinst.exe` and `dpinst.xml`.

Investigating the XML file reveals several sets of language tags;

```html
<language code="0x0409">.....</language>
<language code="0x0804"></language>
<language code="0x0401"></language>
...
```

<!--excerpt-->

The code for British English is missing, and the binary quite unforgivingly handles this situation by refusing to install, rather than picking US English or any other language as a default. 

It was easy enough to fix. A quick search and I've found a document published by Microsoft titled, `“Language Identifier Constants and Strings”` which enumerates the language and locale specific identifier codes built into the Windows API, so `0×0809` – the code for United Kingdom (GB). Maybe you can find yours in the list too.

[http://msdn.microsoft.com/en-us/library/dd318693(VS.85).aspx][dd318693]

I added the missing locale identifier to the XML document and moved on to the next obstacle.

```html
<language code="0x0809"></language>
```

Next problem: The drivers are unsigned and Windows 8 doesn't like that.

Windows 8 now entirely rejects unsigned drivers. One work around is quite simple: reboot into the advanced OS boot options menu and temporarily enable the installation of unsigned drivers. Unsigned driver protection is automatically re-enabled on the next reboot.

We can reboot into the advanced boot options menu from a command prompt:

```
C:\> shutdown -o -r -t 0
```

The options I’m using are;

* `-o` - Go to the advanced boot options menu and restart the computer.
* `-r` - Reboot.
* `-t` - Time before shutdown in seconds.

Much better, but what an awkward and fiddly process!

[dd318693]: http://msdn.microsoft.com/en-us/library/dd318693(VS.85).aspx