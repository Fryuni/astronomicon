---
title: Overview
---

In the path to most unlock advanced patterns in Astro projects and integration, the single most important concept to master is understanding **when** and **where** your code executes. Code in an Astro project runs in three distinct environments, and the boundaries between them are not always as clear as they seem.

Misunderstanding these environments is the primary source of bugs and unexpected behavior when developing integrations with more advanced behaviors. This tome will provide the required knowledge to navigate them.

## The Three Execution Environments

Let's start with the common knowledge, both from Astro Docs and from how frameworks like Astro work in general. There are three distinct moments your code runs: during build, during a request on the server, and after the request on the client. Most of the times, these different moments also represent different "places" your code is running and with that what is guaranteed from the environment in each case.

:eyes: _Most_ times, not always...

### Build Time

This environment is the Node.js process that runs on your machine (or on your CI) when you execute `astro build`.

- **What it is:** A short-lived Node.js process.
- **When it runs:** Only during development or when building your project.
- **Code that runs here:**
  - `astro.config.mjs`
  - All Astro integration code (e.g., the `hooks` object).
  - Any script executed by a Vite plugin.
  - Middlewares (once for each prerendered route)
  - Prerendered routes (only their server render part)
  - JavaScript from UI frameworks (React, Svelte, etc.) that is not marked with the `client:only` directive.
- **Scope & Capabilities:**
  - It has full access to the project's file system, `process.env`, and can import any Node.js dependency.
  - It knows nothing about a specific user's request.
  - It has full access to all of Astro's capabilities, both for building and for rendering.

### Server

This environment exists on your hosting platform and processes each incoming requests for on-demand routes.

- **What it is:** A server environment (e.g., Node.js, Deno, Cloudflare Workers).
- **When it runs:** On the server, depending on the platform can either run continuously or for every incoming request to a page or API endpoint that is not prerendered.
- **Code that runs here:**
  - Adapter specific code to bridge the platform with Astro
  - Middlewares
  - On-demand routes (only their server render part)
  - JavaScript from UI frameworks (React, Svelte, etc.) that is not marked with the `client:only` directive.
- **Scope & Capabilities:**
  - It can access request-specific data like headers, cookies, and URL parameters.
  - It typically has limited or no access to the original project's file system.
  - It doesn't have acess to Astro build tooling like Astro, Markdown, MDX and JSX parsers and processors.
  - It doesn't have guaranteed access to NodeJS built-in modules (platform dependent).
  - It has full access to Astro's _rendering_ capabilities, even if some of those capabilities are not used by any route (e.g. through the Container API).

### Client

This is the user's web browser.

- **What it is:** The browser's JavaScript engine.
- **When it runs:** After the page has been delivered to the user.
- **Code that runs here:**
  - Code inside `<script>` tags.
  - JavaScript from UI frameworks (React, Svelte, etc.) hydrated with a `client:*` directive.
- **Scope & Capabilities:**
  - It can interact with the DOM, browser APIs, and `window`.
  - It has no access to the server or the build environment.
  - It has no access to Astro's build or rendering capabilities.

## Where the Lines Blur

While these three environments are logically separate, there are intersections between them. For example:

- Middlewares run both during build and on the server;
- UI frameworks run both on the server and on the client;
- Rendering of Astro components happen during build time and on the server when they are used both in prerendered and on-demand routes.

Such intersections means that you code, or at least some part of it, has to be compatible with more than one environment it might run. The code for a UI component used with `client:*` can use neither server-specific nor browser-specific APIs. Code authors will usually document whether their code has to be execute on certain environments (or someone will open an issue asking them to :wink:).

And then we have the integrations. You might ask "What about them? They run on build time, don't they?" and well... here is where the lines get blurry and you realize that, as Captain Barbossa told us, the distinction between those moments and environments are more like guidelines rather than strict rules.

We'll go through all the specifics shortly, but the point is that integrations have a lot of power. A LOT of power. And that includes bending most of those isolation rules. Integrations can bring code from build time into the server or client and access code from both the server and the client during build. They can even access code that exists _nowhere_, code that was generated by Astro and thrown away by some optimization and will not be present anywhere on the server, client or build. Get it? Guidelines, everything you know is just guidelines, not rules.

A prime example is the `astro:build:done` hook. It runs, like all integration hooks, during _Build Time_, after all the prerendering is done and Astro has finished generating all of its assets. But did you know you can actually import any module that would exist in the server? You can, and that is not even all of it. You know you can import any mode that _would_ exist in the server _if_ all your routes were configured to be on-demand rendered.

Understanding this principle—that your integration code's scope can temporarily intersect with the _output_ destined for another environment that might not even exist—is the key to unlocking the possibilities that might be limiting your creativity and making even more amazing integrations. The following chapters will explore _exactly_ the when and where each line of your code will run and what does that mean. Tread carefully, but have fun!
