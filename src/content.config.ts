import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const postSchema = z.object({
  title: z.string(),
  date: z.string(),
  tags: z.array(z.string()).default([]),
  ogImage: z.string().optional(),
})

const postCollection = defineCollection({
  loader: glob({ base: './content/posts', pattern: '**/*.md' }),
  schema: postSchema,
})

const pageCollection = defineCollection({
  loader: glob({ base: './content', pattern: '*.md' }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    ogImage: z.string().optional(),
  }),
})

export const collections = {
  posts: postCollection,
  pages: pageCollection,
}
