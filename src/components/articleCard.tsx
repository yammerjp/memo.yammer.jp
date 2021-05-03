import Link from 'next/link'
import PostType from '../types/post'
import {iso8601toDisplayStr} from '../lib/date'
import Tags from './tags'
const ArticleCard = ({ post, tagsEmphasizing }: { post: PostType, tagsEmphasizing: string[] } ) => {
    return (
        <section className="article-card">
            <div className="article-date">{iso8601toDisplayStr(post?.date)}</div>
            <div>
                <Link href={"/posts/"+ post.slug}>{post.title}</Link>
            </div>
            <div className="article-description">
                {post.description || ''}
            </div>
            <Tags tags={post.tags ?? []} tagsEmphasizing={tagsEmphasizing}/>
        </section>
    )
}
export default ArticleCard