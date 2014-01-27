---
layout: post
title: "Convert bytes to KB, MB, GB, TB or higher using c#"
date: 2013-04-12
categories: Programming
tags: c#
---

I’m a great believer in making the most of what you’ve got in terms of CPU and compute performance, and in a strange way quite enjoy reading highly optimised code.

Shailesh from [http://www.somacon.com][somacon] has done an excellent job in optimising a method to convert bytes in to a human friendly file size string.

I’ve made some modifications to reduce the character count, the guts are pretty much intact. So here is my (amended) method to format bytes into KB, MB, GB etc.

```csharp
/// <summary>
/// Returns a human-readable size discriptor for up 64-bit length fields
/// </summary>
/// <param name="bytes"></param>
/// <returns></returns>
private static string FormatBytes(Int64 bytes)
{
	if (bytes >= 0x1000000000000000) { return ((double)(bytes >> 50) / 1024).ToString("0.### EB"); }
	if (bytes >= 0x4000000000000) { return ((double)(bytes >> 40) / 1024).ToString("0.### PB"); }
	if (bytes >= 0x10000000000) { return ((double)(bytes >> 30) / 1024).ToString("0.### TB"); }
	if (bytes >= 0x40000000) { return ((double)(bytes >> 20) / 1024).ToString("0.### GB"); }
	if (bytes >= 0x100000) { return ((double)(bytes >> 10) / 1024).ToString("0.### MB"); }
	if (bytes >= 0x400) { return ((double)(bytes) / 1024).ToString("0.###") + " KB"; }
	return bytes.ToString("0 Bytes");
}
```
Here is the [original snippet][original] Shailesh posted.

[somacon]: http://www.somacon.com/
[original]: http://www.somacon.com/p576.php