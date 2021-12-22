const { getJsonFeed } = '../dist/lib/api'
const { promises: fs } = 'fs/promises'

async function main() {
  console.log(getJsonFeed)
  const feed = await getJsonFeed()
  fs.writeFile('jsonfeed.json', JSON.stringify(feed))
}

main()
