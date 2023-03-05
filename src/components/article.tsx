import { PostType } from '../types/post'
import Tags from './tags'
import ArticleDate from './articleDate'
import ArticleStyle from './articleStyle'
import { useEffect } from 'react'

const Article = ({ post }: { post: PostType }) => {
  useEffect(() => {
    const shadowRoot = document.querySelector('#shadow-dom-root')?.shadowRoot
    if (!shadowRoot) {
      return
    }
    const eventListener = (event: Event) => {
      const element = event.target as HTMLElement
      if (element.tagName !== 'A') {
        return true
      }
      const href = element.getAttribute('href') ?? ''
      if (!/^#/.test(href)) {
        return true
      }
      const anchorName = href.substring(1)
      const theNameElements = shadowRoot.querySelectorAll(`[name=${anchorName}], #${anchorName}`)
      if (theNameElements.length > 0) {
        theNameElements[0].scrollIntoView()
        event.preventDefault()
        return false
      }
      return true
    }
    shadowRoot.addEventListener('click', eventListener)
    return () => {
      shadowRoot.removeEventListener('cilck', eventListener)
    }
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
