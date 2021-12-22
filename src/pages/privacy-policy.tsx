import Head from 'next/head'
import Frame from '../components/frame'
import 'highlight.js/styles/github.css'
import Link from 'next/link'
import Ogp from '../components/ogp'
import { OgImageUrlInText } from '../lib/cloudinaryOgp'

const title = "プライバシーポリシー"

const PrivacyPolicy = () => {
  return (
    <>
    <Head>
        <title>memo.yammer.jp - 常に完成形</title>
        <Ogp
          title='プライバシーポリシー - memo.yammer.jp'
          url="https://memo.yammer.jp/privacy-policy"
          description={title}
          ogImage={OgImageUrlInText(title)}
          ogType="article"
        />
        <link rel="stylesheet" href="/assets/article.css"></link>
    </Head>
    <Frame titleIsH1={false}>
      <article>
        <h1>{title}</h1>
        <h3>Google Analyticsの利用について</h3>
        <p>
        当サイトでは、サイトの利用状況を把握するためにGoogle Analyticsを利用しています。
        Google Analyticsは、クッキーを利用して利用者の情報を収集します。
        Google Analyticsの利用規約及びプライバシーポリシーに関する説明については、<a href="https://policies.google.com/privacy?hl=ja">Google Analyticsのサイト</a>をご覧ください。
        なお、Google Analyticsのサービス利用による損害については、当サイト管理者は責任を負わないものとします
        </p>
      </article>
      <Link href="/">&lt; Home</Link>
    </Frame>
    </>
    )
}

export default PrivacyPolicy
