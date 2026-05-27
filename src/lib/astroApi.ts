import { join } from 'path'
import { getCollection, getEntry } from 'astro:content'
import type { CollectionEntry } from 'astro:content'

import markdownToHtml from './markdownToHtml'
import markdownToDescription from './markdownToDescription'
import { OgImageUrlInText } from './cloudinaryOgp'
import { getHistoryForContentPath } from './postHistory'

import type { PostType } from '../types/post'

import relatedArticles from '../../relatedArticles.json' assert { type: 'json' }

type PostEntry = CollectionEntry<'posts'>
type PageEntry = CollectionEntry<'pages'>

const normalizeDate = (value: string | Date | undefined): string => {
  if (!value) {
    return ''
  }
  return value instanceof Date ? value.toISOString() : value
}

const postEntryToPost = async (entry: PostEntry, fields: string[] = []): Promise<PostType> => {
  const title = entry.data.title ?? ''
  const date = normalizeDate(entry.data.date)
  const body = entry.body ?? ''
  const basePath = join(process.cwd(), 'content', 'posts', `${entry.id}.md`)
  const description =
    fields.includes('description') || fields.includes('html')
      ? await markdownToDescription(body)
      : undefined

  return {
    slug: entry.id,
    title,
    date,
    content: body,
    ...(fields.includes('html') && { html: await markdownToHtml(body) }),
    ...(fields.includes('tags') && { tags: entry.data.tags ?? [] }),
    ...(fields.includes('description') && { description }),
    ...(fields.includes('history') && { history: await getHistoryForContentPath('posts', entry.id, basePath) }),
    ...(fields.includes('ogImage') && { ogImage: entry.data.ogImage || OgImageUrlInText(title) }),
  }
}

const pageEntryToPost = async (entry: PageEntry, fields: string[] = []): Promise<PostType> => {
  const title = entry.data.title ?? ''
  const date = normalizeDate(entry.data.date)
  const body = entry.body ?? ''
  const basePath = join(process.cwd(), 'content', `${entry.id}.md`)
  const description =
    fields.includes('description') || fields.includes('html')
      ? await markdownToDescription(body)
      : undefined

  return {
    slug: entry.id,
    title,
    date,
    content: body,
    ...(fields.includes('html') && { html: await markdownToHtml(body) }),
    ...(fields.includes('description') && { description }),
    ...(fields.includes('history') && { history: await getHistoryForContentPath('pages', entry.id, basePath) }),
    ...(fields.includes('ogImage') && { ogImage: entry.data.ogImage || OgImageUrlInText(title) }),
  }
}

export async function getAllPosts(fields: string[] = []): Promise<PostType[]> {
  const posts = await getCollection('posts')
  const mapped = await Promise.all(posts.map((post) => postEntryToPost(post, fields)))
  return mapped.sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
}

export async function getPost(slug: string, fields: string[] = []): Promise<PostType> {
  const entry = await getEntry('posts', slug)
  if (!entry) {
    throw new Error(`Post not found: ${slug}`)
  }
  return postEntryToPost(entry as PostEntry, fields)
}

export async function getStaticPost(slug: string, fields: string[] = []): Promise<PostType> {
  const entry = await getEntry('pages', slug)
  if (!entry) {
    throw new Error(`Page not found: ${slug}`)
  }
  return pageEntryToPost(entry as PageEntry, fields)
}

export async function getNeighborPosts(
  slug: string,
  fields: string[] = ['slug'],
): Promise<{ next: PostType | null; prev: PostType | null }> {
  const allPosts = await getAllPosts(fields)
  const idx = allPosts.findIndex((post) => post.slug === slug)
  if (idx === -1) {
    console.error('Need to specify EXISTING slug with calling getNeighborPosts()')
    return { next: null, prev: null }
  }
  return {
    next: idx - 1 >= 0 ? allPosts[idx - 1] : null,
    prev: idx + 1 <= allPosts.length - 1 ? allPosts[idx + 1] : null,
  }
}

export async function getRelatedPosts(
  slug: string,
  fields: string[] = ['slug'],
): Promise<PostType[]> {
  const allPosts = await getAllPosts(fields)
  const idx = allPosts.findIndex((post) => post.slug === slug)
  if (idx === -1) {
    console.error('Need to specify EXISTING slug with calling getNeighborPosts()')
    return []
  }
  const articles =
    (((relatedArticles as { [key: string]: { id: string; score: number }[] })[slug]) ?? []).flatMap(
      (item) => allPosts.find((p) => p.slug === item.id) ?? [],
    )

  const neighborPosts = await getNeighborPosts(slug, fields)
  return articles
    .filter(
      (item) =>
        item.slug != neighborPosts.next?.slug && item.slug != neighborPosts.prev?.slug && item.slug !== slug,
    )
    .slice(0, 5)
}
