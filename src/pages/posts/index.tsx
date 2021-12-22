import Head from 'next/head'
import { getJsonFeedWithoutContents } from '../../lib/api'
import Frame from '../../components/frame'
import ArticleCardThin from '../../components/articleCardThin'
import Ogp from '../../components/ogp'
import { OgImageUrlInText } from '../../lib/cloudinaryOgp'

type Props = {
  feed: FeedWithoutContents
}

const Index = ({ feed }: Props) => {
  return (
    <>
    <Head>
        <title>{feed.title} - {feed.description}</title>
        <Ogp title={feed.title} url={feed.home_page_url} description={feed.description || ''} ogImage={OgImageUrlInText(feed.title)} ogType="website"/>
    </Head>
    <Frame titleIsH1={true}>
      <>
          {feed.items.map((item) => (
            <ArticleCardThin item={item} key={item.id} tagsEmphasizing={[]} allEmphasizing={true} linkable={true}/>
          ))}
      </>
    </Frame>
    </>
    )
}

export default Index

export const getStaticProps = async (): Promise<{props: Props}> => {
  return {
    props: {
      feed: await getJsonFeedWithoutContents()
    }
  }
}
