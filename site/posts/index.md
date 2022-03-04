---
title: Posts
layout: base.njk
eleventyNavigation:
  key: Posts
  title: Posts
---

# Posts

Here you can see some of my posts, grouped by where I have done them.

<div class="posts-showcase">
  {%- for postCollection in collections.postCollection -%}
    <div class="post-card-outer">
      <a href="{{ postCollection.url }}">
        <div class="post-card">
          <div class="post-content">
            <h4>
                {{- postCollection.data.title -}}
            </h4>
            <p>
              {{- postCollection.data.description -}}
            </p>
          </div>
        </div>
      </a>
    </div>
  {%- endfor -%}
</div>