import Head from 'next/head'
import xmlEscape from 'xml-escape'
import { writeFile } from 'fs/promises'
import { getJsonFeedWithoutContents } from '../../lib/api'

const RSS = () => {
  return (<Head>
    <meta httpEquiv="refresh" content="0; url=/posts/index.xml"/>
    <title>redirect to /posts/index.xml</title>
  </Head>);
};

export default RSS;

export const getStaticProps = async () => {
  const feed = await getJsonFeedWithoutContents()

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
`;

  for (const item of feed.items) {
      const title = item.title || ''
      const link = item.url
      const guid = link;
      const description = item.summary || ''
      const date = item.date_published || ''
      const tags = item.tags || []
    buf += `<item>
<title>${xmlEscape(title)}</title>
<link>${link}</link>
<pubDate>${new Date(date).toUTCString()}</pubDate>
<guid>${guid}</guid>
<description>${xmlEscape(description)}</description>
${(tags.map(t => `<category>${t}</category>`)).join("\n")}
</item>
`;
  }

  buf += `</channel>
</rss>`;

  await writeFile(`${process.cwd()}/public/posts/index.xml`, buf); return {
    props: {},
  };
};
