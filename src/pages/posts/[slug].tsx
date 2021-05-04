import Link from 'next/link'
import Head from 'next/head'
import { getPostBySlug, getAllPosts } from '../../lib/api'
import { PostType } from '../../types/post'
import Frame from '../../components/frame'
import Article from '../../components/article'
import Ogp from '../../components/ogp'
import 'highlight.js/styles/github.css'

type Props = {
  post: PostType
}

const Post = ({ post }: Props) => {
  return (
    <>
    <Head>
        <title>{post.title} - memo.basd4g.net</title>
        <Ogp
          title={post.title + ' - memo.basd4g.net'}
          path={"/posts/" + post.slug}
          description={post.description || ''}
          ogImage={post.ogImage || ''}
          ogType="article"
        />
    </Head>
    <Frame>
      <Article post={post}/>
      <Link href="/">&lt; Home</Link>
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
  return {
    props: {
      post,
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