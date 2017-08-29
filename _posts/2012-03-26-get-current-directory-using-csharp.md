---
layout: post
title: "Get the current directory using C#"
date: 2012-03-26
categories: code
tags: c#
permalink: /:title
redirect_from:
  - "/performance/2012/03/26/get-current-directory-using-csharp.html"
---

How should you get the "current" directory of the executing binary in C#? There are a couple of options expose the directory and name of executing application, but with subtle differences:

1. `AppDomain.BaseDirectory` - Gets the base directory that the assembly resolver uses to probe for assemblies.
2. `Application.ExecutablePath` - Includes the assembly name.
3. `Application.StartupPath` - This is inside the Windows.System.Forms namespace.
4. `Directory.GetCurrentDirectory()`- Executes a Windows API call to GetCurrentDirectory() in kernel32.dll.
5. `Environment.CurrentDirectory` - This is an alias to Directory.GetCurrentDirectory() in System.IO.
5. `this.GetType().Assembly.Location` - Includes the assembly name, or the base directory if you are calling a separate class library.
7. `Assembly.GetExecutingAssembly().Location` - From the System.Reflection namespace.
8. `Assembly.GetAssembly(typeof(MyAssemblyType)).Location` - Derive from a given type.
9. `System.Reflection.Assembly.GetEntryAssembly().Location` - Gets the full path or UNC location of the loaded file that contains the manifest.

My prefered method is `AppDomain.CurrentDomain.BaseDirectory`, it works with ASP.Net, Forms, WPF, Console applications and Services. It will also return the correct base directory for class libraries too.

```
var path = AppDomain.CurrentDomain.BaseDirectory;
```

The string returned includes a trailing backslash; For example: `C:\Project1\bin\Debug\`