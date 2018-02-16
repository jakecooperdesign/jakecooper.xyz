---
title: Tags
date: 2018-02-16 21:12:00 Z
permalink: "/tags/"
is_nav: true
order: 2
layout: post
---

{% assign tags = site.tags | sort %}
<ul class="is-unstyled">
  {% for item in tags %}
    <li><a class="is-link-wrapper" href="/tags/{{item[0] | slugify}}">{{item[0]}}</a></li>
  {% endfor %}
</ul>