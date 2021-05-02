import PostType from '../types/post'
import { iso8601toDisplayStr } from '../lib/date'
const Article = ({post}: {post: PostType}) => {
    return (
      <article>
          <div className="article-header">
            <div className="article-date">{iso8601toDisplayStr(post?.date)}</div>
            <h1 className="article-title">{post?.title || ''}</h1>
            {
              post?.tags?.length && post.tags.length > 0 ? (
                post.tags.map((tag:string)=> (
                  <span className="article-tag">{tag}</span>
                ))
              ) : ('')
            }
          </div>
          <div className="article-body"
            dangerouslySetInnerHTML={{ __html: post?.html || '' }}
          />
      </article>
    )
};

export default Article;