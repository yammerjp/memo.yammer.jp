import remark from 'remark';
import footnotes from 'remark-footnotes';
import gfm from 'remark-gfm'
import codeTitle from 'remark-code-titles'
import strip from 'strip-markdown'

export default async function markdownToDescription(markdown: string) {
  const result = await remark().use(gfm).use(footnotes).use(codeTitle).use(strip).process(markdown);
  return result.toString().slice(0,300);
}
