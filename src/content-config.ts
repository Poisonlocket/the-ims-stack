import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const authors = defineCollection({
    loader: glob({ pattern: '**/[^_]*.json', base: "./src/data/authors" }),
    schema: z.array({
        id: z.string().max(50),
        name: z.string().max(50),
        description: z.string().max(100),
        tags: z.array(z.string()),
        posts: z.array(z.string()),
        github: z.string().max(100),
    }),
});

export const collections = { authors };

export const collectionNames = Object.keys(collections);
