import Link from 'next/link'
import {iso8601toDisplayStr} from '../lib/date'
import Tags from './tags'

const ArticleCard = ({ item, tagsEmphasizing, allEmphasizing, linkable }: { item: ItemWithoutContents, tagsEmphasizing: string[], allEmphasizing: boolean, linkable: boolean }) => {
    return (
        <section className="article-card">
            <Link href={item.url}>
                <div className="article-link">
                    <div className="article-date">{iso8601toDisplayStr(item.date_published)}</div>
                    <div className="article-title">{item.title}</div>
                    <div className="article-card-left">
                        <div className="article-description">{item.summary || ''}</div>
                    </div>
                </div>
            </Link>
            <Tags tags={item.tags ?? []} tagsEmphasizing={tagsEmphasizing} allEmphasizing={allEmphasizing} linkable={linkable}/>
        </section>
    )
}
export default ArticleCard