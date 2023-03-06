import { PostType } from '../types/post'
import Tags from './tags'
import ArticleDate from './articleDate'
import ArticleStyle from './articleStyle'
import { useEffect } from 'react'

const Article = ({ post }: { post: PostType }) => {
  useEffect(() => {
    ;(window as any).twttr?.widgets?.load(window.document.body)
    ;(window as any).twttrShoudLoad = true
  })

  return (
    <article style={{ marginBottom: '48px' }}>
      <div className='article-header' style={{ marginBottom: '48px' }}>
        <ArticleDate post={post} />
        <h1 style={{ margin: '0px' }}>{post.title || ''}</h1>
        <Tags
          tags={post.tags ?? []}
          tagsEmphasizing={[]}
          allEmphasizing={true}
          linkable={true}
          inArticleHeader={true}
        />
      </div>
      <div id='shadow-dom-root'>
        <ArticleStyle />
        <div className='article-body' dangerouslySetInnerHTML={{ __html: post.html || '' }} />
      </div>
    </article>
  )
}

export default Article
