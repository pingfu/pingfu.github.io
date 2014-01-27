---
layout: post
title: "Service “Must specify value for source” error."
date: 2011-08-10
categories: Programming
tags: c#
---

```
Must specify value for source. at System.Configuration.Install.TransactedInstaller.Install(IDictionary savedState)
```

I found myself encountering this problem whilst preparing material for the next post on services and .NET. As I was calling the .Installers.Add() method from the instance of my TransactedInstaller object (called ti) I realised that whilst it expects you to pass a new instance of an object of type Installer,  I was actually passing, “new ServiceInstaller” which had, at one point been the name of my class- the problem however is that this of course translates not to the name of my class, but to Service.ServiceProcess.ServiceInstaller.

In my class that deals with service installation I had the following code:

```csharp
class InstallerClass : Installer
{
    public InstallerClass()
    {
        var spi = new ServiceProcessInstaller();
        var si = new ServiceInstaller();

        spi.Account = ServiceAccount.LocalSystem;
        si.StartType = ServiceStartMode.Automatic;
        si.ServiceName = SVC_APP_NAME;

        Installers.Add(spi);
        Installers.Add(si);
    }
```

Some lines below in a different method I was calling TransactedInstaller:

```csharp
ti.Installers.Add(new ServiceInstaller());
ti.Install(new Hashtable());
```

The exception complaining about, “must specify a value for source” actually meant, I hadn’t set the ServiceName property. The reason for this is that my TransactedInstaller was creating a new instance of a class in .Net managed libraries, not a new instance of my class so the code that sets the ServiceName was never being called and violla: must specify value for source.

So, an easy fix:

```csharp
ti.Installers.Add(new SampleInstallerClass());
ti.Install(new Hashtable());
```