import Link from 'next/link'
const Tags = ({tags, tagsEmphasizing, allEmphasizing, linkable, inArticleHeader}: {tags: string[], tagsEmphasizing: string[], allEmphasizing: boolean, linkable: boolean, inArticleHeader: boolean}) => {
    if (!tags || !(tags.length > 0)) {
        return (<div/>);
    }
    const tagDom = (tag: string) => (
        <span
            key={tag}
            className={"article-tag linkable" + (allEmphasizing || tagsEmphasizing.find(t => t === tag) ? " article-tag-emphasizing" : " article-tag-unemphasizing")}
            style={inArticleHeader ? {margin: "0px 6px 6px 0px"} : {}}
        >
            {tag}
        </span>
    )

    return (
        <div className="article-tags">
            {
                tags.map((tag: string) => {
                    if (linkable) {
                        return (
                            <Link href={"/tags?tags=" + tag} key={tag}>
                                {tagDom(tag)}
                            </Link>
                        );
                    }
                    return tagDom(tag)
                })
            }
        </div>
    )
}

export default Tags;
