import { iso8601toDisplayStr } from '../lib/date'
import {PostHistoryType} from '../types/post'
const PostHistory = ({history}: {history: PostHistoryType | undefined}) => {
    if (!history) {
        return (<></>)
    }
    return ( <>
      {
        history.sort((a,b) => a.date > b.date ? 1:-1 ).map(({date, hash, message}) => (
          <div key={hash}>
            <a href={"https://github.com/basd4g/memo.basd4g.net/commit/" + hash} target="_blanck">
                {iso8601toDisplayStr(date)}
            </a>
            ...
            <span className="commit-message">{message}</span>
          </div>

        ))
      }
    </>)
}

export default PostHistory