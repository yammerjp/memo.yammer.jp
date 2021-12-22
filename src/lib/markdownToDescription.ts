import remark from 'remark';
import footnotes from 'remark-footnotes';
import gfm from 'remark-gfm'
import codeTitle from 'remark-code-titles'
import strip from 'strip-markdown'

export async function markdownToText(markdown: string): Promise<string> {
  const result = await remark().use(gfm).use(footnotes).use(codeTitle).use(strip).process(markdown);
  return result.toString();
}

export async function markdownToDescription(markdown: string): Promise<string> {
  const result = await remark().use(gfm).use(footnotes).use(codeTitle).use(strip).process(markdown);
  return result.toString().replace(/\n+/g, ' ').slice(0,300);
}
