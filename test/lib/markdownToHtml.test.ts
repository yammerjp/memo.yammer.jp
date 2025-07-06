import { describe, it, expect } from 'vitest'
import markdownToHtml from '../../src/lib/markdownToHtml'

describe('markdownToHtml', () => {
  it('should convert basic markdown to HTML', async () => {
    const markdown = '# Heading\n\nThis is a **bold** text.'
    const result = await markdownToHtml(markdown)
    expect(result).toContain('<h1>Heading</h1>')
    expect(result).toContain('<p>This is a <strong>bold</strong> text.</p>')
  })

  it('should handle code blocks with syntax highlighting', async () => {
    const markdown = '```javascript\nconst foo = "bar";\n```'
    const result = await markdownToHtml(markdown)
    expect(result).toContain('<pre><code class="hljs language-javascript">')
    expect(result).toContain('const')
  })

  it('should handle code titles', async () => {
    const markdown = '```javascript:example.js\nconst foo = "bar";\n```'
    const result = await markdownToHtml(markdown)
    expect(result).toContain('example.js')
  })

  it('should support GFM features - tables', async () => {
    const markdown = `| Header 1 | Header 2 |
| --- | --- |
| Cell 1 | Cell 2 |`
    const result = await markdownToHtml(markdown)
    expect(result).toContain('<table>')
    expect(result).toContain('<thead>')
    expect(result).toContain('<tbody>')
    expect(result).toContain('Cell 1')
  })

  it('should support GFM features - strikethrough', async () => {
    const markdown = '~~strikethrough text~~'
    const result = await markdownToHtml(markdown)
    expect(result).toContain('<del>strikethrough text</del>')
  })

  it('should support GFM features - task lists', async () => {
    const markdown = '- [x] Completed task\n- [ ] Incomplete task'
    const result = await markdownToHtml(markdown)
    expect(result).toContain('<input type="checkbox" checked')
    expect(result).toContain('<input type="checkbox"')
  })

  it('should handle links', async () => {
    const markdown = '[Link text](https://example.com)'
    const result = await markdownToHtml(markdown)
    expect(result).toContain('<a href="https://example.com">Link text</a>')
  })

  it('should handle images', async () => {
    const markdown = '![Alt text](https://example.com/image.jpg)'
    const result = await markdownToHtml(markdown)
    expect(result).toContain('<img src="https://example.com/image.jpg" alt="Alt text">')
  })

  it('should handle blockquotes', async () => {
    const markdown = '> This is a quote'
    const result = await markdownToHtml(markdown)
    expect(result).toContain('<blockquote>')
    expect(result).toContain('This is a quote')
  })

  it('should handle footnotes', async () => {
    const markdown = 'Some text[^1]\n\n[^1]: This is a footnote.'
    const result = await markdownToHtml(markdown)
    expect(result).toContain('<sup>')
    expect(result).toContain('href="#user-content-fn-1"')
  })

  it('should highlight dockerfile syntax', async () => {
    const markdown = '```dockerfile\nFROM node:18\nRUN npm install\n```'
    const result = await markdownToHtml(markdown)
    expect(result).toContain('language-dockerfile')
    expect(result).toContain('<span class="hljs-keyword">FROM</span>')
  })

  it('should highlight vim syntax', async () => {
    const markdown = '```vim\nset number\nnnoremap <leader>w :w<CR>\n```'
    const result = await markdownToHtml(markdown)
    expect(result).toContain('language-vim')
  })

  it('should highlight awk syntax', async () => {
    const markdown = '```awk\nBEGIN { print "Hello" }\n```'
    const result = await markdownToHtml(markdown)
    expect(result).toContain('language-awk')
  })

  it('should alias bash to zsh', async () => {
    const markdown = '```bash\necho "Hello"\n```'
    const result = await markdownToHtml(markdown)
    expect(result).toContain('language-bash')
  })

  it('should handle YouTube embedding', async () => {
    const markdown = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    const result = await markdownToHtml(markdown)
    // YouTubeプラグインが適用されることを確認
    expect(result).toContain('embed-youtube')
  })

  it('should handle Twitter embedding', async () => {
    const markdown = 'https://twitter.com/jack/status/20'
    const result = await markdownToHtml(markdown)
    // Twitterプラグインが適用されることを確認
    expect(result).toContain('twitter.com/jack/status/20')
  })

  it('should preserve dangerous HTML when allowed', async () => {
    const markdown = '<div class="custom">Custom HTML</div>'
    const result = await markdownToHtml(markdown)
    expect(result).toContain('<div class="custom">Custom HTML</div>')
  })
})