import Head from 'next/head'
import { getAllPosts } from '../lib/api'
import { PostType } from '../types/post'
import Frame from '../components/frame'
import ArticleCard from '../components/articleCard'
import 'highlight.js/styles/github.css'
import { useState } from 'react'
import Ogp from '../components/ogp'
import { OgImageUrlInText } from '../lib/cloudinaryOgp'
import styles from './search.module.css'

const SIMILARITY_MATCHING_ENDPOINT = "https://memo-yammer-jp-similarity-matching.yammerjp.workers.dev/search"

type Props = {
  allPosts: PostType[]
}

type FetchedArticle = {
  id: string
  url: string
  similarity: number
  summary: string
  tags: string[]
  title: string
}

type State = {
  query: string
  loading: boolean
  alreadyFetched: boolean,
  errorRateLimit: boolean
  errorUnknown: boolean
  posts: PostType[]
}

const Index = ({ allPosts }: Props) => {
  const [composition, setComposition] = useState<boolean>(false)
  const onCompositionStart = () => setComposition(true)
  const onCompositionEnd = () => setComposition(false)
  const [state, setState] = useState<State>({
    query: "",
    loading: false,
    alreadyFetched: false,
    errorRateLimit: false,
    errorUnknown: false,
    posts: []
  })
  const search = () => {
    (async () => {
      setState(s => ({...s, loading: true}))
      if (state.query.length === 0) {
        // search query is empty
        return
      }
      const res = await fetch(
        `${SIMILARITY_MATCHING_ENDPOINT}?${
          new URLSearchParams({q: state.query})
        }`
      )
      if (!res.ok) {
        if (res.status === 429) {
          setState(s => ({...s, errorRateLimit: true}))
        } else {
          setState(s => ({...s, errorUnknown: true}))
        }
        return
      }
      const articles = (await res.json())?.result as FetchedArticle[]
      const slugs = articles.map(a => a.url.split("/").pop())
      const posts = slugs.flatMap(s => allPosts.find(p => p.slug === s) ?? [])
      setState(s => ({
        ...s,
        loading: false,
        alreadyFetched: true,
        errorRateLimit: false,
        errorUnknown: false,
        posts
      }))
    })()
  }

  let caution: string|null = null
  if (state.loading) {
    caution = "... ⌛"
  } else if (state.errorUnknown) {
    caution = "エラーが発生しました"
  } else if (state.errorRateLimit) {
    caution = "しばらく時間をあけて実行してください"
  } else if (!state.alreadyFetched) {
    caution = "検索ワードを入力してください"
  } else if (state.alreadyFetched && state.posts.length === 0) {
    caution = "記事はみつかりませんでした"
  }
  return (
    <>
      <Head>
        <title>memo.yammer.jp - 常に完成形</title>
        <Ogp
          title='記事を検索 - memo.yammer.jp'
          path='/tags'
          description='記事を検索'
          ogImage={OgImageUrlInText('memo.yammer.jp')}
          ogType='website'
        />
      </Head>
      <Frame titleIsH1={true}>
        <div className={styles.articleTagsSelectorWrap}>
          <h2 className={styles.articleTagsSelectorWrapH2}>記事を検索</h2>
          <div>(注意) このページの機能はα版です</div>
          <hr className={styles.hr} />
          <div>
          <input
            placeholder="記事と近いニュアンスの言葉や文章を入力"
            value={state.query}
            onChange={e => setState(s => ({...s, query: e.target.value}))}
            style={{"width": "100%", border: "none"}}
            onCompositionStart={onCompositionStart}
            onCompositionEnd={onCompositionEnd}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === "Enter" && !composition) search() }}
          />
    </div>
          <hr className={styles.hr} />
        </div>
        <div>
          { caution !== null ? (
            <div className={styles.articleCardsMessage}>{caution}</div>
          ) : (
            <>
              {state.posts.map((post) => (
                <ArticleCard
                  post={post}
                  key={post.slug}
                  tagsEmphasizing={[]}
                  allEmphasizing={false}
                  linkable={false}
                />
              ))}
            </>
          ) }
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
