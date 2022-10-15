import Head from 'next/head'
import { getAllPosts } from '../../lib/api'
import { PostType } from '../../types/post'
import Frame from '../../components/frame'
import ArticleCard from '../../components/articleCard'
import Ogp from '../../components/ogp'
import 'highlight.js/styles/github.css'
import PageSelector from '../../components/pageSelector'
import { OgImageUrlInText } from '../../lib/cloudinaryOgp'

const postsParPage = 10

type Props = {
  posts: PostType[]
  slug: string
  postLength: number
}

const Page = ({ posts, slug, postLength }: Props) => {
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
      </Head>
      <Frame titleIsH1={true}>
        <>
          <div style={{ marginTop: '-26px' }}>
            <PageSelector nowPage={Number(slug)} pages={pageLength(postLength)} />
          </div>
          {posts.map((post) => (
            <ArticleCard post={post} key={post.slug} tagsEmphasizing={[]} allEmphasizing={true} linkable={true} />
          ))}
          <PageSelector nowPage={Number(slug)} pages={pageLength(postLength)} />
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

export const getStaticProps = async ({ params }: Params): Promise<{ props: Props }> => {
  const firstPost = (Number(params.slug) - 1) * postsParPage
  const lastPost = postsParPage * Number(params.slug)
  const allPosts = (await getAllPosts(['title', 'date', 'slug', 'tags', 'description'])).sort((a, b) => {
    return a.date < b.date ? 1 : -1
  })
  const posts = allPosts.slice(firstPost, lastPost)
  return {
    props: {
      posts,
      slug: params.slug,
      postLength: allPosts.length,
    },
  }
}

const pageLength = (postsLength: number) => {
  return (postsLength - 1) / postsParPage + 1
}

export async function getStaticPaths(): Promise<{ paths: Params[]; fallback: boolean }> {
  const posts = await getAllPosts(['slug'])
  const pages = pageLength(posts.length)
  let pagesArr = []
  for (let n = 1; n <= pages; n++) {
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
