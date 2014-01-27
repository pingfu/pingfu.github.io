---
layout: post
title: "Net.TCP IIS7 WCF and .Net"
date: 2011-02-25
categories: News
---

Microsoft has recently re-invented the HTTP wheel with their most recent addition to Windows Communication Foundation (WCF), the Net.TCP protocol. The idea is a simple, drop HTTP and it’s associated inefficiencies.  They’ve even created a new handler for the TCP-based network protocol – net.tcp://resource/

What is curious about Net.TCP is the design decision that separates it from HTTP.SYS. For those that don’t know, HTTP.SYS is the kernel-mode HTTP protocol listener introduced with IIS 6.0 that allows multiple processes to share the same port for communication. This kernel-mode driver allowed arbritrary user processes to share the ports allowing Microsoft to introduce the concept of an application pool.

Net.TCP’s implementation is a detatchment from HTTP.SYS model as the listener exists in a service called the Net.TCP Port Sharing Service. Put simply, this means whilst HTTP, HTTPS and Net.TCP bindings are managed in IIS, Net.TCP and HTTP/HTTPS based applications cannot share the same port, something you might be quite used to doing if you run multi-tenant IIS hosting environments.

So firewall administrators, prepare to be opening additional ports on your firewalls to support WCF Net.TCP communication channels. Microsoft have volunteered tcp/808 as the default port to adopt for the running of their new protocol.

NB. This does not however mark a detachment from Microsoft’s bizarre new technology naming conventions. Net.TCP leaves search engine enthusiasts fumbling red-herrings as the two long established generic keywords delimited with a period turn up mountains of largely irrelevant information. Annoying!

See [this MSDN article][ms734772] for more information.

[ms734772]: http://msdn.microsoft.com/en-us/library/ms734772.aspx