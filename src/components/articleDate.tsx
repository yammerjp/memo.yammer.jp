import { useState } from 'react'
import { iso8601toDisplayStr } from '../lib/date'
import PostHistory from './postHistory'
const ArticleDate = ({ item }: { item: Item }) => {
  const [historyVisible, setHistoryVisible] = useState<boolean>(false);
  const onClick = () => {
    setHistoryVisible(before => !before)
  }
  return (
    <div className="article-date">
      { item.date_published ? iso8601toDisplayStr(item.date_published) : ''}
      {
        (() => {
          if (item._change_logs && item._change_logs.length >= 2) {
            return (
              <>
                <span className="hyphen">-</span>
                <button className={"article-date-edited" + ( historyVisible ? ' history-visible' : '')} onClick={onClick}>edited</button>
                { historyVisible ? ( <PostHistory changeLogs={item._change_logs} />) : (<></>) }
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