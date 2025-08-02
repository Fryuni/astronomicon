// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import remarkEmoji from 'remark-emoji';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Astronomicon',
			social: [
				{
					icon: 'github',
					label: 'GitHub',
					href: 'https://github.com/Fryuni/astronomicon',
				},
			],
			components: {
				PageTitle: './src/components/PageTitle.astro',
			},
			lastUpdated: true,
			sidebar: [
				{
					label: 'Introduction',
					slug: 'index',
				},
				{
					label: 'Tome I: When and Where',
					autogenerate: { directory: 'tome-1' },
				},
			],
		}),
	],
	markdown: {
		remarkPlugins: [[remarkEmoji, { accessible: true }]],
	},
});
