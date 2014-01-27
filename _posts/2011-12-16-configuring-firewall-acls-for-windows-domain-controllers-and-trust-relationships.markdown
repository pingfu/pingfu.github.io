---
layout: post
title: "Configuring firewall ACLs for Windows domain controllers and trust relationships"
date: 2011-12-16
categories: Security Troubleshooting
tags: windows firewall
---

To establish a domain trust or a security channel across a firewall, the following ports must be opened. Be aware that there may be hosts functioning with both client and server roles on both sides of the firewall. Therefore, ports rules may have to be mirrored.

### Windows Server 2003 and Windows 2000 Server

For a mixed-mode domain that uses either Windows NT domain controllers or legacy clients, trust relationships between Windows Server 2003-based domain controllers and Windows 2000 Server-based domain controllers may necessitate that all the ports for Windows NT that are listed in the previous table be opened in addition to the following ports.

Note The two domain controllers are both in the same forest, or the two domain controllers are both in a separate forest. Also, the trusts in the forest are Windows Server 2003 trusts or later version trusts.

```
| Client Port(s)           | Server Port           | Service          | 
| ------------------------ | --------------------- | ---------------- |
| 1024-65535/TCP           | 135/TCP               | RPC              |
| 1024-65535/TCP           | 1024-65535/TCP        | LSA RPC Services |
| 1024-65535/TCP/UDP       | 389/TCP/UDP           | LDAP             |
| 1024-65535/TCP           | 636/TCP               | LDAP SSL         |
| 1024-65535/TCP           | 3268/TCP              | LDAP GC          |
| 1024-65535/TCP           | 3269/TCP              | LDAP GC SSL      |
| 53,1024-65535/TCP/UDP    | 53/TCP/UDP            | DNS              |
| 1024-65535/TCP/UDP       | 88/TCP/UDP            | Kerberos         |
| 1024-65535/TCP           | 445/TCP               | SMB              |
```

### Windows Server 2008/Windows Server 2008 R2

In a mixed-mode domain that consists of Windows Server 2003 domain controllers, Windows 2000 Server-based domain controllers, or legacy clients, the default dynamic port range is 1025 through 5000. Windows Server 2008 and Windows Server 2008 R2, in compliance with Internet Assigned Numbers Authority (IANA) recommendations, has increased the dynamic client port range for outgoing connections. The new default start port is 49152, and the default end port is 65535. Therefore, you must increase the RPC port range in your firewalls.

```
| Client Port(s)           | Server Port           | Service     | 
| ------------------------ | --------------------- | ----------- |
| 49152 -65535/UDP         | 123/UDP               | W32Time     |
| 49152 -65535/TCP	       | 135/TCP               | RPC-EPMAP   |
| 49152 -65535/TCP         | 138/UDP               | Netbios     |
| 49152 -65535/TCP         | 49152 -65535/TCP      | RPC         |
| 49152 -65535/TCP/UDP     | 389/TCP/UDP           | LDAP        |
| 49152 -65535/TCP         | 636/TCP               | LDAP SSL    |
| 49152 -65535/TCP         | 3268/TCP              | LDAP GC     |
| 49152 -65535/TCP         | 3269/TCP              | LDAP GC SSL |
| 53, 49152 -65535/TCP/UDP | 53/TCP/UDP            | DNS         |
| 49152 -65535/TCP         | 135, 49152 -65535/TCP | RPC DNS     |
| 49152 -65535/TCP/UDP     | 88/TCP/UDP            | Kerberos    |
| 49152 -65535/TCP/UDP     | 445/NP-TCP/NP-UDP     | SAM/LSA     |
```

### Active Directory

For Active Directory to function correctly through a firewall, the Internet Control Message Protocol (ICMP) protocol must be allowed through the firewall from the clients to the domain controllers so that the clients can receive Group Policy information.

ICMP is used to determine whether the link is a slow link or a fast link. ICMP is a legitimate protocol that Active Directory uses for Group Policy detection and for Maximum Transfer Unit (MTU) detection. The Windows Redirector also uses ICMP to verify that a server IP is resolved by the DNS service before a connection is made.