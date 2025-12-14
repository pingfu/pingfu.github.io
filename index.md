---
layout: page
title: Home
breadcrumb: Welcome
redirect_from: "/writing/"
css_class_name: index
---

# Hi, I'm Marc

A network, infrastructure and security engineer based in Wales.

<div class="row assets">
    <div class="col-md-6">
        <div class="asset-card">
            <span class="asset-type">Tool</span>
            <h3><i class="fa fa-youtube-play"></i> <a href="/tools/youtube">Embedded YouTube Player</a></h3>
            <p>A simple embedded player for YouTube videos. Paste a video ID or URL and keep track of what you've watched.</p>
        </div>
    </div>
    <div class="col-md-6">
        <div class="asset-card">
            <span class="asset-type">Tool</span>
            <h3><i class="fa fa-globe"></i> <a href="/tools/dns">DNS toolbox</a></h3>
            <p>A visual DNS toolbox supporting common query types such as <code>A</code>, <code>NS</code>, <code>CNAME</code>, <code>SOA</code>, <code>PTR</code>, <code>MX</code>, <code>TXT</code>, <code>RP</code>, <code>AXFR</code>, <code>AAAA</code>, <code>ANY</code> and <code>IPv6</code>.</p>
        </div>
    </div>
    <div class="col-md-6">
        <div class="asset-card">
            <span class="asset-type">Tool</span>
            <h3><i class="fa fa-key"></i> <a href="/tools/generate-passwords">Password generator</a></h3>
            <p>A convenient way to quickly generate sets of complex passwords. Each page load generates a pseudo-random set of passwords with varying length and character compositions.</p>
        </div>
    </div>
    <div class="col-md-6">
        <div class="asset-card">
            <span class="asset-type">Reference</span>
            <h3><i class="fa fa-book"></i> <a href="/reference/ethernet-ip-tcp-udp-icmp-protocol-header-cheatsheets">Protocol header cheatsheets</a></h3>
            <p>A set of cheatsheets and diagrams for better understanding protocol headers and the sizes of Ethernet frames, IP packets, UDP datagrams, TCP packets and ICMP messages.</p>
        </div>
    </div>
</div>


## Posts

<div class="posts">
    <ul>
    {% for post in site.posts %}
        <li>
            <span>{{ post.date | date_to_string }}</span>
            <a href="{{ post.url }}">{{ post.title }}</a>
        </li>
    {% endfor %}
    </ul>
</div>