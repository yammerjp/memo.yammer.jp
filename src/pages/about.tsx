import Head from 'next/head'
import Frame from '../components/frame'
import 'highlight.js/styles/github.css'
import Link from 'next/link'
import Ogp from '../components/ogp'
import { OgImageUrlInText } from '../lib/cloudinaryOgp'

const title = "About Me"

const About = () => {
  return (
    <>
    <Head>
        <title>memo.yammer.jp - 常に完成形</title>
        <Ogp
          title='About - memo.yammer.jp'
          url="https://memo.yammer.jp/posts/about"
          description={title}
          ogImage={OgImageUrlInText(title)}
          ogType="article"
        />
        <link rel="stylesheet" href="/assets/article.css"></link>
    </Head>
    <Frame titleIsH1={false}>
      <article>
        <h1>About Me</h1>
        <p>
          こんにちは、やんまーといいます。
          2021年3月に大学を卒業し、2021年4月からWebアプリケーションの開発職で働いています。
          このブログはコンピュータに関する作業記録を中心に記事を載せています。
        </p>

        <ul>
          <li>
            Website: <a href="https://yammer.jp">yammer.jp</a>
          </li>
          <li>
            Twitter: <a href="https://twitter.com/yammerjp">@yammerjp</a>
          </li>
          <li>
            GitHub: <a href="https://github.com/yammerjp">@yammerjp</a>
          </li>
          <li>
            はてなブログ: <a href="https://basd4g.hatenablog.com">id:basd4g</a>
          </li>
          <li>
            Qiita: <a href="https://qiita.com/yammerjp">@yammerjp</a>
          </li>
        </ul>
        <p>
          スキューバダイビングが趣味で、SNSのアイコンに使っている次の写真は潜っている時の私です。
        </p>
        <div style={{ textAlign: "center"}}>
          <img src="/assets/icon-512x512.png" alt="avatar" style={{maxWidth: '400px'}}/>
        </div>
        <div style={{textAlign: 'center', width: '100%', color: '#505050', fontSize: '14px'}}>
        キンギョハナダイとアカネハナゴイを捕まえようとしている図
        </div>
        <p>
          どうぞよろしくお願いします。
        </p>
      </article>
      <Link href="/">&lt; Home</Link>
    </Frame>
    </>
    )
}

export default About 
