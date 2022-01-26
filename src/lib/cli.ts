import { getJsonFeed, getJsonFeedItemBySlug, getJsonFeedWithoutContents, getPostSlugs } from './api'
import promises from 'fs/promises'

async function main() {
  await promises.mkdir('jsonfeed/posts', {recursive: true})
  const feed = await getJsonFeed()
  await promises.writeFile('public/jsonfeed/all.json', JSON.stringify(feed))

  const feedWithoutContents = await getJsonFeedWithoutContents()
  const slugs = await getPostSlugs()
  for (const slug of slugs) {
    const item = await getJsonFeedItemBySlug(slug)
    const articleUniqueKey = slug.slice(0, -3)
    await promises.writeFile(`public/jsonfeed/posts/${articleUniqueKey}.json`, JSON.stringify(item))
    await promises.writeFile(`public/jsonfeed/posts/${articleUniqueKey}.raw.html`, item?.content_html || '')
    await promises.writeFile(`public/jsonfeed/posts/${articleUniqueKey}.raw.txt`, item?.content_text || '')
  }
  await promises.writeFile(`public/jsonfeed/summary.json`, JSON.stringify(feedWithoutContents))
}

main()
