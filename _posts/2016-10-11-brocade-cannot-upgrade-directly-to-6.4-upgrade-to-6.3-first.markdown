---
layout: post
title: "Brocade - Cannot upgrade directly to 6.4. Please upgrade to 6.3 first and then upgrade to 6.4."
date: 2016-10-11
categories: Infrastructure
tags: fibre storage
---

Brocade fiber channel switches are extremely robust over long periods of time, delivering solid performance with excellent mean time between failure (MTBF) ratings, but periodically require firmware upgrades. Unfortunatley finding the latest firmware versions from the HPE website can be less than straight forward, as I discovered recently when upgrading some B-Series SAN (8/12c) switches running an old version (`v6.1.0_8e1`) of the firmware, which proved to be quite time consuming...

<!--excerpt-->

The Brocade fibre channel switch allows non-disruptive upgrades, meaning it is possible to upgrade the firmware with a High Availability (HA) reboot so as the switch reloads, the fibre channel ports stay online, and only management connections to the switch are lost for the duration of the reboot.

*Note:* Non-disruptive upgrades are only possible when moving from a single major version of the firmware to the next, or if you're upgrading within a single major version. In my case the latest version of the firmware available at the time of writing was `v7.4.1d1`. After sifting through the 119 available versions firmware posted to the [HPE website][hpe-firmware], the upgrade path from `v6.1.0_8e1` to `v7.4.1d` looked like this;

* `6.1.0_8e1`
* `v6.2.2f9`
* `v6.3.0d`
* `v6.4.3h`
* `v7.0.2e`
* `v7.1.2b1`
* `v7.2.1g`
* `v7.3.2b`
* `v7.4.1d`

That's seven disruptive firmware upgrades which take the switch out of action and cause the FC ports to stop functioning during the reboot for each upgrade. I won't cover the upgrade process as there is an excellent post [here][workinghardinit] written by Didier Van Hoye about how to perform firmware upgrades on these switches.

After starting to upgrade from one version to the next, I became stuck trying to move forwards from `v6.2.2f9`. The HPE website doesn't list any 6.3x versions of the firmware, and the switch prevented me from skipping version 6.3 and moving directly on to version 6.4 with this message:

* "Cannot upgrade directly to 6.4. Please upgrade to 6.3 first and then upgrade to 6.4."

It took some searching to discover that version 6.3 of the firmware is no longer supported by HPE, so there is no normal download link to it (as per this [community post][hpe-community]). HP do however still offer the missing firmware via their public FTP server, it just isn't linked from the website.

* `v6.3.0d` - [ftp://ftp.hp.com/pub/softlib/software11/COL22074/co-81903-1/v6.3.0d.zip][v6.3.0d]

In case v6.3.0d disappears from the HP servers I've mirrored it to S3 storage for safe keeping. The mirrored file [v6.3.0d.zip][s3-63-firmware] is 1.22 GB (1,228,374,895 bytes) with an MD5 checksum of `256DDCF0A6D6D8F92A179EFF31DC1EE4`.

Frustratingly the HPE website doesn't appear to have any kind of coherent order presenting the firmware upgrade version options, so it can take a few minutes to find the latest version of each major release. To save time I've listed below direct download links to each firmware that I used during the upgrade.

* `v6.2.2f9` - [http://downloads.hpe.com/pub/softlib/software12/COL22074/co-138585-1/v6.2.2f9.zip][v6.2.2f9]
* `v6.3.0d` - [ftp://ftp.hp.com/pub/softlib/software11/COL22074/co-81903-1/v6.3.0d.zip][v6.3.0d]
* `v6.4.3h` - [http://downloads.hpe.com/pub/softlib/software13/COL22074/co-155018-1/v6.4.3h.zip][v6.4.3h]
* `v7.0.2e` - [http://downloads.hpe.com/pub/softlib/software12/COL38684/co-133135-1/v7.0.2e.zip][v7.0.2e]
* `v7.1.2b1` - [http://downloads.hpe.com/pub/softlib/software12/COL38684/co-138558-1/v7.1.2b1.zip][v7.1.2b1]
* `v7.2.1g` - [http://downloads.hpe.com/pub/softlib/software13/COL59674/co-157071-1/v7.2.1g.zip][v7.2.1g]
* `v7.3.2b` - [http://downloads.hpe.com/pub/softlib/software13/COL59674/co-174109-2/v7.3.2b.zip][v7.3.2b]
* `v7.4.1d` - [http://downloads.hpe.com/pub/softlib/software13/COL59674/co-171426-1/v7.4.1d.zip][v7.4.1d]





[hpe-firmware]: http://h20566.www2.hpe.com/hpsc/swd/public/readIndex?sp4ts.oid=5332779&swLangOid=8&swEnvOid=54
[workinghardinit]: https://blog.workinghardinit.work/2015/12/15/upgrade-the-firmware-on-a-brocade-fibre-channel-switch/
[hpe-community]: https://community.hpe.com/t5/Storage-Area-Networks-SAN-Small/B-Series-8-8-AM866A-No-Firmware-6-3x-available/td-p/6755407
[s3-63-firmware]: https://s3-eu-west-1.amazonaws.com/pingfu/firmware/brocade/b-series/v6.3.0d.zip
[v6.2.2f9]: http://downloads.hpe.com/pub/softlib/software12/COL22074/co-138585-1/v6.2.2f9.zip
[v6.3.0d]: ftp://ftp.hp.com/pub/softlib/software11/COL22074/co-81903-1/v6.3.0d.zip
[v6.4.3h]: http://downloads.hpe.com/pub/softlib/software13/COL22074/co-155018-1/v6.4.3h.zip
[v7.0.2e]: http://downloads.hpe.com/pub/softlib/software12/COL38684/co-133135-1/v7.0.2e.zip
[v7.1.2b1]: http://downloads.hpe.com/pub/softlib/software12/COL38684/co-138558-1/v7.1.2b1.zip
[v7.2.1g]: http://downloads.hpe.com/pub/softlib/software13/COL59674/co-157071-1/v7.2.1g.zip
[v7.3.2b]: http://downloads.hpe.com/pub/softlib/software13/COL59674/co-174109-2/v7.3.2b.zip
[v7.4.1d]: http://downloads.hpe.com/pub/softlib/software13/COL59674/co-171426-1/v7.4.1d.zip



