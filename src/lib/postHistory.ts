import { readFile } from 'fs/promises'
import { join } from 'path'

import type { PostHistoryType } from '../types/post'
import { safeExec, sanitizePath } from './safeExec'

type PostHistoryCache = {
  posts: Record<string, PostHistoryType>
  pages: Record<string, PostHistoryType>
}

const historyCachePath = join(process.cwd(), 'generated', 'post-history.json')

let cachedHistoryPromise: Promise<PostHistoryCache | null> | null = null

const fetchHistoryFromGit = async (fullPath: string): Promise<PostHistoryType> => {
  try {
    const safePath = sanitizePath(fullPath)
    const commitSeparator = '__COMMIT_SEPALATOR__'
    const format = `${commitSeparator}%cd%x00%H%x00%s%x00`

    const { stdout } = await safeExec('git', ['log', '--follow', `--format=${format}`, '--date=iso8601-strict', '--', safePath], {
      cwd: process.cwd(),
      timeout: 10000,
    })

    return stdout
      .split(commitSeparator)
      .slice(1)
      .filter((commit) => commit.trim())
      .flatMap((commit) => {
        const parts = commit.split('\x00').filter((value) => value.length > 0)
        if (parts.length < 3) {
          console.warn(`Invalid commit format: ${commit}`)
          return []
        }
        const [date, hash, ...messageParts] = parts
        return [{ date, hash, message: messageParts.join('\x00') }]
      })
  } catch (error) {
    console.error(`Failed to fetch git history for ${fullPath}:`, error)
    return []
  }
}

const loadHistoryCache = async (): Promise<PostHistoryCache | null> => {
  if (cachedHistoryPromise) {
    return cachedHistoryPromise
  }

  cachedHistoryPromise = (async () => {
    try {
      const raw = await readFile(historyCachePath, 'utf-8')
      return JSON.parse(raw) as PostHistoryCache
    } catch {
      return null
    }
  })()

  return cachedHistoryPromise
}

export const getHistoryForContentPath = async (
  collection: keyof PostHistoryCache,
  slug: string,
  fullPath: string,
): Promise<PostHistoryType> => {
  const cache = await loadHistoryCache()
  const cached = cache?.[collection]?.[slug]
  if (cached) {
    return cached
  }
  return fetchHistoryFromGit(fullPath)
}

