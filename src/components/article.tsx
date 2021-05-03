import PostType from '../types/post'
import { iso8601toDisplayStr } from '../lib/date'
import Tags from './tags'
const Article = ({post}: {post: PostType}) => {
    return (
      <article>
          <div className="article-header">
            <div className="article-date">{iso8601toDisplayStr(post?.date)}</div>
            <h1 className="article-title">{post?.title || ''}</h1>
            <Tags tags={post.tags ?? []} tagsEmphasizing={post.tags ?? []}/>
          </div>
          <div className="article-body"
            dangerouslySetInnerHTML={{ __html: post?.html || '' }}
          />
      </article>
    )
};

export default Article;