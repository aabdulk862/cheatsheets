import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const infosys = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/infosys' }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    lang: z.string().default('java'),
  }),
});

export const collections = { infosys };
