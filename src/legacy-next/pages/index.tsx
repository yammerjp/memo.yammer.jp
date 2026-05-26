import Head from 'next/head'
import { getAllPosts } from '../lib/api'
import { PostType } from '../types/post'
import Frame from '../components/frame'
import ArticleCard from '../components/articleCard'
import Ogp from '../components/ogp'
import 'highlight.js/styles/github.css'
import PageSelector from '../components/pageSelector'
import { OgImageUrlInText } from '../lib/cloudinaryOgp'

type Props = {
  allPosts: PostType[]
}

const Index = ({ allPosts }: Props) => {
  return (
    <>
      <Head>
        <title>memo.yammer.jp - 常に完成形</title>
        <Ogp
          title='memo.yammer.jp'
          path='/'
          description='常に完成形'
          ogImage={OgImageUrlInText('memo.yammer.jp')}
          ogType='website'
        />
        <link rel='alternate' type='application/rss+xml' href='/posts/index.xml' title='RSS2.0' />
      </Head>
      <Frame titleIsH1={true}>
        <>
          {allPosts.slice(0, 10).map((post) => (
            <ArticleCard post={post} key={post.slug} tagsEmphasizing={[]} allEmphasizing={true} linkable={true} />
          ))}

          <PageSelector nowPage={1} pages={(allPosts.length - 1) / 10 + 1} />
        </>
      </Frame>
    </>
  )
}

export default Index

export const getStaticProps = async (): Promise<{ props: Props }> => {
  const allPosts = await getAllPosts(['title', 'date', 'slug', 'tags', 'description'])
  return {
    props: { allPosts },
  }
}
