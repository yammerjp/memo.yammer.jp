import Tag from './tag'

// sorting function
const mixedUpperLower = (a: string, b: string): number => {
  if (a.toUpperCase() > b.toUpperCase()) {
    return 1;
  }
  return -1;
}


const TagsSelector = ({tagsAll, tagsSelected, clickedTag}: {tagsAll: string[], tagsSelected: string[], clickedTag: (tagName: string, willbeSelected: boolean)=>void}) => {
    return (
        <div>
          {Array.from(new Set(tagsAll)).sort(mixedUpperLower).map((tagName:string) => {
                  const selected = tagsSelected.includes(tagName);
                  return (
                      <Tag key={tagName} tagName={tagName} selectable selected={selected} buttonClickHandler={()=>clickedTag(tagName, !selected)}/>
                  )
          })}
        </div>
    )
}

export default TagsSelector;
