import Link from 'next/link'
import { PostType } from '../types/post'
import {iso8601toDisplayStr} from '../lib/date'
import Tags from './tags'

const ArticleCard = ({ post, tagsEmphasizing, allEmphasizing, linkable, thin}: { post: PostType, tagsEmphasizing: string[], allEmphasizing: boolean, linkable: boolean, thin:boolean }) => {
    return (
        <section className={thin ? "article-card thin" : "article-card"}>
            <Link href={"/posts/" + post.slug}>
                <div className="article-link">
                    <div className="article-date-in-card">{iso8601toDisplayStr(post?.date)}</div>
                    <div className={thin ? "article-title thin" : "article-title"}>{post.title}</div>
                    { thin ? (<></>) : (
                        <div className="article-description">{post.description || ''}</div>
                    )}
                </div>
            </Link>
            { thin ? (<></>) : (
                <Tags tags={post.tags ?? []} tagsEmphasizing={tagsEmphasizing} allEmphasizing={allEmphasizing} linkable={linkable} />
            )}
        </section>
    )
}
export default ArticleCard