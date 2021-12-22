import Link from 'next/link'
import {iso8601toDisplayStr} from '../lib/date'
import Tags from './tags'

const ArticleCard = ({ item, tagsEmphasizing, allEmphasizing, linkable }: { item: ItemWithoutContents, tagsEmphasizing: string[], allEmphasizing: boolean, linkable: boolean }) => {
    return (
        <section className="article-card thin">
            <Link href={item.url}>
                <div className="article-link">
                    <div className="article-date">{iso8601toDisplayStr(item.date_published)}</div>
                    <div className="article-title thin">{item.title}</div>
                </div>
            </Link>
        </section>
    )
}
export default ArticleCard