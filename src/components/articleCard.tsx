import PostType from '../types/post'
const ArticleCard = ({ post }: { post: PostType} ) => {
    return (
        <section>
              <div>
                <a href={"/posts/"+ post.slug}>{post.title}</a>
              </div>
              <div>
                <small>(posted: {post.date})</small>
              </div>
        </section>
    )
}
export default ArticleCard