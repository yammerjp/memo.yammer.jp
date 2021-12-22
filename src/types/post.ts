type PostType = {
  slug: string
  title: string
  date: string
  content: string
  html?: string
  tags?: string[]
  description?: string
  history?: PostHistoryType
  ogImage?: string
  plaintext?: string
}

type PostHistoryType = Array<{
  date: string
  message: string
  hash: string
}>

export type { PostType, PostHistoryType }
