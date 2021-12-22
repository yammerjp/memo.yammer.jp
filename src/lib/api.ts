import fs from 'fs/promises'
import { join } from 'path'
import matter from 'gray-matter'
import { exec } from 'child_process'
import axios from 'axios'

import markdownToHtml from './markdownToHtml'
import { markdownToDescription, markdownToText } from './markdownToDescription'
import { OgImageUrlInText } from './cloudinaryOgp'

import { PostHistoryType, PostType } from '../types/post'
import { data } from 'remark'

export async function getPostSlugs(): Promise<string[]> {
  const files = await fs.readdir(join(process.cwd(), 'content', 'posts'))
  return files.filter(f => /.*\.md/.test(f))
}

export async function getPostBySlug(slug: string, fields: string[] = []): Promise<PostType> {
  return getPostByDirectoryAndSlug(process.cwd(), join('content','posts'), slug, fields)
}

const execGitLogPromise: (fullPath: string)=> Promise<string> = (fullPath: string) => new Promise((resolve, reject) => {
    exec(`git log --format=COMMITIS%cd,%H,%s --date=iso8601-strict ${fullPath}`, (err, stdout, stderr)  => {
      if (err) {
        reject();
      }
      resolve(stdout);
    });
})
const gitLog2postHistory: (gitLog:string) => PostHistoryType = (gitLog: string) => {
    return gitLog.split('COMMITIS').slice(1).map( line => {
      const [date, hash, message] = line.split(',')
      return { date, message, hash }
    })
}

// アクセス先に負荷をかけ過ぎないよう最大5秒sleep (並列にアクセスしないのでよしとする)
const waitRandomTime5s = () => new Promise((resolve) => {
  const time = Math.random() * 5000
  setTimeout(resolve,  time)
  console.log(`wait:${time}ms`)
});

async function getPostHistoryByDirectoryAndSlug(rootDir: string, relativeDir: string, slug: string): Promise<PostHistoryType> {
  const realSlug = slug.replace(/\.md$/, '')
  const fullPath = join(rootDir, relativeDir, `${realSlug}.md`)
  const historyWithGit = await execGitLogPromise(fullPath).then(gitLog2postHistory);
  if (true || ['development', 'production'].includes(process.env.NODE_ENV)) {
    return historyWithGit;
  }
  const url = `https://raw.githubusercontent.com/yammerjp/blog.yammer.jp/gh-pages/gitlogs/${relativeDir}/${realSlug}.md`
  const historyWithFile = await waitRandomTime5s().then(() => axios.get(url)).then(res=>gitLog2postHistory(res.data)).catch(()=>[])
  console.log(`fetched from ${url}`)
  const historyWithFileAvailable = historyWithFile.filter(eF=> !historyWithGit.find(eG => eF.hash === eG.hash))
  return [...historyWithGit, ...historyWithFileAvailable].sort((a,b) => a.date > b.date ? 1 : -1)
}

async function getPostByDirectoryAndSlug(rootDir: string, relativeDir: string, slug_: string, fields: string[] = []): Promise<PostType> {
  const realSlug = slug_.replace(/\.md$/, '')
  const fullPath = join(rootDir, relativeDir, `${realSlug}.md`)
  const fileContents = await fs.readFile(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  const items: { [key: string]: string } = {}
  let slug = '';
  let title = '';
  let date = '';
  let html = '';
  let tags: string[] = [];
  let description = '';
  let history: PostHistoryType = [];
  let ogImage = '';
  let plaintext = '';

  // Ensure only the minimal needed data is exposed
  if (fields.includes('slug')) {
    slug = realSlug;
  }
  if (fields.includes('title')) {
    title = data['title']
  }
  if (fields.includes('date')) {
    date = data['date']
  }
  if (fields.includes('html')) {
    html = await markdownToHtml(content || '')
  }
  if (fields.includes('tags')) {
    tags = data['tags'] || []
  }
  if (fields.includes('description')) {
    description = await markdownToDescription(content || '')
  }
  if (fields.includes('history')) {
    history = await getPostHistoryByDirectoryAndSlug(rootDir, relativeDir, slug_)
  }
  if (fields.includes('ogImage')) {
    ogImage = data['ogImage'] || OgImageUrlInText(data['title'])
  }
  if (fields.includes('plaintext')) {
    plaintext = await markdownToText(content||'')
  }

  return { slug, title, date, html, tags, description, history, ogImage, plaintext, content }
}

export async function getAllPosts(fields: string[] = []) {
  const slugs = await getPostSlugs()
  const posts = await Promise.all(slugs
    .map((slug) => getPostBySlug(slug, fields)))
    // sort posts by date in descending order
  return posts.sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
}

export async function getNeighborPosts(slug: string, fields: string[] = [ 'slug' ]) {
  const allPosts = await getAllPosts(fields);
  const idx = allPosts.findIndex( post => post.slug === slug);
  if (idx === -1) {
    console.error("Need to specify EXISTING slug with calling getNeighborPosts()")
    return { next: null, prev: null}
  }
  return {
    next: (idx-1 >= 0) ? allPosts[idx-1] : null,
    prev: (idx+1 <= allPosts.length-1) ? allPosts[idx+1] : null,
  }
}

const author: Author = {
  name: "Keisuke Nakayama",
  url: "https://yammer.jp",
  avatar: '',
}

// const root_url = "https://memo.yammer.jp"
const root_url = "http://localhost:3000"

async function getAllPostsJsonFeed():Promise<Item[]> {
  // TODO: implements validator
  const oldTypePosts = await getAllPosts(['slug', 'title', 'date', 'html', 'tags', 'description', 'history', 'ogImage', 'markdown', 'plaintext']);
  return oldTypePosts.map(oldTypePostToItem);
}

async function getAllPostsItemsWithoutContents(): Promise<ItemWithoutContents[]> {
  const oldTypePosts = await getAllPosts(['slug', 'title', 'date', 'tags', 'description', 'history', 'ogImage'])
  return oldTypePosts.map(oldTypePostToItemWithoutContents)
}

function oldTypePostToItem(post: PostType): Item {
  return {
    ...oldTypePostToItemWithoutContents(post),
    content_html: post.html || '',
    content_text: post.plaintext,
  }
}

function oldTypePostToItemWithoutContents(post: PostType): ItemWithoutContents {
  const url = `${root_url}/posts/${post.slug}`;
  const historyNewOrder =  post.history?.sort((a,b) => a.date > b.date ? -1 : a.date === b.date ? 0 : 1) || [];
  return {
    id: url,
    url,
    title: post.title,
    summary: post.description,
    date_published: post.date,
    ...(historyNewOrder.length >= 2 && {date_modified: historyNewOrder[0].date}),
    banner_image: post.ogImage,
    // image
    tags: post.tags,
    language: 'ja',
    authors: [author],
    _change_logs: historyNewOrder.map(h => ({url: `https://github.com/yammerjp/memo.yammer.jp/commit/${h.hash}`, comment: h.message, date_modified:h.date}))
  }
}

const feedWithoutItems: FeedWithoutItems = {
  title: 'memo.yammer.jp',
  home_page_url: root_url,
  feed_url: `${root_url}/json_feed`,
  description: '常に完成形',
  authors: [author],
  language: 'ja',
  expired: false,
  _feed_url_rss2: `${root_url}/posts/index.xml`,
  // favicon
  // icon
  // next_url
}

let feed: Feed|undefined = undefined
export async function getJsonFeed(): Promise<Feed> {
  if (!feed) {
      feed = {
      ...feedWithoutItems,
      items: await getAllPostsJsonFeed(),
      version: 'https://jsonfeed.org/version/1.1',
    }
  }
  return feed;
}

function extractJsonFeedItem(feed: Feed, itemId: string): Item|null {
  const item = feed.items.find(item => item.id === itemId)
  if (!item) {
    return null
  }
  return item
}
export async function getJsonFeedItem(itemId: string): Promise<Item|null> {
  return extractJsonFeedItem(await getJsonFeed(), itemId)
}

export async function getJsonFeedItemBySlug(slug: string): Promise<Item|null> {
  const oldPost = await getPostBySlug(slug, ['slug', 'title', 'date', 'html', 'tags', 'description', 'history', 'ogImage', 'markdown', 'plaintext'])
  return oldTypePostToItem(oldPost)
}

function extractJsonFeedItemsWithoutContents(feed: Feed): ItemWithoutContents[] {
  return feed.items.map(({
    id, url, title, summary, image, banner_image, date_published, date_modified, authors, tags, language, _change_logs
  }) => ({
    id, url, title, summary, /*image,*/ banner_image, date_published, /*date_modified,*/ authors, tags, language, _change_logs
  }))
}

export async function getJsonFeedWithoutContents(): Promise<FeedWithoutContents> {
  return {
    ...feedWithoutItems,
    // items: extractJsonFeedItemsWithoutContents(await getJsonFeed())
    items: await getAllPostsItemsWithoutContents()
  }
}

export function extractNeighborItemsWithoutContents(feedWithoutContents: FeedWithoutContents, id: string): {prev: ItemWithoutContents|null, next: ItemWithoutContents|null} {
  const idx = feedWithoutContents.items.findIndex(item => item.id === id);
  if (idx === -1) {
    console.error("Need to specify EXISTING slug with calling extractNeighborItemsWithoutContents()")
    return { next: null, prev: null}
  }
  return {
    prev: (idx+1 <= feedWithoutContents.items.length-1) ? feedWithoutContents.items[idx+1] : null,
    next: (idx-1 >= 0) ? feedWithoutContents.items[idx-1] : null,
  }
}

/*

feed?page=...
feed?item_id=...
feed?tags=...,...,...
feed
feed?no_items=true
feed?items_first=...&items_last=....
feed?items_first=...&item_count=3

//_prev_url
*/