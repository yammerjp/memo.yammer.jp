import { describe, it, expect } from 'vitest'
import { OgImageUrlInText } from '../../src/lib/cloudinaryOgp'

describe('cloudinaryOgp', () => {
  describe('OgImageUrlInText', () => {
    it('should generate OG image URL with encoded text', () => {
      const text = 'Hello World'
      const result = OgImageUrlInText(text)
      
      expect(result).toContain('https://res.cloudinary.com')
      expect(result).toContain('memo-yammer-jp')
      expect(result).toContain(encodeURIComponent(text))
    })

    it('should handle Japanese text', () => {
      const text = 'こんにちは世界'
      const result = OgImageUrlInText(text)
      
      expect(result).toContain(encodeURIComponent(text))
    })

    it('should handle special characters', () => {
      const text = 'Test & Special < Characters > "Quote"'
      const result = OgImageUrlInText(text)
      
      expect(result).toContain(encodeURIComponent(text))
    })

    it('should handle empty string', () => {
      const text = ''
      const result = OgImageUrlInText(text)
      
      expect(result).toContain('https://res.cloudinary.com')
    })
  })
})