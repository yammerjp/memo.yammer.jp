import Head from 'next/head'
import { getJsonFeedWithoutContents } from '../lib/api'
import Frame from '../components/frame'
import ArticleCard from '../components/articleCard'
import Ogp from '../components/ogp'
import 'highlight.js/styles/github.css'
import PageSelector from '../components/pageSelector'
import { OgImageUrlInText } from '../lib/cloudinaryOgp'

type Props = {
  feed: FeedWithoutContents
}

const Index = ({ feed }: Props) => {
  return (
    <>
    <Head>
        <title>{feed.title} - {feed.description}</title>
        <Ogp title={feed.title} url={feed.home_page_url} description={feed.description||''} ogImage={OgImageUrlInText(feed.title)} ogType="website"/>
        {
        feed._feed_url_rss2 && (<link rel="alternate" type="application/rss+xml" href={feed._feed_url_rss2} title="RSS2.0" />)
        }
    </Head>
    <Frame titleIsH1={true}>
      <>
          {feed.items.slice(0,10).map((item) => (
            <ArticleCard item={item} key={item.id} tagsEmphasizing={[]} allEmphasizing={true} linkable={true}/>
          ))}

      <PageSelector nowPage={1} pages={((feed.items.length -1) / 10) + 1 }/>
      </>
    </Frame>
    </>
    )
}

export default Index

export const getStaticProps = async (): Promise<{props: Props}> => {
  const feed = await getJsonFeedWithoutContents()
  return {
    props: { feed },
  }
}
