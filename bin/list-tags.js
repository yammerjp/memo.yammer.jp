const fs = require('fs')
const path = require('path')

const POSTS_DIR = path.join(process.cwd(), 'content/posts')

const counts = new Map()

for (const fileName of fs.readdirSync(POSTS_DIR).filter((name) => name.endsWith('.md'))) {
  const filePath = path.join(POSTS_DIR, fileName)
  const source = fs.readFileSync(filePath, 'utf8')
  const frontmatterMatch = source.match(/^---\n([\s\S]*?)\n---/)

  if (!frontmatterMatch) {
    continue
  }

  const frontmatter = frontmatterMatch[1]
  const listMatch = frontmatter.match(/^tags:\s*\n((?:\s+-.*\n?)*)/m)
  const inlineMatch = frontmatter.match(/^tags:\s*\[(.*)\]$/m)
  const singularListMatch = frontmatter.match(/^tag:\s*\n((?:\s+-.*\n?)*)/m)
  const singularInlineMatch = frontmatter.match(/^tag:\s*\[(.*)\]$/m)

  let tags = []

  if (listMatch) {
    tags = listMatch[1]
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => line.replace(/^\s*-\s*/, '').trim())
  } else if (inlineMatch) {
    tags = inlineMatch[1]
      .split(',')
      .map((part) => part.trim().replace(/^['"]|['"]$/g, ''))
      .filter(Boolean)
  } else if (singularListMatch) {
    tags = singularListMatch[1]
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => line.replace(/^\s*-\s*/, '').trim())
  } else if (singularInlineMatch) {
    tags = singularInlineMatch[1]
      .split(',')
      .map((part) => part.trim().replace(/^['"]|['"]$/g, ''))
      .filter(Boolean)
  }

  for (const tag of tags) {
    counts.set(tag, (counts.get(tag) ?? 0) + 1)
  }
}

for (const [tag, count] of [...counts.entries()].sort((a, b) => {
  if (b[1] !== a[1]) {
    return b[1] - a[1]
  }
  return a[0].localeCompare(b[0], 'ja')
})) {
  console.log(`${count}\t${tag}`)
}
