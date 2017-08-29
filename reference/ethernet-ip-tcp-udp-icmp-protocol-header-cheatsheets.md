---
layout: page
title: Protocol Header Cheetsheets
css_class_name: protocol-header-cheetsheets
---

# {{page.title}}

A set of cheetsheets for Ethernet, IPv4, UDP, TCP and ICMP protocol headers.

* [Ethernet Frame Header](#ethernet-frame-header)
* [IPv4 Protocol Header](#ipv4-header)
* [TCP Protocol Header](#tcp-header)
* [UDP Protocol Header](#udp-header)
* [ICMP Protocol Header](#icmp-header)
* [A3 Wall Poster](#protocol-frames-cheetsheet---a3-wall-poster)
* [Source code and licence](#source-code-and-licence)

## Ethernet Frame Header

[![Ethernet Frame](/img/cheat-sheets/ethernet-header.png)](/img/cheat-sheets/ethernet-header.png)

### Notes

* An ethernet frame has a minimum size of `64` bytes and a maximum size of `1,518` bytes.
* Any frames smaller than the `64` byte minimum is interpreted by receivers as a collision. The Ethernet frame payload may not exceed `1,500` bytes.
* The minimum **payload** size is `42` bytes when an 802.1q tag is present, or `46` bytes if 802.1q tags are not used.
* The Maximum Transmission Unit (MTU) value governs the size of the payload, and nearly all IP over Ethernet implementations use Ethernet V2, which specifies an MTU value of `1,500`.
* When the payload is not large enough to produce a frame of `64` bytes in length, padding is added accordingly.
* Some components of the frame at OSI Layer 1 are usually stripped by hardware adapters, do not count towards the frame size, and are not usually visible to packet sniffing software. Almost no ethernet adapters supply the preamble and SFD. Some adapters may supply the CRC/FCS. Wireshark attempts to guess whether an Ethernet packet has an FCS and, if it thinks it does, handles it as such. See [here](https://serverfault.com/questions/521443/can-wireshark-capture-an-entire-ethernet-frame-including-preamble-crc-and-inter) for more information.
* Any Ethernet frame less than 64 bytes on the wire is considered by the receiving station to be a "collision fragment" or "runt frame", and is automatically discarded. Note that frames smaller than 64 bytes do not cause collisions, but are just interpreted as such.
* **Preamble** and **Start of frame delimiter (SFD)** See [https://en.wikipedia.org/wiki/Ethernet_frame](https://en.wikipedia.org/wiki/Ethernet_frame)
* **Frame check sequence (32‑bit CRC)** See [https://en.wikipedia.org/wiki/Frame_check_sequence](https://en.wikipedia.org/wiki/Frame_check_sequence)
* **Interpacket gap** See [https://en.wikipedia.org/wiki/Interpacket_gap](https://en.wikipedia.org/wiki/Interpacket_gap) and [https://serverfault.com/questions/422158/](https://serverfault.com/questions/422158/what-is-the-in-the-wire-size-of-a-ethernet-frame-1518-or-1542)
* The Preamble, SFD and Interframe Gap do not count as part of the frame. They are support structure for the Ethernet protocol itself.
* **802.1q tag** is composed of four smaller fields: Tag protocol identifier (TPID, 16 bits), Priority code point (PCP, 3 bits), Drop eligible indicator flag (DEI, 1 bit, formerly CFI), VLAN identifier (VID, 12 bits). Ignoring [VXLAN](https://en.wikipedia.org/wiki/Virtual_Extensible_LAN), This is why network devices do not carry more than 4,096 vlans (`2^12`). See [here](https://en.wikipedia.org/wiki/IEEE_802.1Q) for more information.

## Summary

Description | Value | Explanation
------------|-------|------------
Basic frame size | `64` bytes upto `1,518` bytes | `1,538` bytes on the wire
Q-tagged (802.1q) frame size | `64` bytes upto `1,522` bytes | `1,542` bytes on the wire
Envelope frame size | `64` bytes upto `2,000` bytes |
Maximum frame payload without fragmentation | `1,500` bytes |
Minimum frame payload | `46` bytes |
Minimum frame payload with 802.Q tag | `42` bytes |

---

## IPv4 Header

[![IPv4 Header](/img/cheat-sheets/ipv4-header.png)](/img/cheat-sheets/ipv4-header.png)

### Notes

* The Internet Protocol (IPv4) is defined in [RFC 791](http://tools.ietf.org/html/rfc791) which specifies the format of the header.
* **IHL** (Internet Header Length) is 4 bits long and specifies the header length in increments of 32 bits (DWORD). The IHL field can hold values from 0 (Binary `0000`) to 15 (Binary `1111`). So the longest the IP header size can be is upto 480 bits, which is 60 bytes. The shortest header size is 5 dwords (20 bytes), where the IHL field has the value of 5 (Binary `0101`). This is because all of the required fields in the header require 20 bytes as a minimum.
* The **Type of Service (ToS)** field is obsoleted by [RFC 2474](https://tools.ietf.org/html/rfc2474) (updated by [RFC 3168](https://tools.ietf.org/html/rfc3168) and [RFC 3260](https://tools.ietf.org/html/rfc3260)) is used for [Differentiated Services Code Point (DSCP)](https://en.wikipedia.org/wiki/Differentiated_services) and [Explicit Congestion Notification (ECN)](https://en.wikipedia.org/wiki/Explicit_Congestion_Notification).
* The **Flags** field is composed of 3 smaller fields: Reserved (must be 0), Don't fragment bit (DF) and More fragments bit (MF).

### Summary

Description | Value | Explanation
------------|-------|------------
Maximum IPv4 payload size without fragmentation | `1,480` bytes | Maximum Ethernet frame size at 1,500 bytes **minus** IPv4 header at 20 bytes
Maximum legal IPv4 payload size | `65,515` bytes | Maximum IPv4 packet size at 65,535 bytes (x0FFFF) **minus** IPv4 header at 20 bytes

---


## TCP Header

[![TCP Header](/img/cheat-sheets/tcp-header.png)](/img/cheat-sheets/tcp-header.png)

### Notes

### Summary

Description | Value | Explanation
------------|-------|------------
Maximim TCP payload size without fragmentation | `1,460` bytes | Maximum Ethernet frame size at 1,500 bytes **minus** IPv4 header at 20 bytes **minus** TCP header at 20 bytes
Maximum legal TCP payload size | `65,495` bytes | Maximum IPv4 packet size at 65,535 bytes (x0FFFF) **minus** IPv4 header at 20 bytes **minus** TCP header at 20 bytes

---

## UDP Header

[![UDP Header](/img/cheat-sheets/udp-header.png)](/img/cheat-sheets/udp-header.png)

### Notes

* A UDP datagram is carried in a single IP packet and is hence limited to a maximum payload of `65,507` bytes for IPv4 and `65,527` bytes for IPv6

### Summary

Description | Value | Explanation
------------|-------|------------
Maximim UDP payload size without fragmentation | `1,472` bytes | Maximum Ethernet frame size at 1,500 bytes **minus** IPv4 header at 20 bytes **minus** UDP header at 8 bytes
Maximum legal UDP payload size | `65,507` bytes | Maximum IPv4 packet size at 65,535 bytes (x0FFFF) **minus** IPv4 header at 20 bytes **minus** UDP header at 8 bytes

---

## ICMP Header

[![ICMP Header](/img/cheat-sheets/icmp-header.png)](/img/cheat-sheets/icmp-header.png)

### Notes

### Summary

Description | Value | Explanation
------------|-------|------------
Maximum ICMP payload size without fragmentation | `1,472` bytes | Maximum single Ethernet frame at 1,500 bytes **minus** IPv4 header at 20 bytes **minus** ICMP header at 8 bytes
Maximum legal ICMP payload size                 | `65,507` bytes | Maximum IPv4 packet size at 65,535 bytes (x0FFFF) **minus** IPv4 header at 20 bytes **minus** ICMP header at 8 bytes

---

## Protocol Frames Cheetsheet - A3 Wall Poster

[![Protocol Frames Cheetsheet A3 Poster](/img/cheat-sheets/ethernet-cheatsheet.png)](/img/cheat-sheets/ethernet-cheatsheet.png)

---

## Source code and licence

Original drawings and source at [https://github.com/pingfu/ethernet-cheatsheet](https://github.com/pingfu/ethernet-cheatsheet). Content licensed under CC-BY 3.0, code licensed under MIT. Diagrams created using the excellent [https://www.draw.io/](https://www.draw.io/)








<div id="disqus_thread"></div>

<script type="text/javascript">

    // more options @ http://help.disqus.com/customer/portal/articles/472098-javascript-configuration-variables
    var disqus_shortname = 'pingfu';		

    (function() {
        var dsq = document.createElement('script'); 
        dsq.type = 'text/javascript'; 
        dsq.async = true;
        dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
    })();

</script>

<a href="//disqus.com" class="dsq-brlink">comments powered by <span class="logo-disqus">Disqus</span></a>
