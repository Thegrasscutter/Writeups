---
title: Thegrasscutters writeups
layout: base.njk
pagination:
  data: collections.post
  size: 20
  alias: posts
eleventyNavigation:
  key: Index
  title: Home
  order: 1
---

## Introduction

This page is for writeups and writeups only.

## Latest posts

<div class="posts-showcase">
  {%- for post in posts -%}
    <div class="post-card-outer">
      <a href="{{ post.url }}">
        <div class="post-card">
          <div class="post-content">
            <h4>
                {{- post.data.title -}}
            </h4>
            <p>
              {{- post.data.description -}}
            </p>
          </div>
        </div>
      </a>
    </div>
  {%- endfor -%}
</div>

