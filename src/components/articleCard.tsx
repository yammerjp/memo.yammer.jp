import Link from 'next/link'
import { PostType } from '../types/post'
import Tags from './tags'
import ArticleDate from './articleDate'
import styles from './articleCard.module.css'

const ArticleCard = ({
  post,
  tagsEmphasizing,
  allEmphasizing,
  linkable,
  thin,
}: {
  post: PostType
  tagsEmphasizing: string[]
  allEmphasizing: boolean
  linkable: boolean
  thin: boolean
}) => {
  return (
    <section className={thin ? styles.articleCardThin : styles.articleCard}>
      <Link href={'/posts/' + post.slug}>
        <a className={styles.articleLink}>
          <ArticleDate post={post} historyDisplayable={false} small={thin} />
          <div className={thin ? styles.articleTitleThin : styles.articleTitle}>{post.title}</div>
          {!thin && <div className={styles.articleDescription}>{post.description || ''}</div>}
        </a>
      </Link>
      {!thin && (
        <Tags
          tags={post.tags ?? []}
          tagsEmphasizing={tagsEmphasizing}
          allEmphasizing={allEmphasizing}
          linkable={linkable}
          inArticleHeader={false}
        />
      )}
    </section>
  )
}

ArticleCard.defaultProps = {
  thin: false,
}
export default ArticleCard
