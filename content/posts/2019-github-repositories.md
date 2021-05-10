---
title: "リポジトリで振り返る2019年"
date: "2020-05-19T21:44:57+09:00"
tags: [ "日記" ]
---

2020年も中頃だが、2019年末〜2020年正月に書きかけた記事が出てきた。
捨てるのも何なのでここに放出。

以下。年末に1年を振り返るという記事の趣旨から各リポジトリにリンクをつけた以外は原文のまま。
リンク以外の追記部分はその旨を記述している。

<hr/>

## なにをするか

あけましておめでとうございます。
年越ししてしまいましたが、まだ正月なので昨年を振り返って今年に向けて身を引き締めたい。

今回はGitHubのリポジトリを総ざらいして自分がどんな開発をしたか振り返る。

## 準備:GitHubのリポジトリ一覧を取得する

githubのAPIを用いて、curlでリポジトリ情報を取得する。

```sh
$ curl -u yammerjp "https://api.github.com/users/yammerjp/repos?per_page=100&page=1" | grep '"name": "' | awk -F '"' '{print $4}' > repos.txt
```

参考: [GitHubのリポジトリを一覧化する（public/private両対応）- Qiita](https://qiita.com/emergent/items/a557246a0c0bf9d50a11)


## リポジトリ一覧 (2019/12/31現在)

私([yammerjp](https://github.com/yammerjp))のgithub上にあるpublicリポジトリは31個。
まともにGitHubを使い始めてから1年ほどというのもあり、すべて2019年に1コミット以上しているので、これらを振り返る。

### 純粋な個人趣味開発 

- [c-sharp-socket](https://github.com/yammerjp/c-sharp-socket)

友人からの質問をきっかけにC#でソケット通信をしてみた、サンプルコード的なリポジトリ。

- [text2pdf](https://github.com/yammerjp/text2pdf)

textデータをPDFファイルに出力できるアプリケーション。
2019年1月に、3日間で勢いで作った。実用で使うというより、プロモーションが中心だったので、表示自体は非常に簡素。
ただし、node.js上で外部のライブラリやアプリケーションを用いず、PDFのファイル形式に従ってファイルへの文字列出力部分を自分で実装している。3日間にしては頑張ったな、という感じ。

日本語出力した際のフォントまわりが貧弱で、文字列が描画される位置が微妙である。
開発後半に、日本語出力をとってつけで開発したので、このあたりをしっかりすれば、もうすこし見た目が良くなるのではないかな。
PDFを開く環境による見た目の差異を検証したりすることが必要である。

もし文字データを手っ取り早くPDFにしたいのであれば、[md-to-pdf](https://dev.classmethod.jp/tool/md-to-pdf/)がおすすめ。[GitHub風CSSを当てる](https://dev.classmethod.jp/tool/md-to-pdf)と結構いい感じになる。

- [PlayQueue](https://github.com/yammerjp/playqueue)

Youtubeを連続再生するWebアプリケーション。
2018年末から断続的に開発している。
個人開発のアプリケーションとしては自分の代表作で、就活でも自分を紹介する際に話す機会が多い。

### 大学の授業に関係した開発

- [TuringMachineOnWeb](https://github.com/yammerjp/turingmachineonweb)

2019年1月制作。
チューリング機械の状態遷移表を作成するエディタと、作成した状態遷移表を検証するシュミレータを作った。

レポートに書く状態遷移表をつくったときに、つくった状態遷移表が正しいのかを検証するために作った。

UIは簡素だけれど、当時やりたかったことは達成させられたので満足。

- [clustering.AI.2019.SU](https://github.com/yammerjp/clustering.ai.2019.su)

ウォード法による階層的クラスタリングを扱ったレポートを書くために使ったスクリプト。

- [pl0i](https://github.com/yammerjp/pl0i)
- [pl0i.js](https://github.com/yammerjp/pl0i.js)

pl0 interpreterという仮想マシンと、TypeScriptによる再実装(未完)

簡易なアセンブリと、より高級な言語との対応を学ぶために、アセンブリを実行する仮想マシンをつくることで理解を深める試みであった。

TypeScriptで書いていたときは、最終的にブラウザでメモリの状態や実行している命令の位置なども表示しながらプログラムを実行できるようなWebアプリケーションをつくるつもりだったが、大学の課題と就活を優先した結果開発が進まぬまま課題の方を先に終わらせて提出した。以後開発が停止し未完。

### 夏インターン

#### 夏インターン準備

夏インターンでNuxt.jsとTypeScriptを扱うと聞いたので、その準備としてそれらの勉強のために書籍やWebサイトを参考にサンプルアプリを作って動かしてみたリポジトリ群

- [ts-nuxt-tutorial](https://github.com/yammerjp/ts-nuxt-tutorial)
- [green-turtle-org](https://github.com/yammerjp/green-turtle-org)
- [Typescript-tutorial1](https://github.com/yammerjp/typescript-tutorial1)
- [Typescript-tutorial2](https://github.com/yammerjp/typescript-tutorial2)
- [chapter02-qiita-post.nuxt-tutorial](https://github.com/yammerjp/chapter02-qiita-post.nuxt-tutorial)
- [chapter03-01-layout.nuxt-tutorial](https://github.com/yammerjp/chapter03-01-layout.nuxt-tutorial)
- [chapter03-02-middleware.nuxt-tutorial](https://github.com/yammerjp/chapter03-02-middleware.nuxt-tutorial)

#### 夏インターン

夏インターンのハッカソンで制作したWebアプリケーション。PHP製。

- [oshushume.20190807](https://github.com/yammerjp/oshushume.20190807)

#### 夏インターン後

夏インターンで扱ったNuxt.jsを生かして何かをしようと作っていたアプリケーションとその残骸。

- [green-turtle (ブログのソースコード)](https://github.com/yammerjp/green-turtle)
- [nuxt.ts-blog](https://github.com/yammerjp/nuxt.ts-blog)
- [nuxt.ts-blog.org](https://github.com/yammerjp/nuxt.ts-blog.org)
- [nuxt.ts-template](https://github.com/yammerjp/nuxt.ts-template)
- [nuxt.ts-template.org](https://github.com/yammerjp/nuxt.ts-template.org)

最終的にこのブログとして形にして動いている。
(2020/05/19補足: [memo.yammer.jp](https://memo.yammer.jp)ではなく[Green Turtle](https://blog.yammer.fun))

このブログ([Green Turtle](https://blog.yammer.fun))のしくみは以下のようになっている。

mdファイルをgitリポジトリ(アプリケーションソースコードとは別のprivateリポジトリ)で管理している。
masterにmergeすることで記事公開。

アプリケーションリポジトリも、記事リポジトリも、masterにmergeしたときにCircle CIが走ってデプロイするようになっている。

デプロイは次のような工程で行われる

1. 2つのリポジトリからソース、記事をclone
1. ソースコードのサンプル記事を破棄し、cloneした公開記事に置き換え
1. 記事markdownをスクリプトでJSONに変換
1. Nuxt.jsをGenerateモードで動作させる
1. Nuxt.jsが記事ページを描画する際に、記事データが含まれるjsonファイルを読み込み、描画する。
1. Nuxt.jsにより静的なHTML,CSSファイルが生成される
1. Google Firebase Hostingに静的なHTML,CSSファイルをアップロード

今後の展望

- トップページとaboutページが簡素なので、もう少しリッチなUIにしたい
- 過去記事へのリンクの経路が限られているので、記事下に「最近投稿した記事」などのリンクを置きたい。
- (勉強も兼ねて)バックエンドも用意して、静的ファイルでの公開ではなく、SSRないしSPAで動作させたい。(表示速度は退化するので、完全に勉強目的)

現在はブログというには簡素な状態だが、今後の拡張性はたくさん用意しているつもりである。
デプロイの手順も少々手間が混んでいるが、将来APIサーバを用意した際でも描画部分を使い回せるようにするためだったりする。
やりたいことはたくさんある。

### Swift ( チーム開発でのiphoneアプリ製作 )

- [ios-animals.enpit.2019.SU](https://github.com/yammerjp/ios-animals.enpit.2019.SU)
- [ios-mymap.enpit.2019.SU](https://github.com/yammerjp/ios-mymap.enpit.2019.SU)
- [ios-photo-viewer.enpit.2019.SU](https://github.com/yammerjp/ios-photo-viewer.enpit.2019.SU)
- [ios-sample-calcurator.enpit.2019.SU](https://github.com/yammerjp/ios-sample-calcurator.enpit.2019.SU)
- [ios-timer.enpit.2019.SU](https://github.com/yammerjp/ios-timer.enpit.2019.SU)
- [PinsOfMap](https://github.com/yammerjp/PinsOfMap)
- <strike>[lovelab.heroku](https://github.com/yammerjp/lovelab.heroku)</strike>(2020/05/19追記: 現在の名前は[lovelab-api](https://github.com/yammerjp/lovelab-api))
- [lovelab.vue](https://github.com/yammerjp/lovelab.vue)

9月から、学生どうしでチームを組むiPhoneアプリケーションの開発に関わっている。

上の5つはサンプルアプリケーションの実装。6つめはそれを生かした簡単な応用の位置情報保存アプリ。

7つめは10月より開発中のメインのアプリケーションのAPIサーバ。

8つめは10月より開発中のメインのアプリケーションのプロトタイプ。フロントエンドのWebアプリケーション

(2020/05/19追記: メインのiphoneアプリケーションのリポジトリはプライベートなのでここにリンクを貼っていない。)

### rails (冬インターン)

- [bbs.rb](https://github.com/yammerjp/bbs.rb)
- [rails-tutorial](https://github.com/yammerjp/rails-tutorial)
- [rails-tutorial-toy_app](https://github.com/yammerjp/rails-tutorial-toy_app)

冬インターンで

<hr/>

以上。 ここで止まっていた。
ここからは2020年5月に書いている。

ちなみに冬インターンでRailsを使うものに参加したのでRailsを軽く触っていたのが最後の書きかけの項目。

今年度末は同じ内容の記事を書ききって公開したい。
 
