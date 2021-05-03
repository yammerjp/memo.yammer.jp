const Tags = ({tags, tagsEmphasizing}: {tags: string[], tagsEmphasizing: string[]}) => {
    if (!tags || !(tags.length > 0)) {
        return (<div/>);
    }
    return (
        <div className="article-tags">
        {
            tags.map((tag:string) => (
                <span
                    key={tag}
                    className={ "article-tag" + (tagsEmphasizing.find(t=>t===tag) ? " article-tag-emphasizing": " article-tag-unemphasizing") }>
                        {tag}
                </span>
            ))
         }
        </div>
    )
}

export default Tags;