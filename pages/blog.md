---
layout: page
permalink: /blog/
title: Posts
class: blog
---

<ul class="post-list">
    {%- for post in site.posts -%}
    <li>
      <time datetime="{{ post.date | date_to_xmlschema }}">
        {{ post.date | date: "%Y-%m-%d" }}
      </time>
      <a href="{{ post.url | relative_url }}">
        <h2>{{ post.title | escape }}</h2>
      </a>
      <p class="excerpt">
        {%- if page.excerpt -%}
         {{ post.excerpt }}
        {%- endif -%}
      </p>
    </li>
    {%- endfor -%}
</ul>