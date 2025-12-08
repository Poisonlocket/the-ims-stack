// 1. Import utilities from `astro:content`
import { defineCollection, reference, z } from 'astro:content';

// 2. Import loader(s)
import { file, glob } from "astro/loaders"
// 3. Define your collection(s)
const authors = defineCollection({
    loader: file("src/content/authors/authors.json"),
    schema: z.object({
        id: z.string().max(50),
        name: z.string().max(50),
        nickname: z.string().max(50),
        description: z.string().max(100),
        tags: z.array(z.string()),
        posts: z.array(z.string()),
        github: z.string().max(100),
    }),
});


// 4. Export a single `collections` object to register your collection(s)
export const collections = {"authors": authors };