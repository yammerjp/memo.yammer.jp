import Head from 'next/head'
import { getAllPosts } from '../../lib/api'
import { PostType } from '../../types/post'
import Frame from '../../components/frame'
import ArticleCardThin from '../../components/articleCardThin'
import Ogp from '../../components/ogp'
import { OgImageUrlInText } from '../../lib/cloudinaryOgp'

type Props = {
  allPosts: PostType[]
}

const Index = ({ allPosts }: Props) => {
  return (
    <>
    <Head>
        <title>memo.yammer.jp - 常に完成形</title>
        <Ogp title="memo.yammer.jp" path="/" description="常に完成形" ogImage={OgImageUrlInText('memo.yammer.jp')} ogType="website"/>
    </Head>
    <Frame titleIsH1={true}>
      <>
          {allPosts.map((post) => (
            <ArticleCardThin post={post} key={post.slug} tagsEmphasizing={[]} allEmphasizing={true} linkable={true}/>
          ))}

      </>
    </Frame>
    </>
    )
}

export default Index

export const getStaticProps = async () => {
  const allPosts = (await getAllPosts([
    'title',
    'date',
    'slug',
    'tags',
  ]))
  return {
    props: { allPosts },
  }
}
