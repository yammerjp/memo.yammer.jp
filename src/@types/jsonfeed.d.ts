type Url = string

type IconImageUrl = Url // such as 512x512

type DateRFC3339String = string

type Language = 'ja'

type Author = {
  name?: string
  url?: Url
  avatar?: IconImageUrl
}

type ItemWithoutContents = {
  id: string
  url: Url
  // external_url // not supported
  title?: string
  summary?: string
  image?: Url
  banner_image?: Url
  date_published?: DateRFC3339String
  date_modified?: DateRFC3339String
  authors?: Author[]
  tags?: string[]
  language?: Language
  _change_logs?: {
    url: Url
    comment: string
    date_modified?: DateRFC3339String
    // Authors
  }[]
}
type Item = ItemWithoutContents&{
  content_html: string
  content_text?: string
}

type Feed = FeedWithoutItems&{
  version: "https://jsonfeed.org/version/1.1"
  items: Item[]
}

type FeedWithoutItems = {
  title: string
  home_page_url: Url
  feed_url?: Url
  description?: string
  // user_comment // not supported
  next_url?: Url
  icon?: IconImageUrl
  favicon?: Url // 64x64
  authors?: Author[]
  language: Language
  expired?: false // allow updating contents
  // hubs // not supported
  _feed_url_rss2?: string
}

type FeedWithoutContents = FeedWithoutItems&{
  items: ItemWithoutContents[]
}