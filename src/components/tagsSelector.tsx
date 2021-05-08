// sorting function
const mixedUpperLower = (a: string, b: string): number => {
  if (a.toUpperCase() > b.toUpperCase()) {
    return 1;
  }
  return -1;
}


const TagsSelector = ({tagsAll, tagsSelected, clickedTag}: {tagsAll: string[], tagsSelected: string[], clickedTag: (tagName: string, willbeSelected: boolean)=>void}) => {
    return (
        <div className="article-tags-selector">
        {
            Array.from(new Set(tagsAll)).sort(mixedUpperLower).map((tag:string) => {
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