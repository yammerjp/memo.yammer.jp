// Mock the api module to avoid ES module issues
jest.mock('./src/lib/api', () => ({
  getPostSlugs: jest.fn(() => ['test-post']),
  getPostBySlug: jest.fn((slug) => ({
    title: '記事タイトル',
    date: '2023-01-01',
    slug: slug,
    tags: '',
    description: 'Test description',
    content: 'Test content'
  })),
  getAllPosts: jest.fn(() => [
    {
      title: '記事タイトル',
      date: '2023-01-01',
      slug: 'test-post',
      tags: '',
      description: 'Test description',
      content: 'Test content'
    }
  ])
}))