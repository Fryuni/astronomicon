---
title: What runs on the client?
sidebar:
  order: 1
---

Some of the code you write in an Astro project will execute in the browser of the user accessing your website. In total, Astro can emit code to run on the client from these sources:

- Client Islands hydration scripts
- Server Islands replacement scripts
- UI frameworks components used with `client:*` directives
- `<script>` tags in Astro Components
- Scripts from integrations using `injectScript` using stages `head-inline`, `before-hydration` or `page`
- Scripts injected by a middleware modifying the HTML response
