import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import styles from './header.module.css'

const Header = ({ titleIsH1 }: { titleIsH1?: boolean }) => {
  const [navDescription, setNavDescription] = useState<string>('')

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <div className={styles.headerLeft}>
          {titleIsH1 ? (
            <h1 className={styles.headerTitle}>
              <Link href='/' passHref>
                <a className={styles.headerLeftAnchor}>memo.yammer.jp</a>
              </Link>
            </h1>
          ) : (
            <div className={styles.headerTitle}>
              <Link href='/' passHref>
                <a className={styles.headerLeftAnchor}>memo.yammer.jp</a>
              </Link>
            </div>
          )}
          <div className={styles.headerSubtitle}>常に完成形</div>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.headerNavWrap}></div>
          <nav className={styles.headerNav}>
            <Link href='/tags' passHref>
              <a className={styles.headerNavIconWrapper}>
                <Image
                  className={styles.headerNavIcon}
                  src='/assets/list-search.svg'
                  alt='記事を探す'
                  width='44px'
                  height='44px'
                  onMouseOver={() => setNavDescription('記事をタグで絞り込む')}
                  onMouseLeave={() => setNavDescription('')}
                />
              </a>
            </Link>
            <Link href='/about' passHref>
              <a className={styles.headerNavIconWrapper}>
                <Image
                  className={styles.headerNavIcon}
                  src='/assets/user.svg'
                  alt='自己紹介'
                  width='44px'
                  height='44px'
                  onMouseOver={() => setNavDescription('自己紹介をひらく')}
                  onMouseLeave={() => setNavDescription('')}
                />
              </a>
            </Link>
            <a
              href='https://github.com/yammerjp'
              rel='noreferrer noopener'
              target='_blank'
              className={styles.headerNavIconWrapper}
            >
              <Image
                className={styles.headerNavIcon}
                src='/assets/github.svg'
                alt='GitHub (@yammerjp)'
                width='44px'
                height='44px'
                onMouseOver={() => setNavDescription('GitHubをひらく (新しいタブ)')}
                onMouseLeave={() => setNavDescription('')}
              />
            </a>
            <a
              href='https://twitter.com/yammerjp'
              rel='noreferrer noopener'
              target='_blank'
              className={styles.headerNavIconWrapper}
            >
              <Image
                className={styles.headerNavIcon}
                src='/assets/twitter.svg'
                alt='Twitter (@yammerjp)'
                width='44px'
                height='44px'
                onMouseOver={() => setNavDescription('Twitterをひらく (新しいタブ)')}
                onMouseLeave={() => setNavDescription('')}
              />
            </a>
            <a
              href='https://yammer.jp'
              rel='noreferrer noopener'
              target='_blank'
              className={styles.headerNavIconWrapper}
            >
              <Image
                className={styles.headerNavIcon}
                src='/assets/home.svg'
                alt='著者のWebサイト'
                width='44px'
                height='44px'
                onMouseOver={() => setNavDescription('ホームページをひらく (新しいタブ)')}
                onMouseLeave={() => setNavDescription('')}
              />
            </a>
          </nav>
          <div className={styles.headerNavDescription + (navDescription != '' ? ' filled' : '')}>{navDescription}</div>
        </div>
      </div>
    </header>
  )
}
export default Header
