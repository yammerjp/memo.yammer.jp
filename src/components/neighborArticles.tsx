import Link from 'next/link'
import { PostType } from '../types/post'
import styles from './neighborArticles.module.css'

const NeighborArticles = ({prev, next}: {prev: PostType|null, next: PostType|null}) => {
    return (
        <div className={styles.neighborArticles}>
           <div className={styles.neighborArticlesPrevAndNext}>
                {(prev === null) ? (<div className={styles.neighborArticles2prev}></div>) : (
                    <Link href={"/posts/" + prev.slug}>
                        <div className={styles.neighborArticles2prev}>
                            <div className={styles.neighborArticlesPretitle}>
                                <img className={styles.tablerIconInText} src="/assets/tabler-icon-chevron-left.svg"/>
                                古い記事
                            </div>
                            <div className={styles.neighborArticlesTitle}>{prev.title}</div>
                        </div>
                    </Link>
                )}
                {(next === null) ? (<div className={styles.neighborArticles2next}></div>) : (
                    <Link href={"/posts/" + next.slug}>
                        <div className={styles.neighborArticles2next}>
                            <div className={styles.neighborArticlesPretitle}>
                                新しい記事
                                <img className={styles.tablerIconInText} src="/assets/tabler-icon-chevron-right.svg"/>
                                </div>
                            <div className={styles.neighborArticlesTitle}>{next.title}</div>
                        </div>
                    </Link>
                )}
            </div>
        </div>
    )
}
export default NeighborArticles
