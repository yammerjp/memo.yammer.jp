import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import html from 'remark-html'
import footnotes from 'remark-footnotes'
import gfm from 'remark-gfm'
import hljs from 'remark-highlight.js'
import codeTitle from 'remark-code-titles'
import rehypeStringify from 'rehype-stringify'

export default async function markdownToHtml(markdown: string) {
  const result = await unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(gfm)
    .use(footnotes)
    .use(codeTitle)
    .use(hljs)
    .use(html)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown)
  return result.toString()
}
