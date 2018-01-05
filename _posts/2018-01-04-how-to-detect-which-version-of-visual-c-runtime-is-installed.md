---
layout: post
title: "How to check if the Microsoft Visual C++ Runtime is installed"
date: 2018-01-04
categories: csharp
tags: 
permalink: /:title
---

In `C++` if we want to check if a particular version of the runtime is installed we can write conditionals to test the value of the built-in preprocessor macro `_MSC_VER` against known values indicating major releases of the Visual C++ compiler. See [this post from the Visual C++ Team Blog](https://blogs.msdn.microsoft.com/vcblog/2016/10/05/visual-c-compiler-version/) on Visual C++ Compiler Version and the MSDN page on [Predefined Macros](https://msdn.microsoft.com/en-us/library/b0084kay.aspx).

{% highlight c++ linenos %}
#if _MSC_VER >= 1900
	// ...
#elif _MSC_VER >= 1800
	// ...
#else
	// ...
#endif
{% endhighlight %}

 
The following table highlights the major versions of Visual C++ against the _MSC_VER value.
 
{:.vcruntime}
| Visual Studio Version | MSVC++ Version | _MSC_VER | 
| --------------------- | -------------- | -------- |
| Visual Studio 2005    | MSVC++ 8.0     | 1400     |
| Visual Studio 2008    | MSVC++ 9.0     | 1500     |
| Visual Studio 2010    | MSVC++ 10.0    | 1600     |
| Visual Studio 2012    | MSVC++ 11.0    | 1700     |
| Visual Studio 2013    | MSVC++ 12.0    | 1800     |
| Visual Studio 2015    | MSVC++ 14.0    | 1900     |
| Visual Studio 2017    | MSVC++ 14.1    | 1910     |

In `C#` its not so easy. Instead we have to look for the Visual C++ runtime as installed products. The Microsoft Windows Installer function `MsiQueryProductState()` can help with this. It  takes a product code guid as the input parameter, and returns the installation state of the program.

{% highlight csharp linenos %}
{% raw %}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;

namespace ConsoleApp1
{
    public static class MsiProduct
    {
        public static IEnumerable<Guid> GetInstalledProducts(IEnumerable<Guid> productCodes)
        {
            return productCodes.Where(IsProductInstalled);
        }

        public static bool IsProductInstalled(IEnumerable<Guid> productCodes)
        {
            return productCodes.Any(IsProductInstalled);
        }

        public static bool IsProductInstalled(Guid productCode)
        {
            var state = MsiQueryProductState($"{{{productCode}}}");

            if (state == InstallState.INSTALLSTATE_LOCAL ||
                state == InstallState.INSTALLSTATE_DEFAULT)
            {
                return true;
            }

            return false;
        }

        [DllImport("msi.dll")]
        private static extern InstallState MsiQueryProductState(string product);

        private enum InstallState
        {
            INSTALLSTATE_NOTUSED = -7,  // component disabled
            INSTALLSTATE_BADCONFIG = -6,  // configuration datacorrupt
            INSTALLSTATE_INCOMPLETE = -5,  // installationsuspended or in progress
            INSTALLSTATE_SOURCEABSENT = -4,  // run from source,source is unavailable
            INSTALLSTATE_MOREDATA = -3,  // return bufferoverflow
            INSTALLSTATE_INVALIDARG = -2,  // invalid functionargument
            INSTALLSTATE_UNKNOWN = -1,  // unrecognized productor feature
            INSTALLSTATE_BROKEN = 0,  // broken
            INSTALLSTATE_ADVERTISED = 1,  // advertised feature
            INSTALLSTATE_REMOVED = 1,  // component being removed(action state, not settable)
            INSTALLSTATE_ABSENT = 2,  // uninstalled (or actionstate absent but clients remain)
            INSTALLSTATE_LOCAL = 3,  // installed on local drive
            INSTALLSTATE_SOURCE = 4,  // run from source, CD or net
            INSTALLSTATE_DEFAULT = 5  // use default, local or source
        }
    }
}
{% endraw %}
{% endhighlight %}

We therefore need to know the guid product code of each version to check if its installed. As it turns out, there are a lot of versions. Microsoft don't seem to publish a full list with associated guids either,  so we have to assemble our own.

Assembling the full list was a little time consuming, but as of the time of writing the class below can detect every version of the runtime released to date.

Calling `VcRuntime.KnownRuntimeVersions` will return the full list of known runtimes and guids, and `GetInstalledRuntimeVersions()` will do just that. Pass it a collection of `VcRuntimeVersion` typed objects and it will tell you which of those product versions, if any, are installed.

We can use these two functions to craft expressive queries. In the following example, I want to know if any versions of the vc++ runtime are installed from Visual Studio 2013 onwards which also target 64bit operating systems.

{% highlight csharp linenos %}
{% raw %}
var filteredRuntimes = VcRuntime.KnownRuntimeVersions.Where(n => n.MscVer >= VcRuntime.MscVersion.VisualStudio2013 && n.Architecture == VcRuntime.ArchitectureType.x64);
var installedRuntimes = VcRuntime.GetInstalledRuntimeVersions(filteredRuntimes);
{% endraw %}
{% endhighlight %}

The full `VcRuntime` class is below:

{% highlight csharp linenos %}
{% raw %}
using System;
using System.Collections.Generic;
using System.Linq;

namespace ConsoleApp1
{
    public static class VcRuntime
    {
        public enum MscVersion
        {
            VisualStudio2005 = 1400, // MSVC++ 8.0
            VisualStudio2008 = 1500, // MSVC++ 9.0
            VisualStudio2010 = 1600, // MSVC++ 10.0
            VisualStudio2012 = 1700, // MSVC++ 11.0
            VisualStudio2013 = 1800, // MSVC++ 12.0
            VisualStudio2015 = 1900, // MSVC++ 14.0 
            VisualStudio2017 = 1910, // MSVC++ 14.1 
        }

        public enum ArchitectureType
        {
            x86,
            x64,
            IA64
        }

        public class VcRuntimeVersion
        {
            public Guid Guid { get; set; }
            public MscVersion MscVer { get; set; }
            public ArchitectureType Architecture { get; set; }
            public string Version { get; set; }

            public VcRuntimeVersion(Guid guid, MscVersion mscVer, ArchitectureType architecture, string version = "")
            {
                Guid = guid;
                MscVer = mscVer;
                Architecture = architecture;
                Version = version;
            }
        }

        public static IEnumerable<VcRuntimeVersion> GetInstalledRuntimeVersions(IEnumerable<VcRuntimeVersion> filteredRuntimeVersions)
        {
            return filteredRuntimeVersions.Where(runtimeVersion => MsiProduct.IsProductInstalled(runtimeVersion.Guid));
        }

        public static List<VcRuntimeVersion> KnownRuntimeVersions => new List<VcRuntimeVersion>
        {
            // MSVC++ 8.0  _MSC_VER == 1400 (Visual Studio 2005)
            new VcRuntimeVersion(Guid.Parse("{A49F249F-0C91-497F-86DF-B2585E8E76B7}"), MscVersion.VisualStudio2005, ArchitectureType.x86),
            new VcRuntimeVersion(Guid.Parse("{6E8E85E8-CE4B-4FF5-91F7-04999C9FAE6A}"), MscVersion.VisualStudio2005, ArchitectureType.x64),
            new VcRuntimeVersion(Guid.Parse("{03ED71EA-F531-4927-AABD-1C31BCE8E187}"), MscVersion.VisualStudio2005, ArchitectureType.IA64),
            new VcRuntimeVersion(Guid.Parse("{C1C4F017-81CC-94C4-C8FB-1542C0981A2A}"), MscVersion.VisualStudio2005, ArchitectureType.x86, "6.0.2900.2180"),
            new VcRuntimeVersion(Guid.Parse("{1AF2A8DA-7E60-D0B4-29D7-E6453B3D0182}"), MscVersion.VisualStudio2005, ArchitectureType.x64, "6.0.2900.2180"),
            new VcRuntimeVersion(Guid.Parse("{7299052B-02A4-4627-81F2-1818DA5D550D}"), MscVersion.VisualStudio2005, ArchitectureType.x86, "SP1"),
            new VcRuntimeVersion(Guid.Parse("{071C9B48-7C32-4621-A0AC-3F809523288F}"), MscVersion.VisualStudio2005, ArchitectureType.x64, "SP1"),
            new VcRuntimeVersion(Guid.Parse("{0F8FB34E-675E-42ED-850B-29D98C2ECE08}"), MscVersion.VisualStudio2005, ArchitectureType.IA64, "SP1"),
            new VcRuntimeVersion(Guid.Parse("{837B34E3-7C30-493C-8F6A-2B0F04E2912C}"), MscVersion.VisualStudio2005, ArchitectureType.x86, "SP1_ATL_SEC_UPD"),
            new VcRuntimeVersion(Guid.Parse("{6CE5BAE9-D3CA-4B99-891A-1DC6C118A5FC}"), MscVersion.VisualStudio2005, ArchitectureType.x64, "SP1_ATL_SEC_UPD"),
            new VcRuntimeVersion(Guid.Parse("{85025851-A784-46D8-950D-05CB3CA43A13}"), MscVersion.VisualStudio2005, ArchitectureType.IA64, "SP1_ATL_SEC_UPD"),
            
            // MSVC++ 9.0  _MSC_VER == 1500 (Visual Studio 2008)
            new VcRuntimeVersion(Guid.Parse("{FF66E9F6-83E7-3A3E-AF14-8DE9A809A6A4}"), MscVersion.VisualStudio2008, ArchitectureType.x86),
            new VcRuntimeVersion(Guid.Parse("{350AA351-21FA-3270-8B7A-835434E766AD}"), MscVersion.VisualStudio2008, ArchitectureType.x64),
            new VcRuntimeVersion(Guid.Parse("{2B547B43-DB50-3139-9EBE-37D419E0F5FA}"), MscVersion.VisualStudio2008, ArchitectureType.IA64),
            new VcRuntimeVersion(Guid.Parse("{6E815EB9-6CCE-9A53-884E-7857C57002F0}"), MscVersion.VisualStudio2008, ArchitectureType.x86, "9.0.30729.5677"),
            new VcRuntimeVersion(Guid.Parse("{67D6ECF5-CD5F-BA73-2B8B-22BAC8DE1B4D}"), MscVersion.VisualStudio2008, ArchitectureType.x64, "9.0.30729.5677"),
            new VcRuntimeVersion(Guid.Parse("{9A25302D-30C0-39D9-BD6F-21E6EC160475}"), MscVersion.VisualStudio2008, ArchitectureType.x86, "SP1"),
            new VcRuntimeVersion(Guid.Parse("{8220EEFE-38CD-377E-8595-13398D740ACE}"), MscVersion.VisualStudio2008, ArchitectureType.x64, "SP1"),
            new VcRuntimeVersion(Guid.Parse("{5827ECE1-AEB0-328E-B813-6FC68622C1F9}"), MscVersion.VisualStudio2008, ArchitectureType.IA64, "SP1"),
            new VcRuntimeVersion(Guid.Parse("{1F1C2DFC-2D24-3E06-BCB8-725134ADF989}"), MscVersion.VisualStudio2008, ArchitectureType.x86, "SP1_ATL_SEC_UPD"),
            new VcRuntimeVersion(Guid.Parse("{4B6C7001-C7D6-3710-913E-5BC23FCE91E6}"), MscVersion.VisualStudio2008, ArchitectureType.x64, "SP1_ATL_SEC_UPD"),
            new VcRuntimeVersion(Guid.Parse("{977AD349-C2A8-39DD-9273-285C08987C7B}"), MscVersion.VisualStudio2008, ArchitectureType.IA64, "SP1_ATL_SEC_UPD"),
            new VcRuntimeVersion(Guid.Parse("{9BE518E6-ECC6-35A9-88E4-87755C07200F}"), MscVersion.VisualStudio2008, ArchitectureType.x86, "9.0.30729.6161 - SP1_MFC_SEC_UPD"),
            new VcRuntimeVersion(Guid.Parse("{5FCE6D76-F5DC-37AB-B2B8-22AB8CEDB1D4}"), MscVersion.VisualStudio2008, ArchitectureType.x64, "9.0.30729.6161 - SP1_MFC_SEC_UPD"),
            new VcRuntimeVersion(Guid.Parse("{515643D1-4E9E-342F-A75A-D1F16448DC04}"), MscVersion.VisualStudio2008, ArchitectureType.IA64, "9.0.30729.6161 - SP1_MFC_SEC_UPD"),
            
            // MSVC++ 10.0 _MSC_VER == 1600 (Visual Studio 2010)
            new VcRuntimeVersion(Guid.Parse("{196BB40D-1578-3D01-B289-BEFC77A11A1E}"), MscVersion.VisualStudio2010, ArchitectureType.x86),
            new VcRuntimeVersion(Guid.Parse("{DA5E371C-6333-3D8A-93A4-6FD5B20BCC6E}"), MscVersion.VisualStudio2010, ArchitectureType.x64),
            new VcRuntimeVersion(Guid.Parse("{C1A35166-4301-38E9-BA67-02823AD72A1B}"), MscVersion.VisualStudio2010, ArchitectureType.IA64),
            new VcRuntimeVersion(Guid.Parse("{F0C3E5D1-1ADE-321E-8167-68EF0DE699A5}"), MscVersion.VisualStudio2010, ArchitectureType.x86, "10.0.40219 - SP1"),
            new VcRuntimeVersion(Guid.Parse("{1D8E6291-B0D5-35EC-8441-6616F567A0F7}"), MscVersion.VisualStudio2010, ArchitectureType.x64, "10.0.40219 - SP1"),
            new VcRuntimeVersion(Guid.Parse("{88C73C1C-2DE5-3B01-AFB8-B46EF4AB41CD}"), MscVersion.VisualStudio2010, ArchitectureType.IA64, "10.0.40219 - SP1"),
            new VcRuntimeVersion(Guid.Parse("{1D5E3C0F-EDA1-E123-1876-86FED06E995A}"), MscVersion.VisualStudio2010, ArchitectureType.x86, "10.0.40219.325"),
            new VcRuntimeVersion(Guid.Parse("{1926E8D1-5D0B-CE53-4814-66615F760A7F}"), MscVersion.VisualStudio2010, ArchitectureType.x64, "10.0.40219.325"),
            
            // MSVC++ 11.0 _MSC_VER == 1700 (Visual Studio 2012)
            new VcRuntimeVersion(Guid.Parse("{33D1FD90-4274-48A1-9BC1-97E33D9C2D6F}"), MscVersion.VisualStudio2012, ArchitectureType.x86, "11.0.61030.0"),
            new VcRuntimeVersion(Guid.Parse("{CA67548A-5EBE-413A-B50C-4B9CEB6D66C6}"), MscVersion.VisualStudio2012, ArchitectureType.x64, "11.0.61030.0"),
            new VcRuntimeVersion(Guid.Parse("{BD95A8CD-1D9F-35AD-981A-3E7925026EBB}"), MscVersion.VisualStudio2012, ArchitectureType.x86, "11.0.61030.0 - Minimum runtime (Update 4)"),
            new VcRuntimeVersion(Guid.Parse("{CF2BEA3C-26EA-32F8-AA9B-331F7E34BA97}"), MscVersion.VisualStudio2012, ArchitectureType.x64, "11.0.61030.0 - Minimum runtime (Update 4)"),
            new VcRuntimeVersion(Guid.Parse("{B175520C-86A2-35A7-8619-86DC379688B9}"), MscVersion.VisualStudio2012, ArchitectureType.x86, "11.0.61030.0 - Additional runtime (Update 4)"),
            new VcRuntimeVersion(Guid.Parse("{37B8F9C7-03FB-3253-8781-2517C99D7C00}"), MscVersion.VisualStudio2012, ArchitectureType.x64, "11.0.61030.0 - Additional runtime (Update 4)"),

            // MSVC++ 12.0 _MSC_VER == 1800 (Visual Studio 2013)
            new VcRuntimeVersion(Guid.Parse("{F65DB027-AFF3-4070-886A-0D87064AABB1}"), MscVersion.VisualStudio2013, ArchitectureType.x86, "12.0.30501"),
            new VcRuntimeVersion(Guid.Parse("{050D4FC8-5D48-4B8F-8972-47C82C46020F}"), MscVersion.VisualStudio2013, ArchitectureType.x64, "12.0.30501"),
            new VcRuntimeVersion(Guid.Parse("{13A4EE12-23EA-3371-91EE-EFB36DDFFF3E}"), MscVersion.VisualStudio2013, ArchitectureType.x86, "12.0.30501 - Minimum runtime"),
            new VcRuntimeVersion(Guid.Parse("{A749D8E6-B613-3BE3-8F5F-045C84EBA29B}"), MscVersion.VisualStudio2013, ArchitectureType.x64, "12.0.30501 - Minimum runtime"),
            new VcRuntimeVersion(Guid.Parse("{F8CFEB22-A2E7-3971-9EDA-4B11EDEFC185}"), MscVersion.VisualStudio2013, ArchitectureType.x86, "12.0.30501 - Additional runtime"),
            new VcRuntimeVersion(Guid.Parse("{929FBD26-9020-399B-9A7A-751D61F0B942}"), MscVersion.VisualStudio2013, ArchitectureType.x64, "12.0.30501 - Additional runtime"),

            // MSVC++ 14.0 _MSC_VER == 1900 (Visual Studio 2015)
            new VcRuntimeVersion(Guid.Parse("{74D0E5DB-B326-4DAE-A6B2-445B9DE1836E}"), MscVersion.VisualStudio2015, ArchitectureType.x86, "14.0.23026"),
            new VcRuntimeVersion(Guid.Parse("{E46ECA4F-393B-40DF-9F49-076FAF788D83}"), MscVersion.VisualStudio2015, ArchitectureType.x64, "14.0.23026"),
            new VcRuntimeVersion(Guid.Parse("{A2563E55-3BEC-3828-8D67-E5E8B9E8B675}"), MscVersion.VisualStudio2015, ArchitectureType.x86, "14.0.23026 - Minimum runtime"),
            new VcRuntimeVersion(Guid.Parse("{0D3E9E15-DE7A-300B-96F1-B4AF12B96488}"), MscVersion.VisualStudio2015, ArchitectureType.x64, "14.0.23026 - Minimum runtime"),
            new VcRuntimeVersion(Guid.Parse("{BE960C1C-7BAD-3DE6-8B1A-2616FE532845}"), MscVersion.VisualStudio2015, ArchitectureType.x86, "14.0.23026 - Additional runtime"),
            new VcRuntimeVersion(Guid.Parse("{BC958BD2-5DAC-3862-BB1A-C1BE0790438D}"), MscVersion.VisualStudio2015, ArchitectureType.x64, "14.0.23026 - Additional runtime"),
            new VcRuntimeVersion(Guid.Parse("{2E085FD2-A3E4-4B39-8E10-6B8D35F55244}"), MscVersion.VisualStudio2015, ArchitectureType.x86, "14.0.23918.0"),
            new VcRuntimeVersion(Guid.Parse("{DAB68466-3A7D-41A8-A5CF-415E3FF8EF71}"), MscVersion.VisualStudio2015, ArchitectureType.x64, "14.0.23918.0"),
            new VcRuntimeVersion(Guid.Parse("{8FD71E98-EE44-3844-9DAD-9CB0BBBC603C}"), MscVersion.VisualStudio2015, ArchitectureType.x86, "14.0.24210"),
            new VcRuntimeVersion(Guid.Parse("{C0B2C673-ECAA-372D-94E5-E89440D087AD}"), MscVersion.VisualStudio2015, ArchitectureType.x64, "14.0.24210"),
            new VcRuntimeVersion(Guid.Parse("{BBF2AC74-720C-3CB3-8291-5E34039232FA}"), MscVersion.VisualStudio2015, ArchitectureType.x86, "14.0.24215 - Minimum runtime"),
            new VcRuntimeVersion(Guid.Parse("{50A2BC33-C9CD-3BF1-A8FF-53C10A0B183C}"), MscVersion.VisualStudio2015, ArchitectureType.x64, "14.0.24215 - Minimum runtime"),
            new VcRuntimeVersion(Guid.Parse("{C956892E-D1F3-3781-935C-8D9060E7CD7E}"), MscVersion.VisualStudio2015, ArchitectureType.x86, "14.0.24215 - Debug runtime"),
            new VcRuntimeVersion(Guid.Parse("{406CC721-9FAD-3610-B44E-3130F84358D8}"), MscVersion.VisualStudio2015, ArchitectureType.x64, "14.0.24215 - Debug runtime"),
            new VcRuntimeVersion(Guid.Parse("{69BCE4AC-9572-3271-A2FB-9423BDA36A43}"), MscVersion.VisualStudio2015, ArchitectureType.x86, "14.0.24215 - Additional runtime"),
            new VcRuntimeVersion(Guid.Parse("{EF1EC6A9-17DE-3DA9-B040-686A1E8A8B04}"), MscVersion.VisualStudio2015, ArchitectureType.x64, "14.0.24215 - Additional runtime"),
            new VcRuntimeVersion(Guid.Parse("{E2803110-78B3-4664-A479-3611A381656A}"), MscVersion.VisualStudio2015, ArchitectureType.x86, "14.0.24215.1"),
            new VcRuntimeVersion(Guid.Parse("{D992C12E-CAB2-426F-BDE3-FB8C53950B0D}"), MscVersion.VisualStudio2015, ArchitectureType.x64, "14.0.24215.1"),
            
            // MSVC++ 14.1 _MSC_VER >= 1910 (Visual Studio 2017)
            new VcRuntimeVersion(Guid.Parse("{7d9c81d7-a921-4503-8518-38fc0c94b692}"), MscVersion.VisualStudio2017, ArchitectureType.x86, "14.10.24629.0-rc1"),
            new VcRuntimeVersion(Guid.Parse("{c60f2e5a-912d-426c-a6b1-8a80bebab424}"), MscVersion.VisualStudio2017, ArchitectureType.x64, "14.10.24629.0-rc1"),
            new VcRuntimeVersion(Guid.Parse("{27B6EB53-CB9C-3461-B05D-EB5210EBA3D4}"), MscVersion.VisualStudio2017, ArchitectureType.x86, "14.10.24629 - Minimum runtime"),
            new VcRuntimeVersion(Guid.Parse("{C8086B63-C436-3F8B-8064-CE8F27815C5F}"), MscVersion.VisualStudio2017, ArchitectureType.x64, "14.10.24629 - Minimum runtime"),
            new VcRuntimeVersion(Guid.Parse("{44EC2AE5-F313-3E2A-8167-9923138ED5B4}"), MscVersion.VisualStudio2017, ArchitectureType.x86, "14.10.24629 - Additional runtime"),
            new VcRuntimeVersion(Guid.Parse("{ADC1B84A-D61D-3B2F-854A-8F872E51BB65}"), MscVersion.VisualStudio2017, ArchitectureType.x64, "14.10.24629 - Additional runtime"),
            new VcRuntimeVersion(Guid.Parse("{C64E9A20-DF31-4B11-ADA1-00909EB1B508}"), MscVersion.VisualStudio2017, ArchitectureType.x86, "14.10.24911-rc5"),
            new VcRuntimeVersion(Guid.Parse("{0A898FD4-A90B-46E2-8F20-46DDB3F24B6E}"), MscVersion.VisualStudio2017, ArchitectureType.x64, "14.10.24911-rc5"),
            new VcRuntimeVersion(Guid.Parse("{0C1C3F23-69C2-3D3D-9865-F8B6215289CD}"), MscVersion.VisualStudio2017, ArchitectureType.x86, "14.10.24911-rc5 - Minimum runtime"),
            new VcRuntimeVersion(Guid.Parse("{F0793C5B-0227-3294-91DE-0385602C6CBC}"), MscVersion.VisualStudio2017, ArchitectureType.x64, "14.10.24911-rc5 - Minimum runtime"),
            new VcRuntimeVersion(Guid.Parse("{568BE2F1-A2B2-3705-BF3E-8E6197382A46}"), MscVersion.VisualStudio2017, ArchitectureType.x86, "14.10.24911-rc5 - Additional runtime"),
            new VcRuntimeVersion(Guid.Parse("{E9A123F9-306E-3A29-88B9-5CD521D9109D}"), MscVersion.VisualStudio2017, ArchitectureType.x64, "14.10.24911-rc5 - Additional runtime"),
            new VcRuntimeVersion(Guid.Parse("{3E053C90-8E3B-4A1B-AB2E-AFB57D20F4B0}"), MscVersion.VisualStudio2017, ArchitectureType.x86, "14.10.24930-rc6"),
            new VcRuntimeVersion(Guid.Parse("{20B93B94-495D-4022-A84F-F598998991BF}"), MscVersion.VisualStudio2017, ArchitectureType.x64, "14.10.24930-rc6"),
            new VcRuntimeVersion(Guid.Parse("{984D10BE-0781-3A9D-80FB-03540E0C3B42}"), MscVersion.VisualStudio2017, ArchitectureType.x86, "14.10.24930-rc6 - Minimum runtime"),
            new VcRuntimeVersion(Guid.Parse("{9F50D497-02C0-3BBB-9103-BFE6204FA318}"), MscVersion.VisualStudio2017, ArchitectureType.x64, "14.10.24930-rc6 - Minimum runtime"),
            new VcRuntimeVersion(Guid.Parse("{9AAEB713-D24D-37A4-8FBC-7A24739D3156}"), MscVersion.VisualStudio2017, ArchitectureType.x86, "14.10.24930-rc6 - Additional runtime"),
            new VcRuntimeVersion(Guid.Parse("{A8755EE8-AD62-37FE-B106-243DC209CF52}"), MscVersion.VisualStudio2017, ArchitectureType.x64, "14.10.24930-rc6 - Additional runtime"),
            new VcRuntimeVersion(Guid.Parse("{C239CEA1-D49E-4E16-8E87-8C055765F7EC}"), MscVersion.VisualStudio2017, ArchitectureType.x86, "14.10.25008-rtm"),
            new VcRuntimeVersion(Guid.Parse("{F1E7E313-06DF-4C56-96A9-99FDFD149C51}"), MscVersion.VisualStudio2017, ArchitectureType.x64, "14.10.25008-rtm"),
            new VcRuntimeVersion(Guid.Parse("{C6CDA568-CD91-3CA0-9EDE-DAD98A13D6E1}"), MscVersion.VisualStudio2017, ArchitectureType.x86, "14.10.25008-rtm - Minimum runtime"),
            new VcRuntimeVersion(Guid.Parse("{8D50D8C6-1E3D-3BAB-B2B7-A5399EA1EBD1}"), MscVersion.VisualStudio2017, ArchitectureType.x64, "14.10.25008-rtm - Minimum runtime"),
            new VcRuntimeVersion(Guid.Parse("{2F8A908C-0CCD-3BDD-9212-DC6696525139}"), MscVersion.VisualStudio2017, ArchitectureType.x86, "14.10.25008-rtm - Debug runtime"),
            new VcRuntimeVersion(Guid.Parse("{B0763AF1-2B66-33B7-B6AF-78E123AEA826}"), MscVersion.VisualStudio2017, ArchitectureType.x64, "14.10.25008-rtm - Debug runtime"),
            new VcRuntimeVersion(Guid.Parse("{E6222D59-608C-3018-B86B-69BD241ACDE5}"), MscVersion.VisualStudio2017, ArchitectureType.x86, "14.10.25008-rtm - Additional runtime"),
            new VcRuntimeVersion(Guid.Parse("{C668F044-4825-330D-8F9F-3CBFC9F2AB89}"), MscVersion.VisualStudio2017, ArchitectureType.x64, "14.10.25008-rtm - Additional runtime"),
            new VcRuntimeVersion(Guid.Parse("{404c9c27-8377-4fd1-b607-7ca635db4e49}"), MscVersion.VisualStudio2017, ArchitectureType.x86, "14.11.25325"),
            new VcRuntimeVersion(Guid.Parse("{6c6356fe-cbfa-4944-9bed-a9e99f45cb7a}"), MscVersion.VisualStudio2017, ArchitectureType.x64, "14.11.25325"),
            new VcRuntimeVersion(Guid.Parse("{029DA848-1A80-34D3-BFC1-A6447BFC8E7F}"), MscVersion.VisualStudio2017, ArchitectureType.x86, "14.11.25325 - Minimum runtime"),
            new VcRuntimeVersion(Guid.Parse("{B0037450-526D-3448-A370-CACBD87769A0}"), MscVersion.VisualStudio2017, ArchitectureType.x64, "14.11.25325 - Minimum runtime"),
            new VcRuntimeVersion(Guid.Parse("{568CD07E-0824-3EEB-AEC1-8FD51F3C85CF}"), MscVersion.VisualStudio2017, ArchitectureType.x86, "14.11.25325 - Additional runtime"),
            new VcRuntimeVersion(Guid.Parse("{B13B3E11-1555-353F-A63A-8933EE104FBD}"), MscVersion.VisualStudio2017, ArchitectureType.x64, "14.11.25325 - Additional runtime"),
            new VcRuntimeVersion(Guid.Parse("{e2ee15e2-a480-4bc5-bfb7-e9803d1d9823}"), MscVersion.VisualStudio2017, ArchitectureType.x64, "14.12.25810"),
            new VcRuntimeVersion(Guid.Parse("{56e11d69-7cc9-40a5-a4f9-8f6190c4d84d}"), MscVersion.VisualStudio2017, ArchitectureType.x86, "14.12.25810"),
            new VcRuntimeVersion(Guid.Parse("{2CD849A7-86A1-34A6-B8F9-D72F5B21A9AE}"), MscVersion.VisualStudio2017, ArchitectureType.x64, "14.12.25810 - Additional Runtime"),
            new VcRuntimeVersion(Guid.Parse("{7FED75A1-600C-394B-8376-712E2A8861F2}"), MscVersion.VisualStudio2017, ArchitectureType.x86, "14.12.25810 - Additional Runtime"),
            new VcRuntimeVersion(Guid.Parse("{C99E2ADC-0347-336E-A603-F1992B09D582}"), MscVersion.VisualStudio2017, ArchitectureType.x64, "14.12.25810 - Minimum runtime"),
            new VcRuntimeVersion(Guid.Parse("{828952EB-5572-3666-8CA9-000B6CE79350}"), MscVersion.VisualStudio2017, ArchitectureType.x86, "14.12.25810 - Minimum runtime"),
        };
    }
}
{% endraw %}
{% endhighlight %}




### Appendix

The information used to build the code for this post is reprinted below in tabular format, for reader convenience.

### Visual Studio 2005 (`MSVC++ 8.0`)

{:.vcruntime}
| Product Guid                           | Architecture | Major Release      | Version            | Notes |
| -------------------------------------- | ------------ | ------------------ | ------------------ | ----- |
| {a49f249f-0c91-497f-86df-b2585e8e76b7} | x86          | Visual Studio 2005 |                    |  |
| {6e8e85e8-ce4b-4ff5-91f7-04999c9fae6a} | x64          | Visual Studio 2005 |                    |  |
| {03ed71ea-f531-4927-aabd-1c31bce8e187} | IA64         | Visual Studio 2005 |                    |  |
| {c1c4f017-81cc-94c4-c8fb-1542c0981a2a} | x86          | Visual Studio 2005 | 6.0.2900.2180      |  |
| {1af2a8da-7e60-d0b4-29d7-e6453b3d0182} | x64          | Visual Studio 2005 | 6.0.2900.2180      |  |
| {7299052b-02a4-4627-81f2-1818da5d550d} | x86          | Visual Studio 2005 | SP1                |  |
| {071c9b48-7c32-4621-a0ac-3f809523288f} | x64          | Visual Studio 2005 | SP1                |  |
| {0f8fb34e-675e-42ed-850b-29d98c2ece08} | IA64         | Visual Studio 2005 | SP1                |  |
| {837b34e3-7c30-493c-8f6a-2b0f04e2912c} | x86          | Visual Studio 2005 | SP1_ATL_SEC_UPD    |  |
| {6ce5bae9-d3ca-4b99-891a-1dc6c118a5fc} | x64          | Visual Studio 2005 | SP1_ATL_SEC_UPD    |  |
| {85025851-a784-46d8-950d-05cb3ca43a13} | IA64         | Visual Studio 2005 | SP1_ATL_SEC_UPD    |  |

### Visual Studio 2008 (`MSVC++ 9.0`)

{:.vcruntime}
| Product Guid                           | Architecture | Major Release      | Version            | Notes |
| -------------------------------------- | ------------ | ------------------ | ------------------ | ----- |
| {ff66e9f6-83e7-3a3e-af14-8de9a809a6a4} | x86          | Visual Studio 2008 |                    |  |
| {350aa351-21fa-3270-8b7a-835434e766ad} | x64          | Visual Studio 2008 |                    |  |
| {2b547b43-db50-3139-9ebe-37d419e0f5fa} | IA64         | Visual Studio 2008 |                    |  |
| {6e815eb9-6cce-9a53-884e-7857c57002f0} | x86          | Visual Studio 2008 | 9.0.30729.5677     |  |
| {67d6ecf5-cd5f-ba73-2b8b-22bac8de1b4d} | x64          | Visual Studio 2008 | 9.0.30729.5677     |  |
| {9a25302d-30c0-39d9-bd6f-21e6ec160475} | x86          | Visual Studio 2008 | 9.0.30729.6161     | SP1 |
| {8220eefe-38cd-377e-8595-13398d740ace} | x64          | Visual Studio 2008 | 9.0.30729.6161     | SP1 |
| {5827ece1-aeb0-328e-b813-6fc68622c1f9} | IA64         | Visual Studio 2008 | 9.0.30729.6161     | SP1 |
| {1f1c2dfc-2d24-3e06-bcb8-725134adf989} | x86          | Visual Studio 2008 | 9.0.30729.6161     | SP1_ATL_SEC_UPD |
| {4b6c7001-c7d6-3710-913e-5bc23fce91e6} | x64          | Visual Studio 2008 | 9.0.30729.6161     | SP1_ATL_SEC_UPD |
| {977ad349-c2a8-39dd-9273-285c08987c7b} | IA64         | Visual Studio 2008 | 9.0.30729.6161     | SP1_ATL_SEC_UPD |
| {9be518e6-ecc6-35a9-88e4-87755c07200f} | x86          | Visual Studio 2008 | 9.0.30729.6161     | SP1_MFC_SEC_UPD |
| {5fce6d76-f5dc-37ab-b2b8-22ab8cedb1d4} | x64          | Visual Studio 2008 | 9.0.30729.6161     | SP1_MFC_SEC_UPD |
| {515643d1-4e9e-342f-a75a-d1f16448dc04} | IA64         | Visual Studio 2008 | 9.0.30729.6161     | SP1_MFC_SEC_UPD |

### Visual Studio 2010 (`MSVC++ 10.0`)

{:.vcruntime}
| Product Guid                           | Architecture | Major Release      | Version            | Notes |
| -------------------------------------- | ------------ | ------------------ | ------------------ | ----- |
| {196bb40d-1578-3d01-b289-befc77a11a1e} | x86          | Visual Studio 2010 |                    |  |
| {da5e371c-6333-3d8a-93a4-6fd5b20bcc6e} | x64          | Visual Studio 2010 |                    |  |
| {c1a35166-4301-38e9-ba67-02823ad72a1b} | IA64         | Visual Studio 2010 |                    |  |
| {f0c3e5d1-1ade-321e-8167-68ef0de699a5} | x86          | Visual Studio 2010 | 10.0.40219         | SP1 |
| {1d8e6291-b0d5-35ec-8441-6616f567a0f7} | x64          | Visual Studio 2010 | 10.0.40219         | SP1 |
| {88c73c1c-2de5-3b01-afb8-b46ef4ab41cd} | IA64         | Visual Studio 2010 | 10.0.40219         | SP1 |
| {1d5e3c0f-eda1-e123-1876-86fed06e995a} | x86          | Visual Studio 2010 | 10.0.40219.325     |  |
| {1926e8d1-5d0b-ce53-4814-66615f760a7f} | x64          | Visual Studio 2010 | 10.0.40219.325     |  |

### Visual Studio 2012 (`MSVC++ 11.0`)

{:.vcruntime}
| Product Guid                           | Architecture | Major Release      | Version            | Notes |
| -------------------------------------- | ------------ | ------------------ | ------------------ | ----- |
| {33d1fd90-4274-48a1-9bc1-97e33d9c2d6f} | x86          | Visual Studio 2012 | 11.0.61030.0       |  |
| {ca67548a-5ebe-413a-b50c-4b9ceb6d66c6} | x64          | Visual Studio 2012 | 11.0.61030.0       |  |
| {bd95a8cd-1d9f-35ad-981a-3e7925026ebb} | x86          | Visual Studio 2012 | 11.0.61030.0       | Minimum runtime (Update 4) |
| {cf2bea3c-26ea-32f8-aa9b-331f7e34ba97} | x64          | Visual Studio 2012 | 11.0.61030.0       | Minimum runtime (Update 4) |
| {b175520c-86a2-35a7-8619-86dc379688b9} | x86          | Visual Studio 2012 | 11.0.61030.0       | Additional runtime (Update 4) |
| {37b8f9c7-03fb-3253-8781-2517c99d7c00} | x64          | Visual Studio 2012 | 11.0.61030.0       | Additional runtime (Update 4) |

### Visual Studio 2013 (`MSVC++ 12.0`)

{:.vcruntime}
| Product Guid                           | Architecture | Major Release      | Version            | Notes |
| -------------------------------------- | ------------ | ------------------ | ------------------ | ----- |
| {f65db027-aff3-4070-886a-0d87064aabb1} | x86          | Visual Studio 2013 | 12.0.30501         |  |
| {050d4fc8-5d48-4b8f-8972-47c82c46020f} | x64          | Visual Studio 2013 | 12.0.30501         |  |
| {13a4ee12-23ea-3371-91ee-efb36ddfff3e} | x86          | Visual Studio 2013 | 12.0.30501         | Minimum runtime |
| {a749d8e6-b613-3be3-8f5f-045c84eba29b} | x64          | Visual Studio 2013 | 12.0.30501         | Minimum runtime |
| {f8cfeb22-a2e7-3971-9eda-4b11edefc185} | x86          | Visual Studio 2013 | 12.0.30501         | Additional runtime |
| {929fbd26-9020-399b-9a7a-751d61f0b942} | x64          | Visual Studio 2013 | 12.0.30501         | Additional runtime |

### Visual Studio 2015 (`MSVC++ 14.0`)

{:.vcruntime}
| Product Guid                           | Architecture | Major Release      | Version            | Notes |
| -------------------------------------- | ------------ | ------------------ | ------------------ | ----- |
| {74d0e5db-b326-4dae-a6b2-445b9de1836e} | x86          | Visual Studio 2015 | 14.0.23026         |  |
| {e46eca4f-393b-40df-9f49-076faf788d83} | x64          | Visual Studio 2015 | 14.0.23026         |  |
| {a2563e55-3bec-3828-8d67-e5e8b9e8b675} | x86          | Visual Studio 2015 | 14.0.23026         | Minimum runtime |
| {0d3e9e15-de7a-300b-96f1-b4af12b96488} | x64          | Visual Studio 2015 | 14.0.23026         | Minimum runtime |
| {be960c1c-7bad-3de6-8b1a-2616fe532845} | x86          | Visual Studio 2015 | 14.0.23026         | Additional runtime |
| {bc958bd2-5dac-3862-bb1a-c1be0790438d} | x64          | Visual Studio 2015 | 14.0.23026         | Additional runtime |
| {2e085fd2-a3e4-4b39-8e10-6b8d35f55244} | x86          | Visual Studio 2015 | 14.0.23918.0       |  |
| {dab68466-3a7d-41a8-a5cf-415e3ff8ef71} | x64          | Visual Studio 2015 | 14.0.23918.0       |  |
| {8fd71e98-ee44-3844-9dad-9cb0bbbc603c} | x86          | Visual Studio 2015 | 14.0.24210         |  |
| {c0b2c673-ecaa-372d-94e5-e89440d087ad} | x64          | Visual Studio 2015 | 14.0.24210         |  |
| {bbf2ac74-720c-3cb3-8291-5e34039232fa} | x86          | Visual Studio 2015 | 14.0.24215         | Minimum runtime |
| {50a2bc33-c9cd-3bf1-a8ff-53c10a0b183c} | x64          | Visual Studio 2015 | 14.0.24215         | Minimum runtime |
| {c956892e-d1f3-3781-935c-8d9060e7cd7e} | x86          | Visual Studio 2015 | 14.0.24215         | Debug runtime |
| {406cc721-9fad-3610-b44e-3130f84358d8} | x64          | Visual Studio 2015 | 14.0.24215         | Debug runtime |
| {69bce4ac-9572-3271-a2fb-9423bda36a43} | x86          | Visual Studio 2015 | 14.0.24215         | Additional runtime |
| {ef1ec6a9-17de-3da9-b040-686a1e8a8b04} | x64          | Visual Studio 2015 | 14.0.24215         | Additional runtime |
| {e2803110-78b3-4664-a479-3611a381656a} | x86          | Visual Studio 2015 | 14.0.24215.1       |  |
| {d992c12e-cab2-426f-bde3-fb8c53950b0d} | x64          | Visual Studio 2015 | 14.0.24215.1       |  |

### Visual Studio 2017 (`MSVC++ 14.1`)

{:.vcruntime}
| Product Guid                           | Architecture | Major Release      | Version            | Notes |
| -------------------------------------- | ------------ | ------------------ | ------------------ | ----- |
| {7d9c81d7-a921-4503-8518-38fc0c94b692} | x86          | Visual Studio 2017 | 14.10.24629.0-rc1  |  |
| {c60f2e5a-912d-426c-a6b1-8a80bebab424} | x64          | Visual Studio 2017 | 14.10.24629.0-rc1  |  |
| {27b6eb53-cb9c-3461-b05d-eb5210eba3d4} | x86          | Visual Studio 2017 | 14.10.24629        | Minimum runtime |
| {c8086b63-c436-3f8b-8064-ce8f27815c5f} | x64          | Visual Studio 2017 | 14.10.24629        | Minimum runtime |
| {44ec2ae5-f313-3e2a-8167-9923138ed5b4} | x86          | Visual Studio 2017 | 14.10.24629        | Additional runtime |
| {adc1b84a-d61d-3b2f-854a-8f872e51bb65} | x64          | Visual Studio 2017 | 14.10.24629        | Additional runtime |
| {c64e9a20-df31-4b11-ada1-00909eb1b508} | x86          | Visual Studio 2017 | 14.10.24911-rc5    |  |
| {0a898fd4-a90b-46e2-8f20-46ddb3f24b6e} | x64          | Visual Studio 2017 | 14.10.24911-rc5    |  |
| {0c1c3f23-69c2-3d3d-9865-f8b6215289cd} | x86          | Visual Studio 2017 | 14.10.24911-rc5    | Minimum runtime |
| {f0793c5b-0227-3294-91de-0385602c6cbc} | x64          | Visual Studio 2017 | 14.10.24911-rc5    | Minimum runtime |
| {568be2f1-a2b2-3705-bf3e-8e6197382a46} | x86          | Visual Studio 2017 | 14.10.24911-rc5    | Additional runtime |
| {e9a123f9-306e-3a29-88b9-5cd521d9109d} | x64          | Visual Studio 2017 | 14.10.24911-rc5    | Additional runtime |
| {3e053c90-8e3b-4a1b-ab2e-afb57d20f4b0} | x86          | Visual Studio 2017 | 14.10.24930-rc6    |  |
| {20b93b94-495d-4022-a84f-f598998991bf} | x64          | Visual Studio 2017 | 14.10.24930-rc6    |  |
| {984d10be-0781-3a9d-80fb-03540e0c3b42} | x86          | Visual Studio 2017 | 14.10.24930-rc6    | Minimum runtime |
| {9f50d497-02c0-3bbb-9103-bfe6204fa318} | x64          | Visual Studio 2017 | 14.10.24930-rc6    | Minimum runtime |
| {9aaeb713-d24d-37a4-8fbc-7a24739d3156} | x86          | Visual Studio 2017 | 14.10.24930-rc6    | Additional runtime |
| {a8755ee8-ad62-37fe-b106-243dc209cf52} | x64          | Visual Studio 2017 | 14.10.24930-rc6    | Additional runtime |
| {c239cea1-d49e-4e16-8e87-8c055765f7ec} | x86          | Visual Studio 2017 | 14.10.25008-rtm    |  |
| {f1e7e313-06df-4c56-96a9-99fdfd149c51} | x64          | Visual Studio 2017 | 14.10.25008-rtm    |  |
| {c6cda568-cd91-3ca0-9ede-dad98a13d6e1} | x86          | Visual Studio 2017 | 14.10.25008-rtm    | Minimum runtime |
| {8d50d8c6-1e3d-3bab-b2b7-a5399ea1ebd1} | x64          | Visual Studio 2017 | 14.10.25008-rtm    | Minimum runtime |
| {2f8a908c-0ccd-3bdd-9212-dc6696525139} | x86          | Visual Studio 2017 | 14.10.25008-rtm    | Debug runtime |
| {b0763af1-2b66-33b7-b6af-78e123aea826} | x64          | Visual Studio 2017 | 14.10.25008-rtm    | Debug runtime |
| {e6222d59-608c-3018-b86b-69bd241acde5} | x86          | Visual Studio 2017 | 14.10.25008-rtm    | Additional runtime |
| {c668f044-4825-330d-8f9f-3cbfc9f2ab89} | x64          | Visual Studio 2017 | 14.10.25008-rtm    | Additional runtime |
| {404c9c27-8377-4fd1-b607-7ca635db4e49} | x86          | Visual Studio 2017 | 14.11.25325        |  |
| {6c6356fe-cbfa-4944-9bed-a9e99f45cb7a} | x64          | Visual Studio 2017 | 14.11.25325        |  |
| {029da848-1a80-34d3-bfc1-a6447bfc8e7f} | x86          | Visual Studio 2017 | 14.11.25325        | Minimum runtime |
| {b0037450-526d-3448-a370-cacbd87769a0} | x64          | Visual Studio 2017 | 14.11.25325        | Minimum runtime |
| {568cd07e-0824-3eeb-aec1-8fd51f3c85cf} | x86          | Visual Studio 2017 | 14.11.25325        | Additional runtime |
| {b13b3e11-1555-353f-a63a-8933ee104fbd} | x64          | Visual Studio 2017 | 14.11.25325        | Additional runtime |
| {e2ee15e2-a480-4bc5-bfb7-e9803d1d9823} | x64          | Visual Studio 2017 | 14.12.25810        |  |
| {56e11d69-7cc9-40a5-a4f9-8f6190c4d84d} | x86          | Visual Studio 2017 | 14.12.25810        |  |
| {2cd849a7-86a1-34a6-b8f9-d72f5b21a9ae} | x64          | Visual Studio 2017 | 14.12.25810        | Additional Runtime |
| {7fed75a1-600c-394b-8376-712e2a8861f2} | x86          | Visual Studio 2017 | 14.12.25810        | Additional Runtime |
| {c99e2adc-0347-336e-a603-f1992b09d582} | x64          | Visual Studio 2017 | 14.12.25810        | Minimum runtime |
| {828952eb-5572-3666-8ca9-000b6ce79350} | x86          | Visual Studio 2017 | 14.12.25810        | Minimum runtime |



