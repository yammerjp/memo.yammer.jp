import fs from 'fs/promises'
import { join } from 'path'
import matter from 'gray-matter'
import { exec } from 'child_process'

import markdownToHtml from './markdownToHtml'
import markdownToDescription from './markdownToDescription'
import { OgImageUrlInText } from './cloudinaryOgp'

import { PostType, PostHistoryType } from '../types/post'

const fetchSlugs = async (): Promise<string[]> => {
  const files = await fs.readdir(join(process.cwd(), 'content', 'posts'))
  return files.filter((f) => /.*\.md/.test(f)).map((s) => s.slice(0, -3))
}

const execPromise = (command: string): Promise<string> =>
  new Promise((resolve, reject) => {
    exec(command, (err, stdout) => {
      if (err) {
        reject(err)
      }
      resolve(stdout)
    })
  })

const fetchHistory = async (fullPath: string): Promise<PostHistoryType> => {
  const commitSepalator = '__COMMIT_SEPALATOR__'
  const stdout = await execPromise(`git log --format=${commitSepalator}%cd,%H,%s --date=iso8601-strict ${fullPath}`)
  return stdout
    .split(commitSepalator)
    .slice(1) // remove first sepalator
    .map((commit) => {
      const [date, hash, message] = commit.split(',')
      return { date, message, hash }
    })
}

const fetchPost = async (dir: string, slug: string, fields: string[] = []): Promise<PostType> => {
  const fullPath = join(dir, `${slug}.md`)
  const fileContents = await fs.readFile(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    slug,
    title: data['title'],
    date: data['date'],
    content: data['content'] ?? '',
    ...(fields.includes('html') && { html: await markdownToHtml(content || '') }),
    ...(fields.includes('tags') && { tags: data['tags'] || [] }),
    ...(fields.includes('description') && { description: await markdownToDescription(content || '') }),
    ...(fields.includes('history') && { history: await fetchHistory(fullPath) }),
    ...(fields.includes('ogImage') && { ogImage: data['ogImage'] || OgImageUrlInText(data['title']) }),
  }
}

export async function getStaticPost(slug: string, fields: string[] = []): Promise<PostType> {
  return fetchPost(join(process.cwd(), 'content'), slug, fields)
}

export async function getPost(slug: string, fields: string[] = []): Promise<PostType> {
  return fetchPost(join(process.cwd(), 'content', 'posts'), slug, fields)
}

export async function getAllPosts(fields: string[] = []): Promise<PostType[]> {
  const slugs = await fetchSlugs()
  const posts = await Promise.all(slugs.map((slug) => getPost(slug, fields)))
  // sort posts by date in descending order
  return posts.sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
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
