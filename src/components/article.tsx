import { ReactNode, FunctionComponent} from 'react'
import PostType from '../types/post'
const Frame = ({post}: {post: PostType}) => {
    return (
      <article>
          <h1>{post?.title || ''}</h1>
          <div
            dangerouslySetInnerHTML={{ __html: post?.html || '' }}
          />
          <a href="/">Back to home</a>
      </article>
    )
};

export default Frame;