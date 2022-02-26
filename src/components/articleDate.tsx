import { useState } from 'react'
import { PostType } from '../types/post'
import { iso8601toDisplayStr } from '../lib/date'
import PostHistory from './postHistory'
const ArticleDate = ({ post, historyDisplayable, small }: { post: PostType, historyDisplayable: boolean, small: boolean }) => {
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
    <div style={{fontSize: small ? "12px" : "16px"}}>
      {
          post.date && iso8601toDisplayStr(post.date)
      }
      {
          (historyDisplayable && post.history && post.history.length >= 2) && (
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

ArticleDate.defaultProps = {
  small: false,
  historyDisplayable: true
}

export default ArticleDate;
