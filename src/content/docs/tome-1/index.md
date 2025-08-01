---
title: Overview
---

## An Introduction to Execution Environments

To write effective Astro integrations and unlock advanced patterns, the single most important concept to master is understanding **when** and **where** your code executes. Code in an Astro project runs in three distinct environments, and the boundaries between them are not always as clear as they seem.

Misunderstanding these environments is the primary source of bugs and unexpected behavior when developing integrations. This tome will provide the foundational knowledge to navigate them.

---

### The Three Execution Environments

Let's start with the common knowledge, both from Astro Docs and from how frameworks like Astro work in general.
There are three distinct moments your code will be running, and every line of code you write for an Astro project is destined for one of three environments.

#### 1. Build Time

This environment is the Node.js process that runs on your machine when you execute `astro dev` or `astro build`.

- **What it is:** A short-lived Node.js process.
- **When it runs:** Only during development or when building your project.
- **Code that runs here:**
  - `astro.config.mjs`
  - All Astro integration code (e.g., the `hooks` object).
  - Any script executed by a Vite plugin.
- **Scope & Capabilities:** It has full access to the project's file system, `process.env`, and can import any Node.js dependency. It knows nothing about a specific user's request.

#### 2. Server Runtime

This environment exists on your hosting platform and processes incoming requests when using Server-Side Rendering (SSR).

- **What it is:** A server environment (e.g., Node.js, Deno, Cloudflare Workers).
- **When it runs:** On the server, for every incoming request to a page or API endpoint.
- **Code that runs here:**
  - The frontmatter (the `---` block) of your `.astro` pages.
  - Code inside API routes (`src/pages/api/...`).
  - Middleware (`src/middleware.ts`).
- **Scope & Capabilities:** It can access request-specific data like headers, cookies, and URL parameters via the `Astro` global. It typically has limited or no access to the original project's file system.

#### 3. Client Runtime

This is the user's web browser.

- **What it is:** The browser's JavaScript engine.
- **When it runs:** After the page has been delivered to the user.
- **Code that runs here:**
  - Code inside `<script>` tags (that are not `is:inline`).
  - JavaScript from UI frameworks (React, Svelte, etc.) hydrated with a `client:*` directive.
- **Scope & Capabilities:** It can interact with the DOM, browser APIs, and `window`. It has no access to the server or the build environment.

### Where the Lines Blur: The Power of Hooks

While these three environments are logically separate, Astro's build process can create powerful overlaps. This is where the "dangerous" knowledge begins.

An integration's hooks run at **Build Time**, but they can be timed to execute before, during, or after the code for the other environments has been generated.

A prime example is the `astro:build:done` hook.

- **The Environment:** This hook executes in the **Build Time** Node.js process.
- **The Timing:** It runs _after_ Astro has finished the entire build, including generating all Server Runtime and Client Runtime assets and placing them in the `dist/` directory.

Because the hook runs in the same process that just finished the build, it can directly access the build's output. This allows for a unique and powerful pattern: importing and using **Server Runtime** code during **Build Time**.

```js
// In an Astro integration (runs at Build Time)
export default {
  name: 'my-analyzer-integration',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      // `dir` is a URL pointing to the output directory (e.g., /path/to/project/dist/)
      const serverEntryPath = new URL('./server/entry.mjs', dir);

      // DANGER: We are at Build Time, but we are importing a module
      // that was just generated for the Server Runtime.
      const serverEntry = await import(serverEntryPath.href);

      // Now we can analyze, validate, or use exported functions
      // from the final server build before the build process exits.
      if (serverEntry.someExportedLogic) {
        console.log('Found server logic:', serverEntry.someExportedLogic.toString());
      }
    },
  },
};
```

Understanding this principle—that your integration code's scope can temporarily intersect with the _output_ destined for another environment—is the key to unlocking the most advanced capabilities of Astro. The following chapters will explore these intersections in detail. Tread carefully.
