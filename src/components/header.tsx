import Link from 'next/link'
import { useState } from 'react'

const Header = ({ titleIsH1 }: { titleIsH1?: boolean }) => {
    const [navDescription, setNavDescription] = useState<string>('');
    return (
        <header>
            <div className="header-inner">
                <div className="header-left">
                    {
                        titleIsH1 ? (
                            <h1 className="header-title">
                                <Link href="/">memo.basd4g.net</Link>
                            </h1>
                        ) : (
                            <div className="header-title">
                                <Link href="/">memo.basd4g.net</Link>
                            </div>
                        )
                    }
                    <div className="header-subtitle">常に完成形</div>
                </div>

                <div className="header-right">
                    <div className="header-nav-wrap"></div>
                    <nav className="header-nav">
                        <Link href="/tags">
                            <img
                              className="header-nav-icon"
                              src="/assets/list-search.svg"
                              alt="記事を探す"
                              onMouseOver={()=>setNavDescription('記事をタグで絞り込む')}
                              onMouseLeave={()=>setNavDescription('')}
                            />
                        </Link>
                        <Link href="/about">
                            <img
                              className="header-nav-icon"
                              src="/assets/user.svg"
                              alt="自己紹介"
                              onMouseOver={()=>setNavDescription('自己紹介をひらく')}
                              onMouseLeave={()=>setNavDescription('')}
                            />
                        </Link>
                        <a href="https://github.com/basd4g" target="_blank">
                            <img
                              className="header-nav-icon"
                              src="/assets/github.svg"
                              alt="GitHub (@basd4g)"
                              onMouseOver={()=>setNavDescription('GitHubをひらく (新しいタブ)')}
                              onMouseLeave={()=>setNavDescription('')}
                            />
                        </a>
                        <a href="https://twitter.com/basd4g" target="_blank">
                            <img
                              className="header-nav-icon"
                              src="/assets/twitter.svg"
                              alt="Twitter (@basd4g)"
                              onMouseOver={()=>setNavDescription('Twitterをひらく (新しいタブ)')}
                              onMouseLeave={()=>setNavDescription('')}
                            />
                        </a>
                        <a href="https://basd4g.net" target="_blank">
                            <img
                              className="header-nav-icon"
                              src="/assets/home.svg"
                              alt="著者のWebサイト"
                              onMouseOver={()=>setNavDescription('ホームページをひらく (新しいタブ)')}
                              onMouseLeave={()=>setNavDescription('')}
                            />
                        </a>
                    </nav>
                    <div className={"header-nav-description" + (navDescription != '' ? ' filled' : '')}>
                        {navDescription}
                    </div>
                </div>
            </div>
        </header>
    )
}
export default Header;
