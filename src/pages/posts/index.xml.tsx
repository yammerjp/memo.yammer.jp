import { GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import xmlEscape from 'xml-escape'
import { writeFile } from 'fs/promises'
import { getAllPosts } from '../../lib/api'

const Page = () => null

export default Page

export const getServerSideProps = async ({ res }: GetServerSidePropsContext) => {
  const allPosts = await getAllPosts(['title', 'date', 'slug', 'tags', 'description', 'tags'])

  let buf = `<rss xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
<channel>
<title>Posts on memo.yammer.jp</title>
<link>https://memo.yammer.jp/posts/</link>
<description>Recent content in Posts on memo.yammer.jp</description>
<generator>memo.yammer.jp with Next.js (https://github.com/yammerjp/memo.yammer.jp)</generator>
<language>ja</language>
<copyright>©2021 Keisuke Nakayama</copyright>
<lastBuildDate>${new Date().toUTCString()}
</lastBuildDate>
<atom:link href="https://memo.yammer.jp/posts/index.xml" rel="self" type="application/rss+xml"/>
`

  for (const post of allPosts) {
    const title = post.title
    const link = 'https://memo.yammer.jp/posts/' + post.slug
    const guid = link
    const description = post.description
    const date = post.date
    const tags = post.tags
    buf += `<item>
<title>${xmlEscape(title)}</title>
<link>${link}</link>
<pubDate>${new Date(date).toUTCString()}</pubDate>
<guid>${guid}</guid>
<description>${xmlEscape(description)}</description>
${tags.map((t) => `<category>${t}</category>`).join('\n')}
</item>
`
  }

  buf += `</channel>
</rss>`

  res.statusCode = 200
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate')
  res.setHeader('Content-Type', 'text/xml')
  res.end(buf)
  return {
    props: {},
  }
}
