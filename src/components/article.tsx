import PostType from '../types/post'
import { iso8601toDisplayStr } from '../lib/date'
const Article = ({post}: {post: PostType}) => {
    return (
      <article>
          <div className="article-header">
            <h1 className="article-title">{post?.title || ''}</h1>
            <div>{iso8601toDisplayStr(post?.date)}</div>
          </div>
          <div className="article-body"
            dangerouslySetInnerHTML={{ __html: post?.html || '' }}
          />
      </article>
    )
};

export default Article;