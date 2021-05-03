const Tags = ({tags}: {tags: string[] | undefined}) => {
    if (!tags || !(tags.length > 0)) {
        return (<div/>);
    }
    return (
        <div>
        {
            tags.map((tag:string) => (
                <span className="article-tag">{tag}</span>
            ))
         }
        </div>
    )
}

export default Tags;