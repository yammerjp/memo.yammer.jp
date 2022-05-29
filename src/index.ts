import { promises } from 'fs'
const { writeFile } = promises
import { getStaticPostBySlug, getPostBySlug, getAllPosts, getNeighborPosts } from './lib/api'

(async () => {
  const posts = await  getAllPosts([ 'title', 'date', 'slug', 'content', 'tags', 'html', 'description', 'history', 'ogImage'])
  await writeFile(`${process.cwd()}/posts.json`, JSON.stringify(posts))
})()
