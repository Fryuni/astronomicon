// To update this:
// - Ensure `jq` and GNU findutils are installed
// - Clone https://github.com/withastro/astro to an `astro` folder
// - Clone https://github.com/withastro/adapters to an `adapters` folder
// - Clone https://github.com/withastro/compiler to a `compiler` folder
// - Checkout the `main` branch on all 3 of the repos
// - Run this command:
//   find astro compiler adapters -name package.json -and ! -path '**/node_modules/**' -exec jq 'select(.private!=true and (.name|startswith("@astrojs") or .=="astro"))|{(.name):"{}"}' -c {} \; | jq -sS 'reduce .[] as $i ({};.*=$i)'
const rawInfo: Record<string, string> = {
  '@astrojs/alpinejs': 'astro/packages/integrations/alpinejs/package.json',
  '@astrojs/cloudflare': 'adapters/packages/cloudflare/package.json',
  '@astrojs/compiler': 'compiler/packages/compiler/package.json',
  '@astrojs/db': 'astro/packages/db/package.json',
  '@astrojs/internal-helpers': 'astro/packages/internal-helpers/package.json',
  '@astrojs/lit': 'astro/packages/integrations/lit/package.json',
  '@astrojs/markdoc': 'astro/packages/integrations/markdoc/package.json',
  '@astrojs/markdown-remark': 'astro/packages/markdown/remark/package.json',
  '@astrojs/mdx': 'astro/packages/integrations/mdx/package.json',
  '@astrojs/netlify': 'adapters/packages/netlify/package.json',
  '@astrojs/node': 'adapters/packages/node/package.json',
  '@astrojs/partytown': 'astro/packages/integrations/partytown/package.json',
  '@astrojs/preact': 'astro/packages/integrations/preact/package.json',
  '@astrojs/prism': 'astro/packages/astro-prism/package.json',
  '@astrojs/react': 'astro/packages/integrations/react/package.json',
  '@astrojs/rss': 'astro/packages/astro-rss/package.json',
  '@astrojs/sitemap': 'astro/packages/integrations/sitemap/package.json',
  '@astrojs/solid-js': 'astro/packages/integrations/solid/package.json',
  '@astrojs/studio': 'astro/packages/studio/package.json',
  '@astrojs/svelte': 'astro/packages/integrations/svelte/package.json',
  '@astrojs/tailwind': 'astro/packages/integrations/tailwind/package.json',
  '@astrojs/telemetry': 'astro/packages/telemetry/package.json',
  '@astrojs/underscore-redirects': 'astro/packages/underscore-redirects/package.json',
  '@astrojs/upgrade': 'astro/packages/upgrade/package.json',
  '@astrojs/vercel': 'adapters/packages/vercel/package.json',
  '@astrojs/vue': 'astro/packages/integrations/vue/package.json',
  '@astrojs/web-vitals': 'astro/packages/integrations/web-vitals/package.json',
  astro: 'astro/packages/astro/package.json',
};

type PackageLocation = {
  repo: string;
  path: string;
};

const packages = Object.fromEntries<PackageLocation>(
  Object.entries(rawInfo).map(([key, value]) => {
    const parts = value.split('/');
    const path = parts.slice(1, -1).join('/');
    return [key, { repo: parts[0]!, path }] as const;
  })
);

export type SubjectMatter = {
  package: string;
  gitRef: string;
};

export type SubjectMatterLink = {
  packageRootAtRef: string;
};

export function getSubjectMatterLink(subjectMatter: SubjectMatter): SubjectMatterLink {
  const location = packages[subjectMatter.package];
  if (!location) {
    throw new Error(`Unknown package: ${subjectMatter.package}`);
  }

  return {
    packageRootAtRef: `https://github.com/withastro/${location.repo}/tree/${subjectMatter.gitRef}/${location.path}`,
  };
}
