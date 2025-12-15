---
title: "How to build a blog in astro"
description: "This is a sample post used to test the Astro collection schema."
pubDate: 2024-05-12
authors: ["jerome-bachmann"]
image: "../assets/img.png"
tags: ["testing", "astro", "sample", "astro"]
---
# How to Write a Blog in Astro

Astro has quickly become one of the most popular frameworks for building content-focused websites, and for good reason. Its islands architecture, minimal JavaScript by default, and excellent content collections system make it an ideal choice for blogging. In this guide, I'll walk you through everything you need to know to build a blog with Astro.

## Why Astro for Blogging?

Before we dive into the technical details, let's talk about why Astro is such a great fit for blogs. Astro ships zero JavaScript by default, which means your blog posts load incredibly fast. The framework also has first-class support for Markdown and MDX, making it easy to write content. Plus, you can bring your own UI framework (React, Vue, Svelte, etc.) only when you need interactivity.

## Getting Started

First, create a new Astro project. Open your terminal and run:
````bash
npm create astro@latest my-blog
cd my-blog
npm install
````

When prompted, choose the "Blog" template. This gives you a solid starting point with example posts and a basic layout.

## Project Structure

After setup, your blog project will look something like this:
````
my-blog/
├── src/
│   ├── components/
│   ├── content/
│   │   └── blog/
│   │       ├── post-1.md
│   │       └── post-2.md
│   ├── layouts/
│   │   └── BlogPost.astro
│   └── pages/
│       ├── blog/
│       │   ├── [...slug].astro
│       │   └── index.astro
│       └── index.astro
├── astro.config.mjs
└── package.json
````

## Setting Up Content Collections

Content Collections are Astro's powerful way to manage your blog posts with type safety. First, define your collection schema in `src/content/config.ts`:
````typescript
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { blog };
````

This schema ensures every blog post has the required frontmatter fields and provides TypeScript autocompletion.

## Writing Your First Blog Post

Create a new file in `src/content/blog/my-first-post.md`:
````markdown
---
title: 'My First Blog Post'
description: 'This is my first post on my new Astro blog'
pubDate: 2024-01-15
heroImage: '/blog-placeholder.jpg'
tags: ['astro', 'blogging', 'web-dev']
---

# Welcome to My Blog

This is the content of my first blog post. I can write **Markdown** here, including:

- Lists
- Links
- Code blocks
- And more!

## Code Examples
```javascript
const greeting = "Hello, Astro!";
console.log(greeting);
```

Pretty cool, right?
````

## Creating the Blog Index Page

Your blog index page (`src/pages/blog/index.astro`) displays all your posts:
````astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

const posts = (await getCollection('blog')).sort(
  (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
);
---

<BaseLayout title="Blog">
  <h1>My Blog</h1>
  <ul>
    {posts.map((post) => (
      <li>
        <a href={`/blog/${post.slug}/`}>
          <h2>{post.data.title}</h2>
          <p>{post.data.description}</p>
          <time datetime={post.data.pubDate.toISOString()}>
            {post.data.pubDate.toLocaleDateString()}
          </time>
        </a>
      </li>
    ))}
  </ul>
</BaseLayout>
````

## Creating Individual Blog Post Pages

Use dynamic routing to generate pages for each post (`src/pages/blog/[...slug].astro`):
````astro
---
import { getCollection } from 'astro:content';
import BlogPost from '../../layouts/BlogPost.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: post,
  }));
}

const post = Astro.props;
const { Content } = await post.render();
---

<BlogPost {...post.data}>
  <Content />
</BlogPost>
````

## Creating a Blog Post Layout

Your blog post layout (`src/layouts/BlogPost.astro`) wraps your content:
````astro
---
import BaseLayout from './BaseLayout.astro';

const { title, description, pubDate, heroImage } = Astro.props;
---

<BaseLayout title={title} description={description}>
  <article>
    {heroImage && <img src={heroImage} alt={title} />}
    <h1>{title}</h1>
    <time datetime={pubDate.toISOString()}>
      {pubDate.toLocaleDateString()}
    </time>
    <slot />
  </article>
</BaseLayout>
````

## Adding MDX Support

To use React components or more advanced features in your posts, install MDX:
````bash
npm install @astrojs/mdx
````

Update `astro.config.mjs`:
````javascript
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  integrations: [mdx()],
});
````

Now rename your posts from `.md` to `.mdx` and import components:
````mdx
---
title: 'Interactive Post'
pubDate: 2024-01-16
---

import MyComponent from '../../components/MyComponent.jsx';

# This post has interactive elements!

<MyComponent client:load />
````

## Adding Features

### Syntax Highlighting

Astro includes Shiki for syntax highlighting by default. Just use code blocks in your markdown:
````markdown
```javascript
function greet(name) {
  return `Hello, ${name}!`;
}
```
````

### RSS Feed

Generate an RSS feed by creating `src/pages/rss.xml.js`:
````javascript
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog');
  return rss({
    title: 'My Astro Blog',
    description: 'A blog about web development',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.slug}/`,
    })),
  });
}
````

### Tag Pages

Create tag filtering by adding `src/pages/tags/[tag].astro`:
````astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';

export async function getStaticPaths() {
  const allPosts = await getCollection('blog');
  const uniqueTags = [...new Set(allPosts.flatMap((post) => post.data.tags || []))];
  
  return uniqueTags.map((tag) => ({
    params: { tag },
    props: {
      posts: allPosts.filter((post) => post.data.tags?.includes(tag))
    },
  }));
}

const { tag } = Astro.params;
const { posts } = Astro.props;
---

<BaseLayout title={`Posts tagged with ${tag}`}>
  <h1>Posts tagged with "{tag}"</h1>
  <ul>
    {posts.map((post) => (
      <li>
        <a href={`/blog/${post.slug}/`}>{post.data.title}</a>
      </li>
    ))}
  </ul>
</BaseLayout>
````

## Deploying Your Blog

Astro works with virtually any hosting provider. Some popular options:

### Netlify/Vercel
Just connect your Git repository and deploy. Both platforms auto-detect Astro projects.

### Static Hosting
Build your site and upload the `dist` folder:
````bash
npm run build
````

## Best Practices

1. **Optimize images**: Use Astro's `<Image />` component for automatic optimization
2. **Use content collections**: They provide type safety and better performance
3. **Keep JavaScript minimal**: Let Astro's strength shine by avoiding unnecessary client-side JS
4. **Write good frontmatter**: Complete metadata helps with SEO and organization
5. **Test locally**: Use `npm run dev` to preview changes before deploying

## Conclusion

Astro makes blogging straightforward and performant. With content collections, excellent Markdown support, and a component-based architecture, you can build a blog that's fast, maintainable, and a joy to write for. The best part? You can start simple and add complexity only when you need it.

Now go forth and start blogging with Astro!