import Tag from './tag'
import styles from './tags.module.css'

const Tags = ({
  tags,
  tagsEmphasizing,
  allEmphasizing,
  linkable,
  inArticleHeader,
}: {
  tags: string[]
  tagsEmphasizing: string[]
  allEmphasizing: boolean
  linkable: boolean
  inArticleHeader: boolean
}) => {
  return (
    <div className={styles.articleTags}>
      {tags.map((tag: string) => (
        <Tag
          key={tag}
          tagName={tag}
          linkTo={linkable ? `/tags?tags=${tag}` : undefined}
          emphasizing={!!(allEmphasizing || tagsEmphasizing.find((t) => t === tag))}
          inArticleHeader={inArticleHeader}
        />
      ))}
    </div>
  )
}

export default Tags
