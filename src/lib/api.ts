import fs from 'fs/promises'
import { join } from 'path'
import matter from 'gray-matter'

import markdownToHtml from './markdownToHtml'
import markdownToDescription from './markdownToDescription'

const postsDirectory = join(process.cwd(), 'content', 'posts')
const staticPostsDirectory = join(process.cwd(), 'content')

export async function getPostSlugs() {
  return await fs.readdir(postsDirectory)
}

export async function getStaticPostBySlug(slug: string, fields: string[] = []) {
  return getPostByDirectoryAndSlug(staticPostsDirectory, slug, fields)
}

export async function getPostBySlug(slug: string, fields: string[] = []) {
  return getPostByDirectoryAndSlug(postsDirectory, slug, fields)
}

async function getPostByDirectoryAndSlug(dir: string, slug: string, fields: string[] = []) {
  const realSlug = slug.replace(/\.md$/, '')
  const fullPath = join(dir, `${realSlug}.md`)
  const fileContents = await fs.readFile(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  type Items = {
    [key: string]: string
  }

  const items: Items = {}

  // Ensure only the minimal needed data is exposed
  for (let i=0; i<fields.length; i++) {
    const field = fields[i]
    if (field === 'slug') {
      items[field] = realSlug
    }
    if (field === 'content') {
      items[field] = content
    }
    if (field === 'html') {
      items[field] = await markdownToHtml(content || '')
    }
    if (field === 'description') {
      items[field] = await markdownToDescription(content || '')
    }
    if (data[field]) {
      items[field] = data[field] ?? ''
    }
  }
  return items
}

export async function getAllPosts(fields: string[] = []) {
  const slugs = await getPostSlugs()
  const posts = await Promise.all(slugs
    .map((slug) => getPostBySlug(slug, fields)))
    // sort posts by date in descending order
  return posts.sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
}
