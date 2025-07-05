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
  thin = false,
}: {
  post: PostType
  tagsEmphasizing: string[]
  allEmphasizing: boolean
  linkable: boolean
  thin?: boolean
}) => {
  return (
    <section className={thin ? styles.articleCardThin : styles.articleCard}>
      <Link href={'/posts/' + post.slug} className={styles.articleLink}>
        <ArticleDate post={post} historyDisplayable={false} small={thin} />
        <div className={thin ? styles.articleTitleThin : styles.articleTitle}>{post.title}</div>
        {!thin && <div className={styles.articleDescription}>{post.description || ''}</div>}
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

export default ArticleCard
