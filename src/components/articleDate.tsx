import { useState } from 'react'
import { PostType } from '../types/post'
import { iso8601toDisplayStr } from '../lib/date'
import ArticleHistory from './articleHistory'
const ArticleDate = ({ post }: { post: PostType }) => {
  const [historyVisible, setHistoryVisible] = useState<boolean>(false);
  const onClick = () => {
    setHistoryVisible(before => !before)
  }
  return (
    <div className="article-date">
      { post.date ? iso8601toDisplayStr(post.date) : ''}
      {
        (() => {
          if (post.history && post.history.length >= 2) {
            return (
              <>
                <span className="hyphen">-</span>
                <button className={"article-date-edited" + ( historyVisible ? ' history-visible' : '')} onClick={onClick}>edited</button>
                { historyVisible ? ( <ArticleHistory history={post.history} />) : (<></>) }
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