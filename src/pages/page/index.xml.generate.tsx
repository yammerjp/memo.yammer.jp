import Head from 'next/head'
import xmlEscape from 'xml-escape'
import { writeFile } from 'fs/promises'
import { getAllPosts } from '../../lib/api'

const RSS = () => {
  return (<Head>
    <meta httpEquiv="refresh" content="0; url=/posts/index.xml"/>
    <title>redirect to /posts/index.xml</title>
  </Head>);
};

export default RSS;

export const getStaticProps = async () => {
  const allPosts = (await getAllPosts([
    'title',
    'date',
    'slug',
    'tags',
    'html',
  ]))

  let buf = `<rss xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
<channel>
<title>Posts on memo.basd4g.net</title>
<link>https://memo.basd4g.net/posts/</link>
<description>Recent content in Posts on memo.basd4g.net</description>
<generator>memo.basd4g.net with Next.js (https://github.com/basd4g/memo.basd4g.net)</generator>
<language>ja</language>
<copyright>©2021 Keisuke Nakayama</copyright>
<lastBuildDate>${new Date()}
</lastBuildDate>
<atom:link href="https://memo.basd4g.net/posts/index.xml" rel="self" type="application/rss+xml"/>
`;

  for (const post of allPosts) {
      const title = post.title
      const link = 'https://memo.basd4g.net/posts/' + post.slug
      const guid = link;
      const description = post.html
      const date = post.date
    buf += `<item>
<title>${xmlEscape(title)}</title>
<link>${link}</link>
<pubDate>${new Date(date)}</pubDate>
<guid>${guid}</guid>
<description>${xmlEscape(description)}</description>
</item>
`;
  }

  buf += `</channel>
</rss>`;

  await writeFile(`${process.cwd()}/public/posts/index.xml`, buf); return {
    props: {},
  };
};