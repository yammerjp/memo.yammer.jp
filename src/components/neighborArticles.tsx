import Link from 'next/link'
import Image from 'next/image'
import { PostType } from '../types/post'
import styles from './neighborArticles.module.css'

const NeighborArticles = ({prev, next}: {prev: PostType|null, next: PostType|null}) => {
    return (
        <div className={styles.neighborArticles}>
           <div className={styles.neighborArticlesPrevAndNext}>
                {(prev === null) ? (<div className={styles.neighborArticles2prev}></div>) : (
                    <Link href={"/posts/" + prev.slug} passHref>
                      <a className={styles.neighborArticles2prev}>
                            <div className={styles.neighborArticlesPretitle}>
                                <Image src="/assets/tabler-icon-chevron-left.svg" width="10px" height="10px" alt="left arrow"/>
                                古い記事
                            </div>
                            <div className={styles.neighborArticlesTitle}>{prev.title}</div>
                      </a>
                    </Link>
                )}
                {(next === null) ? (<div className={styles.neighborArticles2next}></div>) : (
                    <Link href={"/posts/" + next.slug} passHref>
                        <a className={styles.neighborArticles2next}>
                            <div className={styles.neighborArticlesPretitle}>
                                新しい記事
                                <Image src="/assets/tabler-icon-chevron-right.svg" width="10px" height="10px" alt="right arrow"/>
                                </div>
                            <div className={styles.neighborArticlesTitle}>{next.title}</div>
                      </a>
                    </Link>
                )}
            </div>
        </div>
    )
}
export default NeighborArticles
