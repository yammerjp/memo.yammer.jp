import Link from 'next/link'
import { PostType } from '../types/post'
import {iso8601toDisplayStr} from '../lib/date'
import Tags from './tags'

const ArticleCard = ({ post, tagsEmphasizing }: { post: PostType, tagsEmphasizing: string[] }) => {
    return (
        <section className="article-card">
            <Link href={"/posts/" + post.slug}>
                <div className="article-link">
                    <div className="article-date">{iso8601toDisplayStr(post?.date)}</div>
                    <div className="article-title">{post.title}</div>
                    <div className="article-card-left">
                        <div className="article-description">{post.description || ''}</div>
                    </div>
                </div>
            </Link>
            <Tags tags={post.tags ?? []} tagsEmphasizing={tagsEmphasizing} />
        </section>
    )
}
export default ArticleCard