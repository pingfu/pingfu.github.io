---
layout: post
title: "Service “Must specify value for source” error."
date: 2011-08-10
categories: Programming
tags: c#
permalink: /:title
redirect_from:
  - "/programming/2011/08/10/service-must-specify-value-for-source-error.html"
---

```
Must specify value for source. at System.Configuration.Install.TransactedInstaller.Install(IDictionary savedState)
```

I found myself encountering this problem while preparing material for the next post on services and .NET. As I was calling the `.Installers.Add()` method from the instance of my TransactedInstaller object (called ti) I realised that while it expects you to pass a new instance of an object of type Installer,  I was actually passing, “new ServiceInstaller”. This had at one point been the name of my class- but the problem turned out to be that this translates not to the name of my class, but to Service.ServiceProcess.ServiceInstaller.

<!--excerpt-->

In my class the code which dealt with service installation was:

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

The exception complaining about, “must specify a value for source” actually meant, I hadn’t set the ServiceName property. The reason for this is that my TransactedInstaller was creating a new instance of a framework class, rather than a new instance of my class, so the code that set ServiceName was never being called and violla: must specify value for source.

So, an easy fix:

```csharp
ti.Installers.Add(new SampleInstallerClass());
ti.Install(new Hashtable());
```