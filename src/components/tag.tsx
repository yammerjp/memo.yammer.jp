import styles from './tag.module.css'

const Tag = ({
  tagName,
  selectable = false,
  selected = false,
  buttonClickHandler,
  linkable = false,
  inArticleHeader = false,
  emphasizing = false,
}: {
  tagName: string
  selectable?: boolean
  selected?: boolean
  buttonClickHandler?: () => void
  linkable?: boolean
  inArticleHeader?: boolean
  emphasizing?: boolean
}) => {
  const className = [
    styles.articleTag,
    selectable ? styles.selectable : '',
    selected ? styles.selected : '',
    linkable ? styles.linkable : '',
    inArticleHeader ? styles.inArticleHeader : '',
    emphasizing ? styles.emphasizing : '',
  ]
    .filter(Boolean)
    .join(' ')

  if (linkable) {
    return (
      <a href={'/tags?tags=' + encodeURIComponent(tagName)} className={className}>
        {tagName}
      </a>
    )
  }

  return (
    <span className={className} onClick={buttonClickHandler} role={selectable ? 'button' : undefined}>
      {tagName}
    </span>
  )
}

export default Tag
