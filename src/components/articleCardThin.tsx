import Link from 'next/link'
import { PostType } from '../types/post'
import ArticleDate from './articleDate'
import styles from './articleCard.module.css'

const ArticleCard = ({ post, tagsEmphasizing, allEmphasizing, linkable }: { post: PostType, tagsEmphasizing: string[], allEmphasizing: boolean, linkable: boolean }) => {
    return (
        <section className={styles.articleCardThin}>
            <Link href={"/posts/" + post.slug}>
                <div className={styles.articleLink}>
                    <ArticleDate post={post} small historyDisplayable={false} />
                    <div className={styles.articleTitleThin}>{post.title}</div>
                </div>
            </Link>
        </section>
    )
}
export default ArticleCard
