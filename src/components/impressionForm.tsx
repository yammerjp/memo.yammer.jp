import { PostType } from '../types/post'
import { useState } from 'react'
import styles from './impressionForm.module.css'

type MessageTab = 'customMessage' | 'emoji'

const Emojis = ['😃 ', '🥺 ', '😆', '🚀 ', '👍 ', '👎', '💓'] as const
type Emojis = typeof Emojis[number]

const ImpressionForm = ({ post }: { post: PostType }) => {
  const [customMessage, setCustomMessage] = useState<string>('よかった！')
  const [isPublic, setIsPublic] = useState<boolean>(true)
  const [tabSelected, setTabSelected] = useState<MessageTab>('customMessage')
  const [emojiSelected, setEmojiSelected] = useState<Emojis>(Emojis[0])

  const getTwitterPostingUrl = () => {
    const message = tabSelected === 'customMessage' ? customMessage : emojiSelected
    const url = `https://memo.yammer.jp/posts/${post.slug}`
    if (isPublic) {
      return `https://twitter.com/intent/tweet?screen_name=yammerjp&text=${encodeURI('\n' + message + '\n' + url)}`
    }
    return `https://twitter.com/messages/compose?recipient_id=451409846&text=${encodeURI(message + '\n' + url)}`
  }

  const openSendWindow = () => {
    window.open(getTwitterPostingUrl())
  }

  return (
    <div className={styles.impressionForm}>
      <div>
        <div className={styles.tabWrapper}>
          <button
            onClick={() => setTabSelected('customMessage')}
            className={tabSelected === 'customMessage' ? styles.tabSelectorSelected : styles.tabSelector}
          >
            メッセージ
          </button>
          <button
            onClick={() => setTabSelected('emoji')}
            className={tabSelected === 'emoji' ? styles.tabSelectorSelected : styles.tabSelector}
          >
            スタンプ
          </button>
        </div>
        {tabSelected === 'customMessage' && (
          <div className={styles.tabContent}>
            「よかった」「わるかった」などメッセージをくれると嬉しいです！
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className={styles.textarea}
            ></textarea>
          </div>
        )}
        {tabSelected === 'emoji' && (
          <div className={styles.tabContent}>
            <div className={styles.emojiWrapper}>
              {Emojis.map((emoji, i) => (
                <div
                  key={i}
                  onClick={() => setEmojiSelected(emoji)}
                  className={emojiSelected === emoji ? styles.emojiButtonSelected : styles.emojiButton}
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
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              id='impression-form-is-public-checkbox'
            />
            <label htmlFor='impression-form-is-public-checkbox'>公開</label>
          </div>
          <div className={styles.sendButtionBox}>
            <button onClick={openSendWindow} className={styles.impressionSubmitButton}>
              Twitter{!isPublic && 'のDM'}で送る
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImpressionForm
