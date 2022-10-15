import Link from 'next/link'
import { PostType } from '../types/post'
import styles from './relatedArticles.module.css'

const RelatedArticles = ({ posts }: { posts: PostType[] | null }) => {
  if (posts === null || posts.length === 0) {
    return <></>
  }
  return (
    <div className={styles.relatedArticles}>
      <div className={styles.relatedArticlesPretitle}>関連記事</div>
      <div>
        {posts.slice(0, 3).map((post) => (
          <Link href={'/posts/' + post.slug} passHref key={post.slug}>
            <a className={styles.relatedArticle}>
              <div className={styles.relatedArticleTitle}>{post.title}</div>
            </a>
          </Link>
        ))}
      </div>
    </div>
  )
}
export default RelatedArticles
