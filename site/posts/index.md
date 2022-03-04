---
title: Posts
layout: base.njk
---

<ul>
{%- for post in collections.postCollection -%}
  <li>
  <a href={{ post.url }}> {{ post.data.title }}</a> </li>
{%- endfor -%}
</ul>