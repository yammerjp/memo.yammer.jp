import Head from 'next/head'
import { getAllPosts } from '../lib/api'
import { PostType } from '../types/post'
import Frame from '../components/frame'
import ArticleCard from '../components/articleCard'
import 'highlight.js/styles/github.css'
import TagsSelector from '../components/tagsSelector'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Ogp from '../components/ogp'
import { OgImageUrlInText } from '../lib/cloudinaryOgp'
import styles from './tags.module.css'

type Props = {
  allPosts: PostType[]
}

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

const Index = ({ allPosts }: Props) => {
  const tagsAll = allPosts.flatMap((post) => post.tags ?? []).map((s) => s.toLowerCase())
  const [tagsSelected, setTagsSelected] = useState<string[]>([])
  const [queryLoadingIsEnabled, setQueryLoadingIsEnabled] = useState<boolean>(true)
  const router = useRouter()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // URLクエリパラメータを読み込んでtagsSelectedのステートに反映
    // ただしURLクエリパラメータはページ遷移後の初回レンダリングやクエリ書き換え後の初回レンダリングでは正しく反映されない
    // そのため、外からクエリパラメータ付きで飛んできた時のみ、このuseEffectでステートに反映される
    // GUIをクリックしてユーザがステートを変更したら、 queryLoadingIsEnabled を false にして、以降はページ遷移までクエリパラメータを一方的に書き換えるだけとする
    if (!queryLoadingIsEnabled) {
      return
    }

    const tagsArr = queryTags2tagArr(router.query.tags)
    if (tagsArr.sort().join(',') === tagsSelected.sort().join(',')) {
      return
    }
    setTagsSelected(tagsArr)
    // console.log(`${tagsArr} is set`);
  })

  const clickedTag = (tag: string, willbeSelected: boolean) => {
    // clickedTagが1回以上発火したら queryLoadingIsEnabledをfalseにしてクエリパラメータの読み込みを禁止する
    if (queryLoadingIsEnabled) {
      setQueryLoadingIsEnabled(false)
    }

    // console.log(`${tag} will be ${willbeSelected}`);
    // router.push() するとページ遷移扱いになってスクロール位置が一番上になってしまうので使用を避けている
    // router.push() を使わないためにクエリパラメータの読み込みを初回以降は禁止するという面倒な処理をしている
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
    <>
      <Head>
        <title>memo.yammer.jp - 常に完成形</title>
        <Ogp
          title='記事をタグで絞り込む - memo.yammer.jp'
          path='/tags'
          description='記事をタグで絞り込む'
          ogImage={OgImageUrlInText('memo.yammer.jp')}
          ogType='website'
        />
      </Head>
      <Frame titleIsH1={true}>
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
              return (
                <div className={styles.articleCardsMessage}>選択したタグをすべて含む記事はみつかりませんでした</div>
              )
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
      </Frame>
    </>
  )
}

export default Index

export const getStaticProps = async (): Promise<{ props: Props }> => {
  const allPosts = await getAllPosts(['title', 'date', 'slug', 'tags', 'description'])
  return {
    props: { allPosts },
  }
}
