import { PostType } from '../types/post'
import Tags from './tags'
import ArticleDate from './articleDate'
const Article = ({post}: {post: PostType}) => {
    return (
      <article>
          <div className="article-header">
            <ArticleDate post={post}/>
            <h1 className="article-title">{post.title || ''}</h1>
            <Tags tags={post.tags ?? []} tagsEmphasizing={post.tags ?? []}/>
          </div>
          <div className="article-body"
            dangerouslySetInnerHTML={{ __html: post.html || '' }}
          />
      </article>
    )
};

export default Article;