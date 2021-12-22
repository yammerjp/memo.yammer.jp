import Link from 'next/link'

const NeighborArticles = ({prev, next}: {prev: ItemWithoutContents|null, next: ItemWithoutContents|null}) => {
    return (
        <div className="neighbor-articles">
           <div className="neighbor-articles-prev-and-next">
                {(prev === null) ? (<div className="neighbor-articles-2prev empty"></div>) : (
                    <Link href={prev.url}>
                        <div className="neighbor-articles-2prev">
                            <div className="neighbor-articles-pretitle">
                                <img className="tabler-icon-in-text" src="/assets/tabler-icon-chevron-left.svg"/>
                                古い記事
                            </div>
                            <div className="neighbor-articles-title">{prev.title}</div>
                        </div>
                    </Link>
                )}
                {(next === null) ? (<div className="neighbor-articles-2next empty"></div>) : (
                    <Link href={next.url}>
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