---
title: Torkels writeups
layout: base.njk
pagination:
  data: collections.post
  size: 10
  alias: posts
  #TODO: Implement filter for date on posts
  #filter:
  #  - date
---

## Introduction

This page is for writeups and writeups only.

## Latest 10 posts

<ol>
  {%- for post in posts -%}
    <li> <a href={{ post.url }}>{{ post.data.title }} </a></li>
  {%- endfor -%}
</ol>

