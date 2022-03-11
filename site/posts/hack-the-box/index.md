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

A collection of writeups from the website hackthebox. Check it out, you might just learn something!

## Available writeups

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
