---
layout: post
title: "ASP.Net Expressions Overview"
date: 2000-01-01 00:00:00
categories: Programming Troubleshooting
tags: asp.net
---

ASPX in-page expressions, which are nearly impossible to search for information on thanks to their tiny size and obscure-to-search-engines character selection if you don't know what to call this group of expressions. Some search friendly terms that can help bridge that divide are:

* less than percent hash
* less than percent equals
* in-page expressions
* data binding
* data bound
* bee strings
* asp.net server tags
* code render blocks

For anybody lucky enough to uncover this page then, here's an explanation of the what and the why behind <%$, <%@, <%=, <%# and so on:

* `<% %>` is for inline code (especially logic flow)
* `<%$ %>` is for evaluating expressions (like resource variables)
* `<%@ %>` is for Page directives, registering assemblies, importing namespaces, etc.
* `<%= %>` is short-hand for Response.Write (discussed here)
* `<%# %>` is used for data binding expressions.
* `<%: %>` is short-hand for Response.Write(Server.HTMLEncode()) ASP.net 4.0+
* `<%-- --%>` is for server-side comments

This information is replicated the following sources [StackOverflow][stackoverflow] post, [Dan Crevier’s][dancre] blog and in an [MSDN][d5bd1tad] article. No excuses then.

[stackoverflow]: http://stackoverflow.com/questions/957284/whats-the-deal
[dancre]: http://blogs.msdn.com/b/dancre/archive/2007/02/13/the-difference-between-lt-and-lt-in-asp-net.aspx
[d5bd1tad]: http://msdn.microsoft.com/en-us/library/d5bd1tad.aspx