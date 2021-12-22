import Head from 'next/head'
import { getJsonFeedWithoutContents } from '../../lib/api'
import Frame from '../../components/frame'
import ArticleCard from '../../components/articleCard'
import Ogp from '../../components/ogp'
import 'highlight.js/styles/github.css'
import PageSelector from '../../components/pageSelector'
import { OgImageUrlInText } from '../../lib/cloudinaryOgp'

const postsParPage = 10

type Props = {
  feed: FeedWithoutContents
  items: ItemWithoutContents[]
  slug: string
  postLength: number
}

const Page = ({ feed, items, slug, postLength }: Props) => {
  return (
    <>
    <Head>
        <title>{feed.title} - {feed.description}</title>
        <Ogp title={feed.title} url={feed.home_page_url} description={feed.description||''} ogImage={OgImageUrlInText(feed.title)} ogType="website"/>
    </Head>
    <Frame titleIsH1={true}>
      <>
      <div className="head-page-selector-wrap">
          <PageSelector nowPage={Number(slug)} pages={pageLength(postLength)}/>
      </div>
          {items.map((item) => (
            <ArticleCard item={item} key={item.id} tagsEmphasizing={[]} allEmphasizing={true} linkable={true}/>
          ))}
      <PageSelector nowPage={Number(slug)} pages={pageLength(postLength)}/>
      </>
    </Frame>
    </>
    )
}

export default Page

type Params = {
  params: {
    slug: string
  }
}

export const getStaticProps = async ({params}: Params): Promise<{props: Props}> => {
  const firstPost = (Number(params.slug) - 1 ) * postsParPage +1;
  const lastPost = postsParPage * Number(params.slug);
  const feed = await getJsonFeedWithoutContents();
  const itemsOfThePage = feed.items.slice(firstPost, lastPost)
  return {
    props: {
      feed,
      items: itemsOfThePage,
      slug: params.slug,
      postLength: feed.items.length,
    },
  }
}

const pageLength = (postsLength:number) => {
  return ((postsLength-1) / postsParPage) +1;
}

export async function getStaticPaths() {
  const feed = await getJsonFeedWithoutContents()
  const pages = pageLength(feed.items.length)
  let pagesArr = []
  for (let n=1; n<=pages; n++) {
    pagesArr.push(n)
  }
  return {
    paths: pagesArr.map((page) => {
      return {
        params: {
          slug: '' + page,
        },
      }
    }),
    fallback: false,
  }
}