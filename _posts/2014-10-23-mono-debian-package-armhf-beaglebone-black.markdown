---
layout: post
title: "Debian package for Mono on Beaglebone Black (ARMhf)"
date: 2014-10-23
categories: Programming Troubleshooting Hardware
tags: beagleboard mono armhf
---

I was frustrated to discover that Mono could not be installed using the standard packages sources on either Ubuntu or Debian using the Beaglebone Black, as it seems the only packages which exist are targeting ARMel architecture, rather than ARMhf (hard-float) of the BBB.

```bash
$ sudo apt-get install mono-runtime
Reading package lists... Done
Building dependency tree
Reading state information... Done
Some packages could not be installed. This may mean that you have requested an impossible situation or if you are using the unstable distribution that some required packages have not yet been created or been moved out of Incoming. 
The following information may help to resolve the situation:

The following packages have unmet dependencies:
 mono-runtime:armel : Depends: mono-gac:armel (= 2.10.8.1-8) but it is not installable
                      Recommends: binfmt-support:armel (>= 1.1.2)
E: Unable to correct problems, you have held broken packages.
```

Compiling from source seemed to be the only option. I started by downloading specific [releases][monorls] but the build failed each time I tried (versions 3.10.0, 3.8.0 and 3.6.0). It seems unless you have the `mono-devel` package already installed on your system, the tarballs are missing dependencies for a full build (see [compiling mono on linux][complnx]).

The next option was to clone the relevant git branch and try again. Currently the `3.10.0-branch` branch of Mono [isn't building](https://github.com/mono/mono/tree/mono-3.10.0-branch), so until that is fixed, I've used `3.8.0-branch`. Cloning the branch also isn't enough to pull all of the dependencies for a full compile, but using `git submodule` fixes this. The full source tree requires a little over 2GB of space in order to build, and compiling takes several hours on the BBB.

```bash
$ apt-get install git autoconf libtool automake build-essential gettext
$ cd /usr/src
$ git clone git://github.com/mono/mono.git
$ cd mono
$ git checkout mono-3.8.0-branch
$ git submodule init
$ git submodule update --recursive
$ git submodule
```

```bash
$ ./autogen.sh --prefix=/usr/local --with-sgen=yes --with-large-heap=yes --with-xen_opt=no --enable-parallel-mark --with-libgdiplus=/usr/local/lib
$ make get-monolite-latest
$ make EXTERNAL_MCS="${PWD}/mcs/class/lib/monolite/gmcs.exe"
$ make
$ sudo make install 
```

If the installation completed sucessfully running `mono --version` should produce something like this. Notice the most recent [commit][commit] that I've built against.

```bash
$ mono --version
Mono JIT compiler version 3.8.0 (mono-3.8.0-branch/e451fb2 Wed Oct 22 16:25:10 UTC 2014)
Copyright (C) 2002-2014 Novell, Inc, Xamarin Inc and Contributors. www.mono-project.com
        TLS:           __thread
        SIGSEGV:       normal
        Notifications: epoll
        Architecture:  armel,vfp+hard
        Disabled:      none
        Misc:          softdebug
        LLVM:          supported, not enabled.
        GC:            sgen
```

I didn't fancy running through this process each time I needed Mono on a fresh BBB so used `checkinstall`, which hooks the `make install` process to produce a .deb package which can be installed onto ARMhf systems with `dkpg -i`

To do this yourself pull the dependencies for `checkinstall`, and run it between `make` and `make install`.

```bash
$ sudo apt-get install build-essential automake autoconf libtool pkg-config libcurl4-openssl-dev intltool libxml2-dev libgtk2.0-dev libnotify-dev libglib2.0-dev libevent-dev checkinstall
$ sudo checkinstall
```

Hopefully following these steps will help anybody else get up and running with Mono until the main package sources contain ARMhf packages, but YMMV so the .deb package I built is available here:

* [mono-3.8.0-branch-armhf-e451fb2.deb][e451fb2] (90.9MB) [md5sum: 752e0b1494d250516e8143924c7a5a4c]

[e451fb2]: https://s3-eu-west-1.amazonaws.com/westgatecyber/mono-3.8.0-branch-armhf-e451fb2.deb
[monorls]: https://github.com/mono/mono/releases
[complnx]: http://www.mono-project.com/docs/compiling-mono/linux/
[commit]: https://github.com/mono/mono/commit/e451fb2813e67d6f9d56424775444d0e5acca19f