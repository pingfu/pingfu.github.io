---
layout: page
title: Home
breadcrumb: Welcome
redirect_from: "/writing/"
css_class_name: index
---

# Hi, I'm Marc Barry

A freelance <a href="/about">C# developer and infrastructure specialist</a> with a background in security working between London and Cardiff.

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