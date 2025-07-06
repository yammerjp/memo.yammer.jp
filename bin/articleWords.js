/* load from files*/
const fs = require('fs/promises')
const { join } = require('path')

/* front-matter & markdown */
const matter = require('gray-matter')
const remark = require('remark')
const gfm = require('remark-gfm')
const codeTitle = require('remark-code-titles')
const strip = require('strip-markdown')

async function fileStr2plainText(fileContents) {
  const { content } = matter(fileContents)
  const result = await remark().use(gfm).use(codeTitle).use(strip).process(content)
  return result.toString()
}

/* extract word */
const kuromoji = require('kuromoji')
const builder = kuromoji.builder({
  dicPath: 'node_modules/kuromoji/dict',
})

const str2KuromojiObject = (str) =>
  new Promise((resolve) => {
    builder.build((err, tokenizer) => {
      if (err) {
        throw err
      }
      resolve(tokenizer.tokenize(str))
    })
  })

const extractWords = async (plainText) => {
  return await str2KuromojiObject(plainText).then((tokens) => {
    const strs = tokens
      .filter((t) => t.pos_detail_1 !== '空白' && t.pos === '名詞')
      .map(({ surface_form }) => surface_form)
    return strs2dicCounted(strs)
  })
}

const strs2dicCounted = (strs) => {
  const dic = {}
  strs.forEach((str) => {
    if (dic[str]) {
      dic[str]++
    } else {
      dic[str] = 1
    }
  })
  return dic
}

const isValidWord = (str) => {
  const regexOnlyNumberAndSymbols = /^[0-9※「」（）＊？、。・￥ー〜~|'"<>!#$%&()\/*+,.:;=?@\\\[\]^_{}-]+$/
  return str.length > 1 && !/^\d$/.test(str) && !regexOnlyNumberAndSymbols.test(str)
}

;(async function main() {
  const dirPath = join('content', 'posts')
  const filenames = await fs.readdir(dirPath, 'utf-8')
  const dictionaries = await Promise.all(
    filenames.map(async (filename) => {
      const filepath = join(dirPath, filename)
      console.error(`start: ${filepath}`)
      const id = filename.slice(0, filename.length - 3)
      const fileStr = await fs.readFile(filepath, 'utf-8')
      console.error(`loaded: ${filepath}`)
      const plainText = await fileStr2plainText(fileStr)
      console.error(`fechedPlainText: ${filepath}`)
      const words = await extractWords(plainText)
      console.error(`extractedWords: ${filepath}`)
      Object.keys(words).forEach((key) => {
        if (!isValidWord(key)) {
          delete words[key]
        }
      })
      console.error(`filteredWords: ${filepath}`)
      return { id, words }
    }),
  )
  await fs.writeFile('gh-pages/tags/articleWords.json', JSON.stringify(dictionaries))
})()
