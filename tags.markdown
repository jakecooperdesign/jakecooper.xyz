---
title: Tags
date: 2018-02-16 21:12:00 Z
permalink: "/tags/"
is_nav: true
order: 2
layout: post
---

<ul>
{% for category in categories %}
{% assign category_name = category\[0\] %}
<li>
<a href="/category/{{ category_name | slugify }}/">{{ category_name | replace: "-", " " }}</a>
</li>
{% endfor %}
</ul>