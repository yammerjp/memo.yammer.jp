import { getAllPosts } from '../../lib/astroApi'
import { SITE_URL, escapeXml, formatRssDate } from '../../lib/rss'

const buildRss = async () => {
  const allPosts = await getAllPosts(['title', 'date', 'slug', 'html'])
  const latestBuildDate = new Date().toUTCString()
  const copyright = `©${new Date().getFullYear()} Keisuke Nakayama`

  const items = allPosts
    .map(
      (post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(`${SITE_URL}/posts/${post.slug}`)}</link>
      <pubDate>${escapeXml(formatRssDate(post.date))}</pubDate>
      <guid>${escapeXml(`${SITE_URL}/posts/${post.slug}`)}</guid>
      <description>${escapeXml(post.html ?? '')}</description>
    </item>`,
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
  <channel>
    <title>memo.yammer.jp</title>
    <link>${escapeXml(`${SITE_URL}/posts/`)}</link>
    <description>Recent content in Posts on memo.yammer.jp</description>
    <generator>memo.yammer.jp with Astro (https://github.com/yammerjp/memo.yammer.jp)</generator>
    <language>ja</language>
    <copyright>${escapeXml(copyright)}</copyright>
    <lastBuildDate>${escapeXml(latestBuildDate)}</lastBuildDate>
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
