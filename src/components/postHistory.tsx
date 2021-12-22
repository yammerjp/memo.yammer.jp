import { iso8601toDisplayStr } from '../lib/date'
const PostHistory = ({changeLogs}: {changeLogs: Item['_change_logs'] | undefined}) => {
    if (!changeLogs) {
        return (<></>)
    }
    return ( <div className="article-history-with-git">
      {
        changeLogs.sort((a,b) => (a.date_modified || '') > (b.date_modified || '') ? 1:-1 ).map(({date_modified, url, comment}) => (
          <div key={url}>
            <a href={url} target="_blanck">
                {iso8601toDisplayStr(date_modified)}
            </a>
            ...
            <span className="commit-message">{comment}</span>
          </div>
        ))
      }
    </div>)
}

export default PostHistory