---
title: Hack the box
layout: post
tags: postCollection
description: >
  A short description of page
eleventyNavigation:
  key: HackTheBoxPosts
  title: Hack the box
  parent: Posts
---

## Hack the box

This is so much fun!

## Boxes I have hacked

<div class="posts-showcase">
  {%- for post in collections.hackTheBoxPost -%}
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
