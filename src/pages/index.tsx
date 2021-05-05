import Head from 'next/head'
import { getAllPosts } from '../lib/api'
import { PostType } from '../types/post'
import Frame from '../components/frame'
import ArticleCard from '../components/articleCard'
import Ogp from '../components/ogp'
import 'highlight.js/styles/github.css'
import PageSelector from '../components/pageSelector'

type Props = {
  allPosts: PostType[]
}

const Index = ({ allPosts }: Props) => {
  return (
    <>
    <Head>
        <title>memo.basd4g.net - 常に完成形</title>
        <Ogp title="memo.basd4g.net" path="/" description="常に完成形" ogImage={
          'https://res.cloudinary.com/basd4g/image/upload/co_rgb:505050,l_text:Sawarabi%20Gothic_64_align_center:memo.basd4g.net,w_800,c_fit/v1608780036/memo-basd4g-net-ogp.png'
        } ogType="website"/>
        <link rel="stylesheet" href="/assets/articleCard.css"></link>
    </Head>
    <Frame titleIsH1={true}>
      <>
          {allPosts.slice(0,10).map((post) => (
            <ArticleCard post={post} key={post.slug} tagsEmphasizing={[]} allEmphasizing={true} linkable={true} thin={false}/>
          ))}

      <PageSelector nowPage={1} pages={((allPosts.length -1) / 10) + 1 }/>
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
    'description',
  ]))
  return {
    props: { allPosts },
  }
}
