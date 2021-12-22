import Tags from './tags'
import ArticleDate from './articleDate'
const Article = ({item}: {item: Item}) => {
    return (
      <article>
          <div className="article-header">
            <ArticleDate item={item}/>
            <h1 className="article-title">{item.title || ''}</h1>
            <Tags tags={item.tags ?? []} tagsEmphasizing={[]} allEmphasizing={true} linkable={true}/>
          </div>
          <div className="article-body"
            dangerouslySetInnerHTML={{ __html: item.content_html || '' }}
          />
      </article>
    )
};

export default Article;