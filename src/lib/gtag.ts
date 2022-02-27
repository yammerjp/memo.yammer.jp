import { Event } from '../types/googleAnalytics/event'

export const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID

// IDが取得できない場合を想定する
export const existsGaId = GA_ID !== ''

// PVを測定する
export const pageview = (url: string): void => {
  if (!GA_ID) return

  ;(window as any).gtag('config', GA_ID, {
    page_path: url,
  })
}

export const event = ({ action, category, label }: Event) => {
  if (!existsGaId) {
    return
  }

  ;(window as any).gtag('event', action, {
    event_category: category,
    event_label: JSON.stringify(label),
  })
}
