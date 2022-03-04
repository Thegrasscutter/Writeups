---
title: Kringlecon 2021
layout: post
tags: postCollection
eleventyNavigation:
  key: KringleCon2021Posts
  title: Kringlecon 2021
  parent: Posts
---

## Kringlecon 2021

This was a blast! I had so much fun doing this!

## Some of the cases I did

<div class="posts-showcase">
  {%- for post in collections.kringlecon2021Post -%}
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