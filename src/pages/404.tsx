import Head from 'next/head'
import Frame from '../components/frame'
import Ogp from '../components/ogp'
import 'highlight.js/styles/github.css'
import { OgImageUrlInText } from '../lib/cloudinaryOgp'

const NotFound = () => {
  return (
    <>
    <Head>
        <title>404 - memo.yammer.jp</title>
        <Ogp title="memo.yammer.jp" path="/" description="常に完成形" ogImage={OgImageUrlInText('404')} ogType="website"/>
    </Head>
    <Frame titleIsH1={false}>
      <>
        <h1>
        Page Not Found
        </h1>
        <div style={{fontSize: "128px", textAlign: 'center', backgroundColor: '#eeeeee', marginBottom: 60, }}>
          404
        </div>

        <div>
        </div>

      </>
    </Frame>
    </>
    )
}

export default NotFound
