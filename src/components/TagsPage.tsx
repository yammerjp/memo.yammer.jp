import { useEffect, useState } from 'react'
import { PostType } from '../types/post'
import ArticleCard from './articleCard'
import TagsSelector from './tagsSelector'
import styles from '../pages/tags.module.css'

const queryTags2tagArr = (tags: string | string[] | undefined) => {
  if (!tags) {
    return []
  }
  if (typeof tags !== 'string') {
    return tags.sort()
  }
  if (tags.includes(',')) {
    return decodeURIComponent(tags).split(',').sort()
  }
  return [decodeURIComponent(tags)]
}

type Props = {
  allPosts: PostType[]
}

const TagsPage = ({ allPosts }: Props) => {
  const tagsAll = allPosts.flatMap((post) => post.tags ?? []).map((s) => s.toLowerCase())
  const [tagsSelected, setTagsSelected] = useState<string[]>([])
  const [queryLoadingIsEnabled, setQueryLoadingIsEnabled] = useState<boolean>(true)

  useEffect(() => {
    const tagsArr = queryTags2tagArr(new URLSearchParams(window.location.search).get('tags') ?? undefined)
    if (tagsArr.sort().join(',') === tagsSelected.sort().join(',')) {
      return
    }
    setTagsSelected(tagsArr)
  }, [queryLoadingIsEnabled, tagsSelected])

  const clickedTag = (tag: string, willbeSelected: boolean) => {
    if (queryLoadingIsEnabled) {
      setQueryLoadingIsEnabled(false)
    }

    setTagsSelected((before) => {
      const removed = before.filter((t) => t !== tag)
      let newTags: string[] = []
      if (willbeSelected) {
        newTags = [...removed, tag].sort()
      } else {
        newTags = removed.sort()
      }
      history.replaceState(null, '', location.pathname + (newTags.length > 0 ? '?tags=' + newTags.join(',') : ''))
      return newTags
    })
  }

  const postsSelected = allPosts
    .filter((post) => {
      if (tagsSelected.length == 0) {
        return false
      }
      return tagsSelected.every((t) => post.tags && post.tags.map((s) => s.toLowerCase()).includes(t))
    })
    .sort((a, b) => {
      return a.date < b.date ? 1 : -1
    })

  return (
    <div>
      <div className={styles.articleTagsSelectorWrap}>
        <h2 className={styles.articleTagsSelectorWrapH2}>記事をタグで絞り込む</h2>
        <hr className={styles.hr} />
        <TagsSelector tagsAll={tagsAll} tagsSelected={tagsSelected} clickedTag={clickedTag} />
        <hr className={styles.hr} />
      </div>
      <div>
        {(() => {
          if (tagsSelected.length === 0) {
            return <div className={styles.articleCardsMessage}>タグを選んでください</div>
          } else if (postsSelected.length === 0) {
            return <div className={styles.articleCardsMessage}>選択したタグをすべて含む記事はみつかりませんでした</div>
          } else {
            return (
              <>
                {postsSelected.map((post) => (
                  <ArticleCard
                    post={post}
                    key={post.slug}
                    tagsEmphasizing={tagsSelected}
                    allEmphasizing={false}
                    linkable={false}
                  />
                ))}
              </>
            )
          }
        })()}
      </div>
    </div>
  )
}

export default TagsPage
