---
layout: post
title: "Net.TCP IIS7 WCF and .Net"
date: 2011-02-25
categories: News, Security, Troubleshooting
tags: net.tcp
---

Microsoft has recently re-invented the wheel (http) with their most recent addition to Windows Communication Foundation (WCF), the net.tcp protocol. The motivation is simple enough, drop http due to its inherent performance inefficiencies.  Microsoft have defined new URI handler for the http killer, net.tcp://resource/

What I find curious about net.tcp is the design decision that separates it from http.sys. http.sys is the kernel-mode protocol listener for http, introduced with IIS 6.0. It allows multiple processes to share the same port for communication at the same time. This model of abstraction enabled arbitrary processes to share the same port, IIS application pools and worker processes for example.

In net.tcp, Microsoft have strayed from their previous abstraction model and implemented the service listener in a service named the "Net.TCP Port Sharing Service". A detachment from http.sys. Simply put, http, https and net.tcp bindings are configured centrally within IIS, but net.tcp bindings and http or https bindings cannot coexist on the same port, something you might not quite expect.

Expect to be punching firewall holes to support new port bindings for wcf and net.tcp bindings. Microsoft are backing tcp/808 as the standard net.tcp port.

See [this MSDN article][ms734772] for more information.

[ms734772]: http://msdn.microsoft.com/en-us/library/ms734772.aspx