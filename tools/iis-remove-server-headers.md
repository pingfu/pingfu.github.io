---
layout: page
title: IIS Remove Server Headers
css_class_name: iis-server-headers
---

# IIS Remove Server Headers

## Summary

A managed module for IIS which removes the following unwanted HTTP headers from the server response.

```
* Server
* X-Powered-By
* X-AspNet-Version
* X-AspNetMvc-Version
```

Install to the GAC and reference in IIS to remove unwanted http headers.

## Download

Either compile from source, or follow the links on [GitHub](https://github.com/pingfu/iis-remove-server-headers) to download pre-compiled binaries.

## Installation to the GAC

Deploy the library to the Global Assembly Cache (GAC) using gacutil.exe. Once the library is installed to the GAC, other copies can be removed from the server.

```
gacutil.exe /i Pingfu.RemoveServerHeaderModule.dll
```

## Configure IIS to use the module

1. Open the <strong>Internet Information Services (IIS) Manager</strong> snap-in.
2. Open the <strong>Modules</strong> administration feature at the server level.
3. Select <strong>Add Managed Module...</strong>
    1. For Name enter a descriptive name, for example "Pingfu.RemoveServerHeaderModule"
    2. For Type select the module from the list.

# Licence

```
The MIT License (MIT)

Copyright (c) Pingfu

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```