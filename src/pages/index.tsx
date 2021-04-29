import { getAllPosts } from '../lib/api'
import Post from '../types/post'

type Props = {
  allPosts: Post[]
}

const Index = ({ allPosts }: Props) => {
  return (
    <div>
      <h1>Next.js blog</h1>
      <h2>Articles:</h2>
        {allPosts.sort((a,b)=>{
          return a.date < b.date ? 1 : -1
        }).map((post) => (
          <p>
            <div>
            <a href={"/posts/"+ post.slug}>{post.title}
            </a>
            </div><div>
            <small>(posted: {post.date})</small>
            </div>
          </p>
        ))}
    </div>
    )
}

export default Index

export const getStaticProps = async () => {
  const allPosts = getAllPosts([
    'title',
    'date',
    'slug',
  ])

  return {
    props: { allPosts },
  }
}
