import Head from 'next/head'
import Frame from '../../components/frame'
import Article from '../../components/article'
import Ogp from '../../components/ogp'
import NeighborArticles from '../../components/neighborArticles'
import 'highlight.js/styles/github.css'
import { extractNeighborItemsWithoutContents, getJsonFeedItem, getJsonFeedItemBySlug, getJsonFeedWithoutContents } from '../../lib/api'

type Props = {
  item: Item
  prev: ItemWithoutContents | null
  next: ItemWithoutContents | null
}

const Post = ({item, prev, next}: Props) => {
  return (
    <>
    <Head>
        <title>{item.title} - memo.yammer.jp</title>
        <Ogp
          title={item.title + ' - memo.yammer.jp'}
          url={item.url}
          description={item.summary || ''}
          ogImage={item.banner_image || ''}
          ogType="article"
        />
        <link rel="stylesheet" href="/assets/article.css"></link>
    </Head>
    <Frame>
      <>
      <Article item={item}/>
      <NeighborArticles prev={prev} next={next} />
      </>
    </Frame>
    </>
  )
}

export default Post

type Params = {
  params: {
    slug: string
  }
}

export async function getStaticProps({ params }: Params) {
  const feed = await getJsonFeedWithoutContents()
  // const item = await getJsonFeedItem(`${feed.home_page_url}/posts/${params.slug}`)
  const item = await getJsonFeedItemBySlug(params.slug)
  if (!item) {
    console.error('item is falsly')
  }
  const { prev, next } = await extractNeighborItemsWithoutContents(feed, item?.url||'')
  return {
    props: {
      item,
      prev,
      next,
    }
  }
}

export async function getStaticPaths() {
  const feed = await getJsonFeedWithoutContents()
  return {
    paths: feed.items.map((item) => {
      return {
        params: {
          slug: item.url.slice(`${feed.home_page_url}/posts/`.length),
        },
      }
    }),
    fallback: false,
  }
}