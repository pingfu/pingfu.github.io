# Code

A collection of small scripts and side projects.

* ## [CGMSharp](https://github.com/pingfu/cgmsharp)
  A Node.js client for the LibreLinkUp API that fetches CGM data from Abbott's FreeStyle Libre. Will explode your phone via Pushover, when a loved one runs too sweet or too sour - for too long. Stores long-term readings in InfluxDB.

* ## [HTU21 Temperature & Humidity Sensor](https://github.com/marcbarry/htu21)
  A lightweight HTTP service for Raspberry Pi that exposes temperature and humidity readings from an HTU21/SHT21 sensor over I²C. Returns JSON via a simple web API on port 273. Runs as a systemd service.

* ## [Multicast Testing Tool](https://github.com/enclave-networks/multicast-test)
  Testing multicast traffic can be challenging and tends to involve running an application on two systems, physical or virtual connected to the network. iPerf can be complicated, and VLC multicast streaming can be buggy. This is a simpler command-line tool that runs on both Linux and Windows to help validate multicast connectivity.

* ## [![Build Status](https://ci.appveyor.com/api/projects/status/github/Pingfu/arpscan?branch=master&svg=true)](https://ci.appveyor.com/project/Pingfu/arpscan) [ArpScan](https://github.com/pingfu/arpscan)
 Enumerates local adapters and makes an ARP request to each address in the subnet. For when your laptop is on the other side of the room and you want to know its ip address.

* ## [![Build Status](https://ci.appveyor.com/api/projects/status/github/Pingfu/r53export?branch=master&svg=true)](https://ci.appveyor.com/project/Pingfu/r53export) [Amazon Route53 data export](https://github.com/pingfu/r53export/)
  A simple command-line tool to easily export zone information from Route53. Periodically snapshot, or backup data from <strong>all</strong> hosted zones.

* ## [![Build Status](https://ci.appveyor.com/api/projects/status/github/Pingfu/blockchainsharp?branch=master&svg=true)](https://ci.appveyor.com/project/Pingfu/blockchainsharp) [Bitcoin block chain parser](https://github.com/pingfu/blockchainsharp)
 A pure C# block chain parser library for Bitcoin. Eats binary blkxxxx.dat files and produces an IEnumerable strongly typed in-memory representation.
