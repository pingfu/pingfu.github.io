---
layout: post
title: "Get the current directory using C#"
date: 2012-03-26
categories: Performance
tags: c#
---

How to get the current directory in C#?

There are several ways to get the current directory, that is the directory from which the application is executing…

1. Application.ExecutablePath
   Includes the assembly name.
2. Application.StartupPath
   This is inside the Windows.System.Forms namespace.
3. Directory.GetCurrentDirectory()
   Executes a Windows API call to GetCurrentDirectory() in kernel32.dll.
4. Environment.CurrentDirectory
   This is an alias to Directory.GetCurrentDirectory() in System.IO.
5. this.GetType().Assembly.Location
   Includes the assembly name, or the base directory if you are calling a separate class library.

However, the most generic and appropriate method in most instances is to use the `AppDomain.CurrentDomain.BaseDirectory` property. It works for ASP.NET, Forms and Console applications, and will also return the base directory for class libraries.

```
var path = AppDomain.CurrentDomain.BaseDirectory;
```

The path string returned includes a trailing backslash; For example:

```
C:\Project1\bin\Debug\
```