import { describe, it, expect } from 'vitest'
import markdownToDescription from '../../src/lib/markdownToDescription'

describe('markdownToDescription', () => {
  it('should convert basic markdown to plain text', async () => {
    const markdown = '# Heading\n\nThis is a **bold** text and *italic* text.'
    const result = await markdownToDescription(markdown)
    expect(result).toBe('Heading This is a bold text and italic text.')
  })

  it('should remove code blocks', async () => {
    const markdown = 'Some text\n\n```javascript\nconst foo = "bar";\n```\n\nMore text'
    const result = await markdownToDescription(markdown)
    // strip-markdownはコードブロックをインラインに変換するため
    expect(result).toContain('Some text')
    expect(result).toContain('More text')
  })

  it('should handle links', async () => {
    const markdown = 'Check out [my website](https://example.com) for more info.'
    const result = await markdownToDescription(markdown)
    expect(result).toBe('Check out my website for more info.')
  })

  it('should handle lists', async () => {
    const markdown = '- Item 1\n- Item 2\n- Item 3'
    const result = await markdownToDescription(markdown)
    expect(result.trim()).toBe('Item 1 Item 2 Item 3')
  })

  it('should limit to 300 characters', async () => {
    const longText = 'a'.repeat(400)
    const markdown = `# Title\n\n${longText}`
    const result = await markdownToDescription(markdown)
    expect(result.length).toBe(300)
    expect(result).toBe('Title ' + 'a'.repeat(294))
  })

  it('should replace multiple newlines with single space', async () => {
    const markdown = 'First paragraph\n\n\n\nSecond paragraph\n\nThird paragraph'
    const result = await markdownToDescription(markdown)
    expect(result).toBe('First paragraph Second paragraph Third paragraph')
  })

  it('should handle tables', async () => {
    const markdown = `| Header 1 | Header 2 |
| --- | --- |
| Cell 1 | Cell 2 |
| Cell 3 | Cell 4 |`
    const result = await markdownToDescription(markdown)
    expect(result.trim()).toBe('Header 1 Header 2 Cell 1 Cell 2 Cell 3 Cell 4')
  })

  it('should handle blockquotes', async () => {
    const markdown = '> This is a quote\n> spanning multiple lines'
    const result = await markdownToDescription(markdown)
    expect(result.trim()).toBe('This is a quote spanning multiple lines')
  })

  it('should handle images', async () => {
    const markdown = '![alt text](https://example.com/image.jpg) Some text after image'
    const result = await markdownToDescription(markdown)
    expect(result.trim()).toBe('Some text after image')
  })

  it('should handle empty input', async () => {
    const result = await markdownToDescription('')
    expect(result).toBe('')
  })

  it('should handle footnotes', async () => {
    const markdown = 'Some text[^1] with footnote.\n\n[^1]: This is the footnote.'
    const result = await markdownToDescription(markdown)
    expect(result).toContain('Some text')
    expect(result).toContain('with footnote')
  })
})