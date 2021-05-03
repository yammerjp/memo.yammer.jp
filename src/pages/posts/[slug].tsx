import Link from 'next/link'
import Head from 'next/head'
import { getPostBySlug, getAllPosts } from '../../lib/api'
import markdownToHtml from '../../lib/markdownToHtml'
import PostType from '../../types/post'
import Frame from '../../components/frame'
import Article from '../../components/article'
import 'highlight.js/styles/github.css'

type Props = {
  post: PostType
}

const Post = ({ post }: Props) => {
  return (
    <>
    <Head>
        <title>{post.title} - memo.basd4g.net</title>
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