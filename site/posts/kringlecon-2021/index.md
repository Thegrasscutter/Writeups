---
title: Kringlecon 2021
layout: post
tags: postCollection
---

<ul>
{%- for post in collections.kringlecon2021Post -%}
  <li>
  <a href={{ post.url }}> {{ post.data.title }}</a> </li>
{%- endfor -%}
</ul>