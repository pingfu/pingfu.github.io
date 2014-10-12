---
layout: post
title: "Creating a self installing windows service with c#"
date: 2011-08-11
categories: Programming
tags: c#
---

Services are not presented as a thing of beauty in .net - in fact, typically creating a service is gut wrenchingly awful. There are multiple design time components to drop in (and for some reason position as icons), and multiple classes for your Service, your ServiceInstaller, and ServiceBase. Then you meet InstallUtil.exe, so much example code which demonstrates installing services relies on the use of [InstallUtil.exe][googlesearch]. Finally, packaging it all together into an installer. Really, it's all quite disgusting.

There is a better way. We can create a self installing Windows service using C# and pure code. In a single .cs file should we choose: two classes and managed code. Here's how to do it. To demonstrate the simplicity of this we’re not going to use Visual Studio, we’ll use Notepad++ (or whichever your preferred editor of choice happens to be) and will compile by hand using the command line tool csc.exe.

No third party code to bundle or execute, no bloat.

<!--excerpt-->

NB. You can, of course, drop this unedited code into a Visual Studio project and compile as a Console application.

Step 1. Let's review how to compile at the command line. We use csc.exe which can be used in a number of ways. We’ll be using it like this:

```
csc.exe /out:CompliedBinary.exe sourceCode.cs
```

Remember where csc.exe lives and that compiling happens like this:

```
C:\WINDOWS\Microsoft.NET\Framework\v3.5>csc.exe /out:G:\winservice\sample.exe G:\winservice\sample.cs
```

Step 2. (Optional) Project references for Visual Studio - If you’re not compiling by hand, remember to add these two references to your project:

```
System.Configuration.Install
System.ServiceProcess
```

Step 3. The code:

```csharp
using System;
using System.Text;
using System.Configuration.Install;
using System.Collections;
using System.Diagnostics;
using System.ServiceProcess;
using System.Reflection;
using Microsoft.Win32;

namespace sample
{
	class SampleInstallerClass : Installer
	{
		static public String SVC_APP_NAME    = "snaplen";
		static public String SVC_SERVICE_KEY = @"SYSTEM\CurrentControlSet\Services\" + SVC_APP_NAME;
		static public String SVC_PARAM_KEY   = @"SYSTEM\CurrentControlSet\Services\" + SVC_APP_NAME + @"\Parameters";

		public SampleInstallerClass()
		{
			ServiceProcessInstaller spi = new ServiceProcessInstaller();
			ServiceInstaller si = new ServiceInstaller();

			spi.Account    = ServiceAccount.LocalSystem;
			si.StartType   = ServiceStartMode.Automatic;
			si.ServiceName = SVC_APP_NAME;

			Installers.Add(spi);
			Installers.Add(si);
		}

		static int install_uninstall( bool uninstall )
		{
			try
			{
				TransactedInstaller ti = new TransactedInstaller();

				if ( uninstall == false )
				{
					ArrayList cmdline = new ArrayList();

					cmdline.Add( String.Format( "/assemblypath={0}", Assembly.GetExecutingAssembly().Location) );
					cmdline.Add( "/logToConsole=false" );
					cmdline.Add( "/showCallStack" );

					InstallContext ctx = new InstallContext("installer_logfile.log", cmdline.ToArray(typeof(string)) as string[] );

					ti.Installers.Add( new SampleInstallerClass() );
					ti.Context = ctx;
					ti.Install( new Hashtable() );

					RegistryKey k = Registry.LocalMachine.OpenSubKey( SVC_SERVICE_KEY, true );
					k.SetValue("Description", "Sample service");
					k.CreateSubKey("Parameters"); // add any configuration parameters in to this sub-key to read back OnStart()
					k.Close();

					Console.WriteLine("Installation successful, starting service '{0}'...", SVC_APP_NAME );

					// attempt to start the service
					ServiceController service = new ServiceController( SVC_APP_NAME );
					TimeSpan timeout = TimeSpan.FromMilliseconds(15000);
					service.Start();
					service.WaitForStatus( ServiceControllerStatus.Running, timeout );
					return 0;
				}
				else
				{
					ti.Uninstall(null);
					return 0;
				}
			}
			catch (Exception e)
			{
				Console.WriteLine(e.InnerException.Message + e.StackTrace);
				return(1);
			}
		}

		static void doSomething()
		{
			Console.WriteLine("anything");
		}

		static int Main(string[] args)
		{
			if ( args.Length > 0 )
			{
				String cmd = args[0];

				if ( cmd.Equals("-i") || cmd.Equals("-u") )
				{
					return install_uninstall( cmd.Equals("-u") );
				}
				else if ( cmd.Equals("-h") )
				{
					Console.Write( SVC_APP_NAME );
					Console.Write("Options:\n");
					Console.Write("  --help\tShow command line switch help\n");
					Console.Write("  -i\t\tInstall Service\n\t\t-u\tUninstall Service\n");
				}
				return (0);
			}
			else
			{
				Console.WriteLine("no arguments!");
			}

			ServiceBase.Run( new SampleServiceClass() );
			return 0;
		}
	}

	class SampleServiceClass : ServiceBase
	{
		public SampleServiceClass()
		{
			this.AutoLog = false;
			this.CanHandlePowerEvent = true;
			this.CanPauseAndContinue = false;
			this.CanShutdown = true;
			this.ServiceName = "snaplen example service";
		}

		protected override bool OnPowerEvent(PowerBroadcastStatus ps)
		{
			return true;
		}

		protected override void OnStart(string[] args)
		{
			// add your code
		}

		protected override void OnStop()
		{
			// add your code
		}

		protected override void OnShutdown()
		{
			// add your code
		}
	}
}
```

Step 4. Compile

```
C:\>cd C:\WINDOWS\Microsoft.NET\Framework\v3.5\

C:\WINDOWS\Microsoft.NET\Framework\v3.5>csc.exe /out:G:\winservice\sample.exe  G:\winservice\sample.cs
Microsoft (R) Visual C# 2008 Compiler version 3.5.30729.1
for Microsoft (R) .NET Framework version 3.5
Copyright (C) Microsoft Corporation. All rights reserved.

C:\WINDOWS\Microsoft.NET\Framework\v3.5>
```

Step 5. Run! You’ll notice (using SysInternals Suite – [Process Explorer][sysinternals]) that a new service process has spawned, and if you scrutinize services.mmc you’ll also note that your new service is installed and running.

```
g:\winservice>sample.exe
no arguments!

g:\winservice>sample.exe -h
snaplenOptions:
  --help        Show command line switch help
  -i            Install Service
  -u            Uninstall Service

g:\winservice>sample.exe -i
Installation successful, starting service 'snaplen'...

g:\winservice>
```

Step 6. Uninstall

```
g:\winservice>sample.exe -u

The uninstall is beginning.
The uninstall has completed.
```

Simples.

[googlesearch]: http://www.google.co.uk/search?q=how+to+create+a+windows+service+c%23
[sysinternals]: http://live.sysinternals.com/