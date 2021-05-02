import remark from 'remark';
import html from 'remark-html';
import footnotes from 'remark-footnotes';
import gfm from 'remark-gfm'
import hljs from 'remark-highlight.js'
import codeTitle from 'remark-code-titles'

export default async function markdownToHtml(markdown: string) {
  const result = await remark().use(gfm).use(footnotes).use(codeTitle).use(hljs).use(html).process(markdown);
  return result.toString();
}
