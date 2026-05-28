const { spawn } = require('child_process')
const fs = require('fs/promises')
const path = require('path')

async function readDirRecursive(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      const resolved = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        return readDirRecursive(resolved)
      }
      return [resolved]
    }),
  )
  return files.flat()
}

function runGitLog(fullPath) {
  return new Promise((resolve, reject) => {
    const commitSeparator = '__COMMIT_SEPALATOR__'
    const format = `${commitSeparator}%cd%x00%H%x00%s%x00`
    const child = spawn(
      'git',
      ['log', '--follow', `--format=${format}`, '--date=iso8601-strict', '--', fullPath],
      {
        cwd: process.cwd(),
        shell: false,
      },
    )

    let stdout = ''
    let stderr = ''
    child.stdout.on('data', (data) => {
      stdout += data.toString()
    })
    child.stderr.on('data', (data) => {
      stderr += data.toString()
    })
    child.on('error', reject)
    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`git log failed for ${fullPath}: ${stderr}`))
        return
      }
      resolve(stdout)
    })
  })
}

function parseHistory(stdout) {
  return stdout
    .split('__COMMIT_SEPALATOR__')
    .slice(1)
    .filter((commit) => commit.trim())
    .flatMap((commit) => {
      const parts = commit.split('\x00').filter((value) => value.length > 0)
      if (parts.length < 3) {
        return []
      }
      const [date, hash, ...messageParts] = parts
      return [{ date, hash, message: messageParts.join('\x00') }]
    })
}

async function main() {
  const contentRoot = path.join(process.cwd(), 'content')
  const files = (await readDirRecursive(contentRoot)).filter((file) => file.endsWith('.md'))
  const cache = { posts: {}, pages: {} }

  for (const file of files) {
    const rel = path.relative(contentRoot, file)
    const [collection, ...rest] = rel.split(path.sep)
    const slug = collection === 'posts' ? rest.join('/').replace(/\.md$/, '') : rel.replace(/\.md$/, '')
    const history = parseHistory(await runGitLog(path.relative(process.cwd(), file)))
    if (collection === 'posts') {
      cache.posts[slug] = history
    } else {
      cache.pages[slug] = history
    }
  }

  const outputPath = path.join(process.cwd(), 'generated', 'post-history.json')
  await fs.mkdir(path.dirname(outputPath), { recursive: true })
  await fs.writeFile(outputPath, JSON.stringify(cache, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
