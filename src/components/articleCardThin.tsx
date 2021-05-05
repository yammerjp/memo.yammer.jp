import Link from 'next/link'
import { PostType } from '../types/post'
import {iso8601toDisplayStr} from '../lib/date'
import Tags from './tags'

const ArticleCard = ({ post, tagsEmphasizing, allEmphasizing, linkable }: { post: PostType, tagsEmphasizing: string[], allEmphasizing: boolean, linkable: boolean }) => {
    return (
        <section className="article-card thin">
            <Link href={"/posts/" + post.slug}>
                <div className="article-link">
                    <div className="article-date">{iso8601toDisplayStr(post?.date)}</div>
                    <div className="article-title thin">{post.title}</div>
                </div>
            </Link>
        </section>
    )
}
export default ArticleCard