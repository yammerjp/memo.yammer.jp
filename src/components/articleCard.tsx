import PostType from '../types/post'
import {iso8601toDisplayStr} from '../lib/date'
const ArticleCard = ({ post }: { post: PostType} ) => {
    return (
        <section className="article-card">
              <div>
                <a href={"/posts/"+ post.slug}>{post.title}</a>
              </div>
              <div>
                <small>{iso8601toDisplayStr(post.date)}</small>
              </div>
        </section>
    )
}
export default ArticleCard