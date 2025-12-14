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
        <div class="asset-card" onclick="location.href='/tools/youtube'">
            <h3><i class="fa fa-youtube-play"></i> <a href="/tools/youtube">Embedded YouTube Player</a></h3>
            <p>Watch YouTube videos with a local watch history.</p>
        </div>
    </div>
    <div class="col-md-6">
        <div class="asset-card" onclick="location.href='/tools/dns'">
            <h3><i class="fa fa-globe"></i> <a href="/tools/dns">DNS toolbox</a></h3>
            <p>Query DNS records including <code>A</code>, <code>AAAA</code>, <code>MX</code>, <code>TXT</code>, <code>NS</code> and more.</p>
        </div>
    </div>
    <div class="col-md-6">
        <div class="asset-card" onclick="location.href='/tools/generate-passwords'">
            <h3><i class="fa fa-key"></i> <a href="/tools/generate-passwords">Password generator</a></h3>
            <p>Generate secure passwords with varying lengths and complexity.</p>
        </div>
    </div>
    <div class="col-md-6">
        <div class="asset-card" onclick="location.href='/reference/ethernet-ip-tcp-udp-icmp-protocol-header-cheatsheets'">
            <h3><i class="fa fa-book"></i> <a href="/reference/ethernet-ip-tcp-udp-icmp-protocol-header-cheatsheets">Protocol header cheatsheets</a></h3>
            <p>Quick reference for Ethernet, IP, TCP, UDP and ICMP headers.</p>
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