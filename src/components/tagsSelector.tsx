const TagsSelector = ({tagsAll, tagsSelected, clickedTag}: {tagsAll: string[], tagsSelected: string[], clickedTag: (tagName: string, willbeSelected: boolean)=>void}) => {
    return (
        <div className="article-tags-selector">
        {
            Array.from(new Set(tagsAll)).sort().map((tag:string) => {
                const selected = tagsSelected.includes(tag);
                return (
                    <button key={tag}
                      className={"article-tag " + (selected ? "selected" : "unselected")}
                      onClick={ ()=>clickedTag(tag, !selected) }>
                        {tag}
                    </button>
                )
            })
         }
        </div>
    )
}

export default TagsSelector;