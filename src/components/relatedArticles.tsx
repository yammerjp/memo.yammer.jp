import Link from 'next/link'
import { PostType } from '../types/post'
import styles from './relatedArticles.module.css'

const relatedArticles = ({articles}: {articles: PostType[]}) => {
  if (articles.length === 0) {
    return null
  }
  return (
    <div className={styles.relatedArticles}>
      <div className={styles.relatedArticlesPretitle} id="related-articles">
        関連記事
      </div>
      {articles.map(article => (
        <Link href={'/posts/' + article.slug} key={article.slug}>
          <div className={styles.relatedArticle} >
            <div className={styles.relatedArticleTitle}>{article.title}</div>
          </div>
        </Link>
      ))}
    </div>
  )
}
export default relatedArticles 
