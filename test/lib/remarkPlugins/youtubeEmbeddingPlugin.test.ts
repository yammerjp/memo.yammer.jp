import { describe, it, expect } from 'vitest'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import { youtubeEmbeddingPlugin } from '../../../src/lib/remarkPlugins/youtubeEmbeddingPlugin'

describe('youtubeEmbeddingPlugin', () => {
  const processMarkdown = async (markdown: string) => {
    const result = await unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(youtubeEmbeddingPlugin)
      .use(rehypeStringify)
      .process(markdown)
    return result.toString()
  }

  it('should convert YouTube URL to embed', async () => {
    const markdown = '[https://www.youtube.com/watch?v=dQw4w9WgXcQ](https://www.youtube.com/watch?v=dQw4w9WgXcQ)'
    const result = await processMarkdown(markdown)
    
    expect(result).toContain('class="embed-youtube embed-wrapper"')
    expect(result).toContain('iframe')
    expect(result).toContain('src="https://www.youtube.com/embed/dQw4w9WgXcQ?feature=oembed"')
  })

  it('should extract video ID from URL with parameters', async () => {
    const markdown = '[https://www.youtube.com/watch?v=abc123&t=10s](https://www.youtube.com/watch?v=abc123&t=10s)'
    const result = await processMarkdown(markdown)
    
    expect(result).toContain('src="https://www.youtube.com/embed/abc123?feature=oembed"')
  })

  it('should not convert non-YouTube links', async () => {
    const markdown = '[Video](https://example.com/video)'
    const result = await processMarkdown(markdown)
    
    expect(result).not.toContain('embed-youtube')
    expect(result).toContain('href="https://example.com/video"')
  })

  it('should handle YouTube URL in a paragraph', async () => {
    const markdown = 'Check out this video: [https://www.youtube.com/watch?v=test123](https://www.youtube.com/watch?v=test123)'
    const result = await processMarkdown(markdown)
    
    expect(result).toContain('Check out this video:')
    expect(result).toContain('src="https://www.youtube.com/embed/test123?feature=oembed"')
  })
})