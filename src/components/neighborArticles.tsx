import Link from 'next/link'
import { PostType } from '../types/post'

const NeighborArticles = ({prev, next}: {prev: PostType|null, next: PostType|null}) => {
    return (
        <div className="neighbor-articles">
           <div className="neighbor-articles-prev-and-next">
                {(prev === null) ? (<div className="neighbor-articles-2prev"></div>) : (
                    <Link href={"/posts/" + prev.slug}>
                        <div className="neighbor-articles-2prev">
                            <div className="neighbor-articles-pretitle">
                                <img className="tabler-icon-in-text" src="/assets/tabler-icon-chevron-left.svg"/>
                                古い記事
                            </div>
                            <div className="neighbor-articles-title">{prev.title}</div>
                        </div>
                    </Link>
                )}
                {(next === null) ? (<div className="neighbor-articles-2next"></div>) : (
                    <Link href={"/posts/" + next.slug}>
                        <div className="neighbor-articles-2next">
                            <div className="neighbor-articles-pretitle">
                                新しい記事
                                <img className="tabler-icon-in-text" src="/assets/tabler-icon-chevron-right.svg"/>
                                </div>
                            <div className="neighbor-articles-title">{next.title}</div>
                        </div>
                    </Link>
                )}
            </div>
        </div>
    )
}
export default NeighborArticles