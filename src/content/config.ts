import { defineCollection, z } from 'astro:content';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
	docs: defineCollection({
		schema: docsSchema({
			extend: z.object({
				subjectMatter: z
					.object({
						package: z.string(),
						gitRef: z.string(),
					})
					.optional(),
			}),
		}),
	}),
};
