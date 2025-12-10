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

const posts = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "src/content/posts" }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        pubDate: z.coerce.date(),
        authors: z.array(z.string().max(50)),
        image: z.string().optional(),
        tags: z.array(z.string()).optional()
    })
});


// 4. Export a single `collections` object to register your collection(s)
export const collections = { authors, posts };