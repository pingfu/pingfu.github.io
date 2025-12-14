---
layout: post
title: "Using the PowerShell cmdlet Get-WinEvent to search and filter event and diagnostic logs"
date: 2016-09-28
tags: powershell
permalink: /:title
redirect_from:
  - "/administration/2016/09/28/searching-eventlogs.html"
---

Recently, a colleague wanted a way to search the body of Windows eventlogs – for instance if you wanted to count the occurances of a certain type of event where the traditional filtering fields are unable to differentiate between events.

The powershell cmdlet `Get-WinEvent` output can be piped into `where-object` to provide a set of events filtered by the search term in the eventlog body.


```powershell
Get-WinEvent -FilterHashtable @{logname='application'; ProviderName='ASP.NET 4.0.30319.0'} | where-object  { $_.Message -like '*The timeout period elapsed prior to obtaining a connection from the pool*' }
```

Thanks Matt.