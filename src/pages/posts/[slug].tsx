import { getPostBySlug, getAllPosts } from '../../lib/api'
import markdownToHtml from '../../lib/markdownToHtml'
import PostType from '../../types/post'
import Head from '../../components/head'

type Props = {
  post: PostType
}

const Post = ({ post }: Props) => {
  return (
    <>
    <Head></Head>
    <body>
    <div>
      <h1>{post.title}</h1>
      <article>
        <div
        dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
      <a href="/">Back to home</a>
    </div>
    </body>
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
  const post = getPostBySlug(params.slug, [
    'title',
    'date',
    'slug',
    'content',
  ])
  const content = await markdownToHtml(post.content || '')

  return {
    props: {
      post: {
        ...post,
        content,
      },
    },
  }
}

export async function getStaticPaths() {
  const posts = getAllPosts(['slug'])

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
