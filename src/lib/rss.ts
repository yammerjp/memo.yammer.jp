const SITE_URL = 'https://memo.yammer.jp'

const formatRssDate = (value: string) => new Date(value).toUTCString()

export { SITE_URL, formatRssDate }
