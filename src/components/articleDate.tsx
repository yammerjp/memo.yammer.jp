import { useState } from 'react'
import { PostType } from '../types/post'
import { iso8601toDisplayStr } from '../lib/date'
import PostHistory from './postHistory'
const ArticleDate = ({ post }: { post: PostType }) => {
  const [historyVisible, setHistoryVisible] = useState<boolean>(false);
  const onClick = () => {
    setHistoryVisible(before => !before)
  }

  const articleDateEditedStyles = {
    fontFamily: "Avenir, Helvetica, Arial, sans-serif",
    backgroundColor: "#ffffff",
    outline: "none",
    border: "none",
    fontSize: "16px",
    color: "#505050",
    margin: 0,
    padding: "0px 4px",
    "&:hover": {
      textDecoration: "underline"
    }
  }

  const articleDateEditedHistoryVisibleStyles = {
    textDecoration: "underline",
    "&:hover": {
      textDecoration: "none",
    }
  }
  return (
    <div className="article-date" style={{fontSize: "16px"}}>
      {
          post.date && iso8601toDisplayStr(post.date)
      }
      {
          (post.history && post.history.length >= 2) && (
              <>
                <span className="hyphen" style={{display: "inline-block", margin: "0px 4px 0px 8px"}}>-</span>
                <button
                  style={{...articleDateEditedStyles, ...(historyVisible && articleDateEditedHistoryVisibleStyles)}}
                  onClick={onClick}
                  >edited</button>
                { historyVisible && ( <PostHistory history={post.history} />) }
              </>
          )
      }
    </div>
  )
};

export default ArticleDate;
