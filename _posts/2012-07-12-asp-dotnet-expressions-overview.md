---
layout: post
title: "ASP.net Expressions Overview"
date: 2012-07-12
categories: Programming Troubleshooting
tags: asp.net
permalink: /:title
redirect_from:
  - "/programming/troubleshooting/2012/07/12/asp-dotnet-expressions-overview.html"
---

ASPX in-page expressions are, if you don't know what to call them, nearly impossible to search. So on the off chance that this helps somebody, here are some search-friendly terms that might one day get crawled; (less than percent hash), (less than percent equals), (in-page expressions), (data binding), (data bound), (bee strings), (asp.net server tags), (code render blocks)

* `<% %>` is for inline code (especially logic flow)
* `<%$ %>` is for evaluating expressions (like resource variables)
* `<%@ %>` is for Page directives, registering assemblies, importing namespaces, etc.
* `<%= %>` is short-hand for Response.Write (discussed here)
* `<%# %>` is used for data binding expressions.
* `<%: %>` is short-hand for Response.Write(Server.HTMLEncode()) in ASP.net 4.0+
* `<%-- --%>` is for server-side comments

This information is replicated from the following sources [StackOverflow][stackoverflow] post, [Dan Crevier’s][dancre] blog and in an [MSDN][d5bd1tad] article. No excuses then.

[stackoverflow]: http://stackoverflow.com/questions/957284/whats-the-deal
[dancre]: http://blogs.msdn.com/b/dancre/archive/2007/02/13/the-difference-between-lt-and-lt-in-asp-net.aspx
[d5bd1tad]: http://msdn.microsoft.com/en-us/library/d5bd1tad.aspx