import Link from 'next/link'
import { useState } from 'react'
import styles from './header.module.css'

const Header = ({ titleIsH1 }: { titleIsH1?: boolean }) => {
    const [navDescription, setNavDescription] = useState<string>('');

    return (
        <header className={styles.header}>
            <div className={styles.headerInner}>
                <div className={styles.headerLeft} >
                    {
                        titleIsH1 ? (
                            <h1 className={styles.headerTitle}>
                                <Link href="/"><a className={styles.headerLeftAnchor}>memo.yammer.jp</a></Link>
                            </h1>
                        ) : (
                            <div className={styles.headerTitle}>
                                <Link href="/"><a className={styles.headerLeftAnchor}>memo.yammer.jp</a></Link>
                            </div>
                        )
                    }
                    <div className={styles.headerSubtitle}>常に完成形</div>
                </div>

                <div className={styles.headerRight}>
                    <div className={styles.headerNavWrap}></div>
                    <nav className={styles.headerNav}>
                        <Link href="/tags">
                            <img
                              className={styles.headerNavIcon}
                              src="/assets/list-search.svg"
                              alt="記事を探す"
                              onMouseOver={()=>setNavDescription('記事をタグで絞り込む')}
                              onMouseLeave={()=>setNavDescription('')}
                            />
                        </Link>
                        <Link href="/about">
                            <img
                              className={styles.headerNavIcon}
                              src="/assets/user.svg"
                              alt="自己紹介"
                              onMouseOver={()=>setNavDescription('自己紹介をひらく')}
                              onMouseLeave={()=>setNavDescription('')}
                            />
                        </Link>
                        <a href="https://github.com/yammerjp" target="_blank">
                            <img
                              className={styles.headerNavIcon}
                              src="/assets/github.svg"
                              alt="GitHub (@yammerjp)"
                              onMouseOver={()=>setNavDescription('GitHubをひらく (新しいタブ)')}
                              onMouseLeave={()=>setNavDescription('')}
                            />
                        </a>
                        <a href="https://twitter.com/yammerjp" target="_blank">
                            <img
                              className={styles.headerNavIcon}
                              src="/assets/twitter.svg"
                              alt="Twitter (@yammerjp)"
                              onMouseOver={()=>setNavDescription('Twitterをひらく (新しいタブ)')}
                              onMouseLeave={()=>setNavDescription('')}
                            />
                        </a>
                        <a href="https://yammer.jp" target="_blank">
                            <img
                              className={styles.headerNavIcon}
                              src="/assets/home.svg"
                              alt="著者のWebサイト"
                              onMouseOver={()=>setNavDescription('ホームページをひらく (新しいタブ)')}
                              onMouseLeave={()=>setNavDescription('')}
                            />
                        </a>
                    </nav>
                    <div className={styles.headerNavDescription + (navDescription != '' ? ' filled' : '')}>
                        {navDescription}
                    </div>
                </div>
            </div>
        </header>
    )
}
export default Header;
