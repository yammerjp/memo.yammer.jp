import { PostType } from '../types/post'
import { useState } from 'react'
import styles from './impressionForm.module.css'

type MessageType = 'text' | 'emoji'

const Emojis = ['😃 ', '🥺 ', '😆', '🚀 ', '👍 ', '👎', '💓'] as const
type Emojis = typeof Emojis[number]

type Impression = {
  isPublic: boolean
  messageType: MessageType
  emoji: Emojis
  text: string
}

const ImpressionForm = ({ post }: { post: PostType }) => {
  const [impression, setImpression] = useState<Impression>({
    isPublic: true,
    messageType: 'text',
    emoji: Emojis[0],
    text: 'よかった！'
  })

  const updateImpression = (after: Partial<Impression>) => setImpression(before => ({...before, ...after}))

  const tweetUrl = (
    `https://twitter.com/${impression.isPublic ? 'intent/tweet?screen_name=yammerjp&text=%0A' : 'messages/compose?recipient_id=451409846&text='}` +
    encodeURI(`${ impression.messageType === 'text' ? impression.text : impression.emoji }\nhttps://memo.yammer.jp/posts/${post.slug}`)
  )

  return (
    <div className={styles.impressionForm}>
      <div>
        <div className={styles.tabWrapper}>
          <button
            onClick={() => updateImpression({messageType: 'text'})}
            className={impression.messageType === 'text' ? styles.tabSelectorSelected : styles.tabSelector}
          >
            メッセージ
          </button>
          <button
            onClick={() => updateImpression({messageType: 'emoji'})}
            className={impression.messageType === 'emoji' ? styles.tabSelectorSelected : styles.tabSelector}
          >
            スタンプ
          </button>
        </div>
        {impression.messageType === 'text' && (
          <div className={styles.tabContent}>
            「よかった」「わるかった」などメッセージをくれると嬉しいです！
            <textarea
              value={impression.text}
              onChange={(e) => updateImpression({text: e.target.value})}
              className={styles.textarea}
            ></textarea>
          </div>
        )}
        {impression.messageType === 'emoji' && (
          <div className={styles.tabContent}>
            <div className={styles.emojiWrapper}>
              {Emojis.map((emoji, i) => (
                <div
                  key={i}
                  onClick={() => updateImpression({emoji})}
                  className={impression.emoji === emoji ? styles.emojiButtonSelected : styles.emojiButton}
                >
                  {emoji}
                </div>
              ))}
            </div>
          </div>
        )}
        <div className={styles.buttonCheckboxWrapper}>
          <div className={styles.isPublicCheckboxBox}>
            <input
              type='checkbox'
              checked={impression.isPublic}
              onChange={(e) => updateImpression({isPublic: e.target.checked})}
              id='impression-form-is-public-checkbox'
            />
            <label htmlFor='impression-form-is-public-checkbox'>公開</label>
          </div>
          <div className={styles.sendButtionBox}>
            <a href={tweetUrl} className={styles.impressionSubmitButton} target="_blank" rel="noreferrer">
              Twitter{!impression.isPublic && 'のDM'}で送る
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImpressionForm
