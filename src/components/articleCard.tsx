import Link from 'next/link'
import PostType from '../types/post'
import {iso8601toDisplayStr} from '../lib/date'
import Tags from './tags'
const ArticleCard = ({ post }: { post: PostType} ) => {
    return (
        <section className="article-card">
            <div className="article-date">{iso8601toDisplayStr(post?.date)}</div>
            <div>
                <Link href={"/posts/"+ post.slug}>{post.title}</Link>
            </div>
            <Tags tags={post.tags}/>
            <div className="article-description">
                {post.description || ''}
            </div>
        </section>
    )
}
export default ArticleCard