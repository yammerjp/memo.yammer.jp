import Link from 'next/link'
import { PostType } from '../types/post'
import Tags from './tags'
import ArticleDate from './articleDate'
import styles from './articleCard.module.css'

const ArticleCard = ({ post, tagsEmphasizing, allEmphasizing, linkable }: { post: PostType, tagsEmphasizing: string[], allEmphasizing: boolean, linkable: boolean }) => {
    return (
        <section className={styles.articleCard}>
            <Link href={"/posts/" + post.slug}>
                <div className={styles.articleLink}>
                    <ArticleDate post={post} historyDisplayable={false} />
                    <div className={styles.articleTitle}>{post.title}</div>
                    <div className={styles.articleDescription}>{post.description || ''}</div>
                </div>
            </Link>
            <Tags tags={post.tags ?? []} tagsEmphasizing={tagsEmphasizing} allEmphasizing={allEmphasizing} linkable={linkable} inArticleHeader={false}/>
        </section>
    )
}
export default ArticleCard
