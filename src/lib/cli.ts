import { getJsonFeed, getJsonFeedItemBySlug, getJsonFeedWithoutContents, getPostSlugs } from './api'
import promises from 'fs/promises'

async function main() {
  await promises.mkdir('jsonfeed/posts', {recursive: true})
  const feed = await getJsonFeed()
  await promises.writeFile('jsonfeed/all.json', JSON.stringify(feed))

  const feedWithoutContents = await getJsonFeedWithoutContents()
  const slugs = await getPostSlugs()
  for (const slug of slugs) {
    const item = await getJsonFeedItemBySlug(slug)
    await promises.writeFile(`jsonfeed/posts/${slug}.json`, JSON.stringify(item))
  }
  await promises.writeFile(`jsonfeed/summary.json`, JSON.stringify(feedWithoutContents))
}

main()