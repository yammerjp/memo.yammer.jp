import Head from 'next/head'
import { getAllPosts } from '../lib/api'
import { PostType } from '../types/post'
import Frame from '../components/frame'
import ArticleCard from '../components/articleCard'
import 'highlight.js/styles/github.css'
import TagsSelector from '../components/tagsSelector'
import { useState } from 'react'


type Props = {
  allPosts: PostType[]
}


const Index = ({ allPosts }: Props) => {
  const tagsAll = allPosts.flatMap(post => post.tags ?? []);
  const [tagsSelected, setTagsSelected] = useState<string[]>([]);
  const clickedTag = (tagName: string, willbeSelected: boolean) => {
    setTagsSelected((before: string[]) => {
      if (willbeSelected) {
        return [...before, tagName];
      }
      return before.filter(t => t != tagName);
    })
  }

  const postsSelected = allPosts
    .filter(post => {
      if (tagsSelected.length == 0) {
        return false
      }
      return tagsSelected.every(t => (post.tags && post.tags.includes(t)))
    })
    .sort((a,b)=>{
            return a.date < b.date ? 1 : -1
    })

    let elementsPostsSelected: JSX.Element;
    if (tagsSelected.length === 0) {
      elementsPostsSelected = (<div className="article-cards-message">タグを選んでください</div>)
    } else if (postsSelected.length === 0) {
      elementsPostsSelected = ( <div className="article-cards-message">選択したタグをすべて含む記事はみつかりませんでした</div>)
    } else {
    elementsPostsSelected = (
        <>
          { postsSelected.map(post => (
              <ArticleCard post={post} key={post.slug} tagsEmphasizing={tagsSelected}/>
          )) }
        </>
      )
    }

  return (
    <>
    <Head>
        <title>memo.basd4g.net - 常に完成形</title>
    </Head>
    <Frame titleIsH1={true}>
      <div className="article-tags-selector-wrap">
        <h2>記事をタグで絞り込む</h2>
        <hr/>
        <TagsSelector tagsAll={tagsAll} tagsSelected={tagsSelected} clickedTag={clickedTag}/>
        <hr/>
      </div>
      <div>
        {elementsPostsSelected}
      </div>
    </Frame>
    </>
    )
}

export default Index

export const getStaticProps = async () => {
  const allPosts = await getAllPosts([
    'title',
    'date',
    'slug',
    'tags',
    'description',
  ])
  return {
    props: { allPosts },
  }
}
