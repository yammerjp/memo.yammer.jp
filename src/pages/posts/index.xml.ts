import { getAllPosts } from '../../lib/astroApi'
import xmlEscape from 'xml-escape'

import { SITE_URL, formatRssDate } from '../../lib/rss'

const buildRss = async () => {
  const allPosts = await getAllPosts(['title', 'date', 'slug', 'html'])
  const latestBuildDate = new Date().toUTCString()
  const copyright = `©${new Date().getFullYear()} Keisuke Nakayama`

  const items = allPosts
    .map(
      (post) => `    <item>
      <title>${xmlEscape(post.title)}</title>
      <link>${xmlEscape(`${SITE_URL}/posts/${post.slug}`)}</link>
      <pubDate>${xmlEscape(formatRssDate(post.date))}</pubDate>
      <guid>${xmlEscape(`${SITE_URL}/posts/${post.slug}`)}</guid>
      <description>${xmlEscape(post.html ?? '')}</description>
    </item>`,
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
  <channel>
    <title>memo.yammer.jp</title>
    <link>${xmlEscape(`${SITE_URL}/posts/`)}</link>
    <description>Recent content in Posts on memo.yammer.jp</description>
    <generator>memo.yammer.jp with Astro (https://github.com/yammerjp/memo.yammer.jp)</generator>
    <language>ja</language>
    <copyright>${xmlEscape(copyright)}</copyright>
    <lastBuildDate>${xmlEscape(latestBuildDate)}</lastBuildDate>
    <atom:link href="${SITE_URL}/posts/index.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`
}

export const prerender = true

export async function GET() {
  const body = await buildRss()

  return new Response(body, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  })
}
