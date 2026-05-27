import type { PostType } from '../types/post'
import { iso8601toDisplayStr } from '../lib/date'
import Tag from './tag'
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
  const tags = post.tags ?? []

  return (
    <section className={thin ? styles.articleCardThin : styles.articleCard}>
      <a href={'/posts/' + post.slug} className={styles.articleLink}>
        <div style={{ fontSize: thin ? '12px' : '16px' }}>{iso8601toDisplayStr(post.date)}</div>
        <div className={thin ? styles.articleTitleThin : styles.articleTitle}>{post.title}</div>
        {!thin && <div className={styles.articleDescription}>{post.description || ''}</div>}
      </a>
      {!thin && (
        <div>
          {tags.map((tagName) => (
            <Tag
              key={tagName}
              tagName={tagName}
              linkable={linkable}
              emphasizing={allEmphasizing || tagsEmphasizing.includes(tagName)}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default ArticleCard
