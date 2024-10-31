// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Astronomicon',
			social: {
				github: 'https://github.com/Fryuni/astronomicon',
			},
			components: {
				PageTitle: './src/components/PageTitle.astro',
			},
			sidebar: [
				{
					label: 'Introduction',
					slug: 'index'
				},
				{
					label: 'All',
					autogenerate: { directory: 'all' },
				},
			],
		}),
	],
});
