---
layout: page
permalink: /
title: Thomas Queste
h1: Hey 👋, I'm Tom.
class: home
---

<p>Welcome to my blog.</p>
<p>I write about software development, productivity, and other things I find interesting.</p>

<h2>Latest Posts</h2>

<ul class="post-list">
{%- for post in site.posts limit:5 -%}
<li>
  <time datetime="{{ post.date | date_to_xmlschema }}">
    {{ post.date | date: "%Y-%m-%d" }}
  </time>
  <a href="{{ post.url | relative_url }}">
    <h3>{{ post.title | escape }}</h3>
  </a>
  <p class="excerpt">
    {%- if page.excerpt -%}
    {{ post.excerpt }}
    {%- endif -%}
  </p>
</li>
{%- endfor -%}
</ul>

<p>
<a href="/blog/">View All Posts</a>
</p>
