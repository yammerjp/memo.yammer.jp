import { vi } from 'vitest'

// Mock modules that use ES modules or cause issues
vi.mock('./src/lib/api', () => ({
  getPostSlugs: vi.fn(() => ['test-post']),
  getPostBySlug: vi.fn((slug) => ({
    title: '記事タイトル',
    date: '2023-01-01',
    slug: slug,
    tags: '',
    description: 'Test description',
    content: 'Test content'
  })),
  getPost: vi.fn((slug, fields = []) => ({
    title: '記事タイトル',
    date: '2023-01-01',
    slug: slug,
    tags: [],
    description: 'Test description',
    content: ''
  })),
  getAllPosts: vi.fn(() => [
    {
      title: '記事タイトル',
      date: '2023-01-01',
      slug: 'test-post',
      tags: '',
      description: 'Test description',
      content: 'Test content'
    }
  ]),
  getNeighborPosts: vi.fn(() => ({
    next: null,
    prev: null
  })),
  getRelatedPosts: vi.fn(() => []),
  getStaticPost: vi.fn((slug, fields = []) => ({
    title: 'Static Page',
    date: '2023-01-01',
    slug: slug,
    content: ''
  }))
}))

// Mock CSS modules
vi.mock('*.module.css', () => {
  return new Proxy(
    {},
    {
      get: (target, key) => {
        if (key === '__esModule') {
          return false
        }
        return key
      },
    }
  )
})