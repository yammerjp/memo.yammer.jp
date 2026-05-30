import { describe, expect, it } from 'vitest'
import { readFile } from 'fs/promises'
import { join } from 'path'

const distPath = (...segments: string[]) => join(process.cwd(), 'dist', ...segments)

const readDistHtml = async (relativePath: string) => {
  return readFile(distPath(relativePath), 'utf8')
}

describe('Astro pages integration', () => {
  it('renders the latest post on the home page with its excerpt', async () => {
    const html = await readDistHtml('index.html')

    expect(html).toContain('トイカメラで、写真の荒さを楽しむ')
    expect(html).toContain('2025年も残り2週間、いかがお過ごしでしょうか？')
    expect(html).toContain('/posts/20251215')
  })

  it('renders edited history on article detail pages', async () => {
    const html = await readDistHtml('posts/20200330/index.html')

    expect(html).toContain('今日欲しい物(2020/3/30)')
    expect(html).toContain('edited')
    expect(html).toContain('Fix markdown directory')
    expect(html).toContain('commit/8472c89f0a4e817298e18a7e13a8594055dcf6f1')
  })

  it('renders the tags page without a search route link', async () => {
    const html = await readDistHtml('tags/index.html')

    expect(html).toContain('タグを選んでください')
    expect(html).toContain('role="button"')
    expect(html).not.toContain('href="/search"')
  })

  it('serves the RSS feed at /posts/index.xml', async () => {
    const xml = await readDistHtml('posts/index.xml')

    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>')
    expect(xml).toContain('<rss xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">')
    expect(xml).toContain('<link>https://memo.yammer.jp/posts/</link>')
    expect(xml).toContain('<atom:link href="https://memo.yammer.jp/posts/index.xml" rel="self" type="application/rss+xml" />')
    expect(xml).toContain('<item>')
    expect(xml).toContain('/posts/20251215')
  })
})
