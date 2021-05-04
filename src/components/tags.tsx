import Link from 'next/link'
const Tags = ({tags, tagsEmphasizing, linkable}: {tags: string[], tagsEmphasizing: string[], linkable: boolean}) => {
    if (!tags || !(tags.length > 0)) {
        return (<div/>);
    }
    return (
        <div className="article-tags">
            {
                tags.map((tag: string) => {
                    if (linkable) {
                        return (
                            <Link href={"/tags?tags=" + tag} key={tag}>
                                <span
                                    key={tag}
                                    className={"article-tag linkable" + (tagsEmphasizing.find(t => t === tag) ? " article-tag-emphasizing" : " article-tag-unemphasizing")}>
                                    {tag}
                                </span>

                            </Link>

                        );
                    }
                    return (
                        <span
                            key={tag}
                            className={"article-tag" + (tagsEmphasizing.find(t => t === tag) ? " article-tag-emphasizing" : " article-tag-unemphasizing")}>
                            {tag}
                        </span>
                    )
            })
         }
        </div>
    )
}

export default Tags;