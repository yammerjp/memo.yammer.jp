import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import footnotes from 'remark-footnotes'
import gfm from 'remark-gfm'
import codeTitle from 'remark-code-titles'
import strip from 'strip-markdown'
import retextStringify from 'retext-stringify'

export default async function markdownToDescription(markdown: string) {
  const result = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(gfm)
    .use(footnotes)
    .use(codeTitle)
    .use(strip)
    .use(retextStringify)
    .process(markdown)
  return result.toString().replace(/\n+/g, ' ').slice(0, 300)
}
