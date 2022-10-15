import Head from 'next/head'
import { getPost, getAllPosts, getNeighborPosts, getRelatedPosts } from '../../lib/api'
import { PostType } from '../../types/post'
import Frame from '../../components/frame'
import Article from '../../components/article'
import Ogp from '../../components/ogp'
import NeighborArticles from '../../components/neighborArticles'
import RelatedArticles from '../../components/relatedArticles'
import 'highlight.js/styles/github.css'
import ImpressionForm from '../../components/impressionForm'

type Props = {
  post: PostType
  prev: PostType | null
  next: PostType | null
  relatedPosts: PostType[] | null
}

const Post = (props: Props) => {
  return (
    <>
      <Head>
        <title>{props.post.title} - memo.yammer.jp</title>
        <Ogp
          title={props.post.title + ' - memo.yammer.jp'}
          path={'/posts/' + props.post.slug}
          description={props.post.description || ''}
          ogImage={props.post.ogImage || ''}
          ogType='article'
        />
      </Head>
      <Frame>
        <>
          <Article post={props.post} />
          <ImpressionForm post={props.post} />
          <NeighborArticles prev={props.prev} next={props.next} />
          <RelatedArticles posts={props.relatedPosts} />
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

export async function getStaticProps({ params }: Params): Promise<{ props: Props }> {
  return {
    props: {
      post: await getPost(params.slug, [
        'title',
        'date',
        'slug',
        'content',
        'tags',
        'html',
        'description',
        'history',
        'ogImage',
      ]),
      ...(await getNeighborPosts(params.slug, ['slug', 'title', 'date'])),
      relatedPosts: await getRelatedPosts(params.slug, ['slug', 'title', 'date']),
    },
  }
}

export async function getStaticPaths(): Promise<{ paths: Params[]; fallback: boolean }> {
  const posts = await getAllPosts(['slug'])
  return {
    paths: posts.map((posts) => ({
      params: {
        slug: posts.slug,
      },
    })),
    fallback: false,
  }
}
