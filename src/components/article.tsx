import { PostType } from '../types/post'
import Tags from './tags'
import ArticleDate from './articleDate'
import Shadow from 'react-shadow'

const Article = ({post}: {post: PostType}) => {
    return (
      <article style={({ marginBottom: '48px'})}>
          <div className="article-header" style={{marginBottom: "48px"}}>
            <ArticleDate post={post}/>
            <h1 className="article-title" style={{margin: '0px'}}>{post.title || ''}</h1>
            <Tags tags={post.tags ?? []} tagsEmphasizing={[]} allEmphasizing={true} linkable={true} inArticleHeader={true} />
          </div>
          <Shadow.div>
            <style>{`
            #footnote-label {
              display: none;
            }
  a {
      color: #406599;
      text-decoration: none;
      -webkit-tap-highlight-color: transparent;
      -webkit-text-decoration-skip: objects;
      -moz-text-decoration-skip: objects;
      text-decoration-skip: objects;
  }

  a:hover {
      text-decoration: underline;
  }

  hr {
      border-top: 1px solid #dddddd;
      border-bottom: 0px;
      border-left: 0px;
      border-right: 0px;
  }


  img {
      width: 100%;
  }

  pre {
      font-size: 12px;
      background-color: #f3f3f3;
      border-radius: 12px;
      padding: 12px;
      /* 横方向にはみ出す場合のみスクロールさせる */
      overflow-x: auto;
  }

  /* 記事ページ */
  .twitter-tweet {
      /* 埋め込みツイートをセンタリング */
      margin: 0 auto;
      padding: 24px 0;
  }

  .remark-code-title {
      font-size: 12px;
      position: absolute;
      float: left;
      right: -0px;
      padding-top: 12px;
      padding-right: 24px;
      padding-left: 24px;
      margin-right: 12px;
      padding-bottom: 6px;
      background: #ffffff;
      border-radius: 0px 10px 1px 10px;
      border: solid 1px #eeeeee;
  }
  .remark-code-title:hover {
      opacity: 0.5;
      color: rgba(0,0,0,0)

  }
  .remark-code-title::selection {
      color:#000000;
      background-color: #ffffff;
  }

  .hljs {
      background-color: #f3f3f3 !important;
      margin: -12px;
      padding: 12px !important;

  }
  .footnotes {
      margin-top: 36px;
      border-top: 1px solid #dddddd;
      border-bottom: 1px solid #dddddd;
      font-size: 12px;
      padding-right: 24px;
  }

  .footnotes hr {
      border: none;
  }

  .footnotes p {
    margin: 0;
  }

  blockquote {
      padding: .95em;
      border-radius: 6px;
      border-left: 6px solid #fee450;
      background-color: #fbf8e8;
      margin:12px 0px;
  }

  blockquote p {
      margin:0px;
  }

  h1 {
      margin-top: 60px;
  }
  h2 {
      margin-top: 48px;
  }
  h3 {
      margin-top: 36px;
  }
  h4 {
      margin-top: 24px;
  }

  ul, ol {
      padding-left: 36px;
  }

  ul li, ol li {
      padding-left: 12px;
  }

  table {
      border-spacing: 0;
      border-collapse: collapse;
      display: block;
      width: 100%;
      overflow: auto;
  }

  table tr {
      border: 0;
  }

  table th {
      font-weight: 700;
  }

  table td,
  table th {
      min-width: 86px;
      padding: 6px 13px;
      border: 1px solid #e6e6e6;
  }

  table th:empty {
      padding: 0;
      border: 0;
  }

  p {
      margin: 32px 0px;
  }

              `}
            </style>
            <div className="article-body"
              dangerouslySetInnerHTML={{ __html: post.html || '' }}
            />
          </Shadow.div>
      </article>
    )
};

export default Article;
