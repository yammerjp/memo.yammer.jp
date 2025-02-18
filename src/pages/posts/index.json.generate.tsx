import Head from 'next/head'
import { writeFile } from 'fs/promises'
import { getAllPosts } from '../../lib/api'

const json = () => {
  return (
    <Head>
      <meta httpEquiv='refresh' content='0; url=/posts/index.json' />
      <title>redirect to /posts/index.json</title>
    </Head>
  )
}

export default json

export const getStaticProps = async () => {
  const allPosts = await getAllPosts(['title', 'date', 'slug', 'tags', 'description', 'tags'])


  const bufObj = {
    version: "https://jsonfeed-extension.yammer.jp/v0.1.0",
    version_description: "a subset of json feed 1.1. it is optional that items.content_text or items.content_html",
    title: "Posts on memo.yammer.jp",
    home_page_url: "https://memo.yammer.jp",
    feed_url: "https://memo.yammer.jp/posts/index.json",
    description: "Recent content in Posts on memo.yammer.jp",
    generator: "memo.yammer.jp with Next.js (https://github.com/yammerjp/memo.yammer.jp)",
    language: "ja",
    copyright: "©2021 Keisuke Nakayama",
    lastBuildDate: new Date().toUTCString(),
    items: allPosts.map(item => ({
      id: 'https://memo.yammer.jp/posts/' + item.slug,
      url: 'https://memo.yammer.jp/posts/' + item.slug,
      title: item.title,
      summary: item.description ?? '',
      date_published: item.date,
      tags: item.tags,
    })
    )
  }
  await writeFile(`${process.cwd()}/public/posts/index.json`, JSON.stringify(bufObj))
  return {
    props: {},
  }
}
