import Link from 'next/link'
import styles from './tag.module.css'

type PropType = {
  tagName: string
  emphasizing: boolean
  linkTo: string | undefined
  selectable: boolean
  selected: boolean
  inArticleHeader: boolean
  buttonClickHandler: (() => void) | undefined
}

const Tag = ({ tagName, emphasizing, linkTo, selectable, selected, inArticleHeader, buttonClickHandler }: PropType) => {
  const className = Object.entries({
    [styles.articleTag]: true,
    [styles.linkable]: !!linkTo,
    [styles.emphasizing]: emphasizing,
    [styles.selectable]: selectable,
    [styles.selected]: selected,
    [styles.inArticleHeader]: inArticleHeader,
  })
    .filter(([_, value]) => value)
    .map(([key, _]) => key)
    .join(' ')

  const tagElement = !!buttonClickHandler ? (
    <button className={className} onClick={buttonClickHandler}>
      {tagName}
    </button>
  ) : (
    <span className={className}>{tagName}</span>
  )

  if (!linkTo) {
    return tagElement
  }

  return <Link href={linkTo}>{tagElement}</Link>
}

Tag.defaultProps = {
  emphasizing: false,
  linkTo: undefined,
  selectable: false,
  selected: false,
  inArticleHeader: false,
  buttonClickHandler: undefined,
}

export default Tag
