import Link from 'next/link'
import { useState } from 'react'
import styles from '../styles/components/header.module.css'

const Header = ({ titleIsH1 }: { titleIsH1?: boolean }) => {
    const [navDescription, setNavDescription] = useState<string>('');
    return (
        <header className={styles.header}>
            <div className={styles.headerInner}>
                <div className={styles.headerLeft}>
                    <Link href="/">
                        {
                            titleIsH1 ? (
                                <h1 className={styles.headerTitle}>memo.basd4g.net</h1>
                            ) : (
                                <div className={styles.headerTitle}>memo.basd4g.net</div>
                            )
                        }
                    </Link>
                    <div className={styles.headerSubtitle}>常に完成形</div>
                </div>

                <div className={styles.headerRight}>
                    <nav>
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
                        <a href="https://github.com/basd4g" target="_blank">
                            <img
                              className={styles.headerNavIcon}
                              src="/assets/github.svg"
                              alt="GitHub (@basd4g)"
                              onMouseOver={()=>setNavDescription('GitHubをひらく (新しいタブ)')}
                              onMouseLeave={()=>setNavDescription('')}
                            />
                        </a>
                        <a href="https://twitter.com/basd4g" target="_blank">
                            <img
                              className={styles.headerNavIcon}
                              src="/assets/twitter.svg"
                              alt="Twitter (@basd4g)"
                              onMouseOver={()=>setNavDescription('Twitterをひらく (新しいタブ)')}
                              onMouseLeave={()=>setNavDescription('')}
                            />
                        </a>
                        <a href="https://basd4g.net" target="_blank">
                            <img
                              className={styles.headerNavIcon}
                              src="/assets/home.svg"
                              alt="著者のWebサイト"
                              onMouseOver={()=>setNavDescription('ホームページをひらく (新しいタブ)')}
                              onMouseLeave={()=>setNavDescription('')}
                            />
                        </a>
                    </nav>
                    <div className={styles.headerNavDescription}>
                        {navDescription}
                    </div>
                </div>
            </div>
        </header>
    )
}
export default Header;