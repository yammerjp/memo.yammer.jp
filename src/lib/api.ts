import fs from 'fs/promises'
import { join } from 'path'
import matter from 'gray-matter'

import markdownToHtml from './markdownToHtml'
import markdownToDescription from './markdownToDescription'
import { OgImageUrlInText } from './cloudinaryOgp'
import { safeExec, sanitizePath } from './safeExec'

import { PostType, PostHistoryType } from '../types/post'

import relatedArticles from '../../relatedArticles.json' assert { type: "json" }

const fetchSlugs = async (): Promise<string[]> => {
  const files = await fs.readdir(join(process.cwd(), 'content', 'posts'))
  return files.filter((f) => /.*\.md/.test(f)).map((s) => s.slice(0, -3))
}

const fetchHistory = async (fullPath: string): Promise<PostHistoryType> => {
  try {
    // パスをサニタイズ
    const safePath = sanitizePath(fullPath)
    
    const commitSepalator = '__COMMIT_SEPALATOR__'
    const format = `${commitSepalator}%cd,%H,%s`
    
    // git logコマンドを安全に実行
    const { stdout } = await safeExec('git', [
      'log',
      `--format=${format}`,
      '--date=iso8601-strict',
      '--', // パスの前に -- を入れることで、オプションとして解釈されることを防ぐ
      safePath
    ], {
      cwd: process.cwd(),
      timeout: 10000 // 10秒でタイムアウト
    })
    
    return stdout
      .split(commitSepalator)
      .slice(1) // remove first separator
      .filter(commit => commit.trim()) // 空行を除去
      .map((commit) => {
        const parts = commit.split(',')
        if (parts.length < 3) {
          console.warn(`Invalid commit format: ${commit}`)
          return null
        }
        const [date, hash, ...messageParts] = parts
        const message = messageParts.join(',') // メッセージにカンマが含まれる場合を考慮
        return { date, message, hash }
      })
      .filter((item): item is PostHistoryType[0] => item !== null)
  } catch (error) {
    console.error(`Failed to fetch git history for ${fullPath}:`, error)
    return [] // エラー時は空の履歴を返す
  }
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
  const articles =(((relatedArticles as { [key:string]: {id: string, score: number}[]})[slug]) ?? []).flatMap(item => allPosts.find(p => p.slug === item.id) ?? [])

  const neighborPosts = await getNeighborPosts(slug, fields)
  return articles.filter(item => item.slug != neighborPosts.next?.slug && item.slug != neighborPosts.prev?.slug && item.slug !== slug).slice(0,5)
}
