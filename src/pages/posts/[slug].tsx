import Link from 'next/link'
import Head from 'next/head'
import { getPostBySlug, getAllPosts, getNeighborPosts } from '../../lib/api'
import { PostType } from '../../types/post'
import Frame from '../../components/frame'
import Article from '../../components/article'
import Ogp from '../../components/ogp'
import NeighborArticles from '../../components/neighborArticles'
import 'highlight.js/styles/github.css'

type Props = {
  post: PostType
  prev: PostType | null
  next: PostType | null
}

const Post = (props: Props) => {
  return (
    <>
    <Head>
        <title>{props.post.title} - memo.yammer.jp</title>
        <Ogp
          title={props.post.title + ' - memo.yammer.jp'}
          path={"/posts/" + props.post.slug}
          description={props.post.description || ''}
          ogImage={props.post.ogImage || ''}
          ogType="article"
        />
        <link rel="stylesheet" href="/assets/article.css"></link>
    </Head>
    <Frame>
      <>
      <Article post={props.post}/>
      <NeighborArticles prev={props.prev} next={props.next} />
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
  const post = await getPostBySlug(params.slug, [
    'title',
    'date',
    'slug',
    'content',
    'tags',
    'html',
    'description',
    'history',
    'ogImage',
  ])
  const { prev, next } = await getNeighborPosts(params.slug, [
    'slug',
    'title',
    'date',
  ])
  return {
    props: {
      post,
      prev,
      next,
    }
  }
}

export async function getStaticPaths() {
  const posts = await getAllPosts(['slug'])
  return {
    paths: posts.map((posts) => {
      return {
        params: {
          slug: posts.slug,
        },
      }
    }),
    fallback: false,
  }
}
