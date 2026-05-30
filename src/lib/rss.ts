const SITE_URL = 'https://memo.yammer.jp'

const escapeXml = (value: string) => {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

const formatRssDate = (value: string) => new Date(value).toUTCString()

export { SITE_URL, escapeXml, formatRssDate }
