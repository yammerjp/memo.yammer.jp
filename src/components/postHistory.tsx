import { iso8601toDisplayStr } from '../lib/date'
import {PostHistoryType} from '../types/post'
const PostHistory = ({history}: {history: PostHistoryType | undefined}) => {
    if (!history) {
        return (<></>)
    }
    return ( <div className="article-history-with-git" style={{marginBottom: "14px"}}>
      {
        history.sort((a,b) => a.date > b.date ? 1:-1 ).map(({date, hash, message}) => (
          <div key={hash}>
            <a href={"https://github.com/yammerjp/memo.yammer.jp/commit/" + hash} target="_blanck">
                {iso8601toDisplayStr(date)}
            </a>
            ...
            <span className="commit-message">{message}</span>
          </div>

        ))
      }
    </div>)
}

export default PostHistory
