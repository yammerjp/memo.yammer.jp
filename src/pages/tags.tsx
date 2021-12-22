import Head from 'next/head'
import { getJsonFeedWithoutContents } from '../lib/api'
import Frame from '../components/frame'
import ArticleCard from '../components/articleCard'
import 'highlight.js/styles/github.css'
import TagsSelector from '../components/tagsSelector'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Ogp from '../components/ogp'
import { OgImageUrlInText } from '../lib/cloudinaryOgp'

type Props = {
  feed: FeedWithoutContents
}

const queryTags2tagArr = (tags : string | string[] | undefined) => {
    if (!tags) {
      return []
    }
    if (typeof tags !== 'string') {
      return tags.sort();
    }
    if (tags.includes(',')) {
      return decodeURIComponent(tags).split(',').sort();
    } 
    return [decodeURIComponent(tags)]
}

const Index = ({ feed }: Props) => {
  const tagsAll = feed.items.flatMap(item => item.tags ?? []);
  const [tagsSelected, setTagsSelected] = useState<string[]>([]);
  const [queryLoadingIsEnabled, setQueryLoadingIsEnabled] = useState<boolean>(true);
  const router = useRouter()

  useEffect(()=>{
    // URLクエリパラメータを読み込んでtagsSelectedのステートに反映
    // ただしURLクエリパラメータはページ遷移後の初回レンダリングやクエリ書き換え後の初回レンダリングでは正しく反映されない
    // そのため、外からクエリパラメータ付きで飛んできた時のみ、このuseEffectでステートに反映される
    // GUIをクリックしてユーザがステートを変更したら、 queryLoadingIsEnabled を false にして、以降はページ遷移までクエリパラメータを一方的に書き換えるだけとする
    if (!queryLoadingIsEnabled) {
      return;
    }

    const tagsArr = queryTags2tagArr(router.query.tags);
    if (tagsArr.sort().join(',') === tagsSelected.sort().join(',')) {
      return;
    }
    setTagsSelected(tagsArr);
    // console.log(`${tagsArr} is set`);
  })

  const clickedTag = (tag: string, willbeSelected: boolean) => {
    // clickedTagが1回以上発火したら queryLoadingIsEnabledをfalseにしてクエリパラメータの読み込みを禁止する
    if (queryLoadingIsEnabled) {
      setQueryLoadingIsEnabled(false);
    }

    // console.log(`${tag} will be ${willbeSelected}`);
    // router.push() するとページ遷移扱いになってスクロール位置が一番上になってしまうので使用を避けている
    // router.push() を使わないためにクエリパラメータの読み込みを初回以降は禁止するという面倒な処理をしている
    setTagsSelected(before => {
      const removed = before.filter(t => t !== tag);
      let newTags : string[] = [];
      if (willbeSelected) {
        newTags = [...removed, tag].sort();
      } else {
        newTags = removed.sort();
      }
      history.replaceState(null, '', location.pathname + ( newTags.length > 0 ? "?tags=" + newTags.join(','): ''))
      return newTags
    })
  }

  const itemsSelected = feed.items 
    .filter(item => {
      if (tagsSelected.length == 0) {
        return false
      }
      return tagsSelected.every(t => (item.tags && item.tags.includes(t)))
    })
    .sort((a,b)=>{
            return (a.date_published||'') < (b.date_published||'') ? 1 : -1
    })

  return (
    <>
    <Head>
        <title>{feed.title} - {feed.description}</title>
        <Ogp
          title={`記事をタグで絞り込む - ${feed.title}`} url={`${feed.home_page_url}/tags`} description="記事をタグで絞り込む" ogImage={OgImageUrlInText(feed.title)} ogType="website"/>

    </Head>
    <Frame titleIsH1={true}>
      <div className="article-tags-selector-wrap">
        <h2>記事をタグで絞り込む</h2>
        <hr/>
        <TagsSelector tagsAll={tagsAll} tagsSelected={tagsSelected} clickedTag={clickedTag}/>
        <hr/>
      </div>
      <div>
          {(() => {
            if (tagsSelected.length === 0) {
              return (<div className="article-cards-message">タグを選んでください</div>)
            } else if (itemsSelected.length === 0) {
              return (<div className="article-cards-message">選択したタグをすべて含む記事はみつかりませんでした</div>)
            } else {
              return (
                <>
                  {itemsSelected.map(item => (
                    <ArticleCard item={item} key={item.id} tagsEmphasizing={tagsSelected} allEmphasizing={false} linkable={false}/>
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

export const getStaticProps = async (): Promise<{props: Props}> => {
  return {
    props: {
      feed: await getJsonFeedWithoutContents()
    }
  }
}