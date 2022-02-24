import { useState } from 'react'
import { PostType } from '../types/post'
import { iso8601toDisplayStr } from '../lib/date'
import PostHistory from './postHistory'
const ArticleDate = ({ post }: { post: PostType }) => {
  const [historyVisible, setHistoryVisible] = useState<boolean>(false);
  const onClick = () => {
    setHistoryVisible(before => !before)
  }
  return (
    <div className="article-date" style={{ fontSize: "16px" }}>
    <style jsx>{`
button.article-date-edited {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    background-color: #ffffff;
    outline: none;
    border: none;
    font-size: 16px;
    color: #505050;
    margin: 0;
    padding: 0px 4px;
}
button.article-date-edited:hover {
    text-decoration: underline;
}
button.article-date-edited.history-visible {
    text-decoration: underline;
}
button.article-date-edited.history-visible:hover {
    text-decoration: none;
}

    `}
    </style>
      { post.date ? iso8601toDisplayStr(post.date) : ''}
      {
        (() => {
          if (post.history && post.history.length >= 2) {
            return (
              <>
              <span className="hyphen" style={{display: "inline-block", margin: "0px 4px 0px 8px"}}>-</span>
                <button className={"article-date-edited" + ( historyVisible ? ' history-visible' : '')} onClick={onClick}>edited</button>
                { historyVisible ? ( <PostHistory history={post.history} />) : (<></>) }
              </>
            )
          } else {
            return (<></>)
          }
        })()
      }
    </div>
  )
};

export default ArticleDate;
