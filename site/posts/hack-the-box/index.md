---
title: Hack the box
layout: post
tags: postCollection
---

<ul>
{%- for post in collections.hackTheBoxPost -%}
  <li>
  <a href={{ post.url }}> {{ post.data.title }}</a> </li>
{%- endfor -%}
</ul>