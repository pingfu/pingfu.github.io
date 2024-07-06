---
layout: page
title: Home
breadcrumb: Welcome
redirect_from: "/writing/"
css_class_name: index
---

# Hi, I'm Marc

A dotnet, infrastructure and security specialist based in Wales.

<div class="row">
    <div class="col-md-6">
        <h2>Tools</h2>
        <div class="assets">
            <ul>
                <li>
                    <h3><a href="/tools/youtube">Embedded YouTube Player</a></h3>
                    <p>YouTube ads aren't played on embedded videos, so copy the YouTube Video ID and play it here.</p>
                </li>
                <li>
                    <h3><a href="/tools/dns">DNS toolbox</a></h3>
                    <p>A visual DNS toolbox supporting common query types such as <code>A</code>, <code>NS</code>, <code>CNAME</code>, <code>SOA</code>, <code>PTR</code>, <code>MX</code>, <code>TXT</code>, <code>RP</code>, <code>AXFR</code>, <code>AAAA</code>, <code>ANY</code> and <code>IPv6</code>.</p>
                </li>
                <li>
                    <h3><a href="/tools/generate-passwords">Password generator</a></h3>
                    <p>A convenient way to quickly generate sets of complex passwords. Each page load generates a pseudo-random set of passwords with varying length and character compositions.</p>
                </li>
            </ul>
        </div>
    </div>
    <div class="col-md-6">
        <h2>Reference</h2>
        <div class="assets">
            <ul>
                <li>
                    <h3><a href="/reference/ethernet-ip-tcp-udp-icmp-protocol-header-cheatsheets">Protocol header cheetsheets</a></h3>               
                    <p>A set of cheetsheets and diagrams for better understanding protocol headers and the sizes of Ethernet frames, IP packets, UDP datagrams, TCP packets and ICMP messages.</p>
                </li>
            </ul>
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