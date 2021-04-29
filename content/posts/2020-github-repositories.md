---
title: "自分のGitHubリポジトリで振り返る2020年"
date: "2020-12-31T18:18:37+09:00"
tags: [ "日記" ]
---

今年コミットした GitHub のリポジトリを順にみながら2020年の個人開発を振り返ってみる。

実は去年もやろうとしていた企画[^1]、今年こそ年内に公開するぞ。

## リポジトリ一覧の取得

去年の記事では API を curl で取得していた[^2]が、今年は GitHub の公式 CLI である [gh](https://github.com/cli/cli) を使って取得することとする。

[jq](https://github.com/stedolan/jq) と gh をインストールし、 `~/.config/gh/config.yml` の aliases キーに、次のような内容を追記する。

```
aliases:
    repos: |
        !gh api --paginate graphql -f owner="$1" -f query='
          query($owner: String!, $per_page: Int = 100, $endCursor: String) {
            repositoryOwner(login: $owner) {
              repositories(first: $per_page, after: $endCursor, ownerAffiliations: OWNER) {
                nodes { nameWithOwner, updatedAt }
                pageInfo { hasNextPage endCursor }
              }
            }
          }
        ' | jq '.data.repositoryOwner.repositories.nodes[] | .updatedAt + " " + .nameWithOwner' -r | sort
```

ログインして、先程登録したエイリアスでリポジトリ一覧を取得する。

```sh
gh auth login
gh repos | grep '2020' > repos.txt
```

## リポジトリを一つづつ振り返る

以下順番にコミットした GitHub リポジトリを振り返っていく。

### lovelab-api

- [basd4g/lovelab-api](https://github.com/basd4g/lovelab-api) : API server of lovelab with express.js
- [basd4g/lovelab-batch](https://github.com/basd4g/lovelab-batch) : Batch server of lovelab with node.js

2019年10月から2020年1月にかけての iPhone アプリを開発する演習授業に合わせて作った、TypeScript 製の API サーバ。
データベースを使ったサーバサイドアプリケーションを一人で作ったのは初めてで、サーバ内でどのような処理をしているか、また REST API とはどのようなものかなどの全体を知ることができた。

ドキュメントは手書きしたがエンドポイントが意外と多く[^3]、書くのが大変で中身も整っておらず良い出来とは言えない。
今思えば Swagger などを使うべきだっただろう。

認証系は簡素なもので「ID とパスワードの対で新規登録する」「ログイン時にアクセストークンを発行する」といった動作を自前で実装している。
自前で実装したのは認証認可のしくみを理解していなかったからだ。
スマートフォン用の API においてどのように認証認可が行われるか、HTTP の中でそれはどのように表現されるかがよくわかっておらず、ライブラリを使おうとしても「よくわからんな」という気持ちになった。

そこで、授業でやっていることもあり (リリースまでは求められていない)、良い機会だと思って一連の流れを作ることにした。
「車輪の再発明は無駄」「セキュリティホールの発生に繋がるので自前での実装は避けるべき」といった意見はごもっともだが、作ってしくみを理解するという点ではとても助かった。
普通なら Express.js に使える認証ミドルウェアの Passport.js を使ったり Firebase Authentication や Auth0 などに任せてしまうのがいいだろう。

そういえば Dockerfile を自分で初めて書いたのもこのアプリケーションだった。
Docker は [プログラマのためのDocker教科書 第2版](https://www.amazon.co.jp/dp/B07BHK5KX7/ref=dp-kindle-redirect?_encoding=UTF8&btkr=1) を読んで学び, EC2 上に docker-compose を使って展開していた。

### 17ti.me

2月に作った、大学の研究室配属前に学生間で希望を調整するために非公式で作った Web アプリケーション。
学内の情報がハードコーディングされているので公開していない。
最終的に対象者の8割以上の人に利用していただいた。感謝。

成績と希望を集計するもので、Vue.js と Firebase (Realtime Database, Authentication), Netlify を利用している。
大学個人に付与されるメールアドレスを用いて Firebase Authentication でログイン機能を設け, Realtime Database 上に集計情報を記録した。

Firebase Authentication は 前月に作った [lovelab-api](#lovelab-api) の認証と比べて簡単だし管理画面も良く出来ていて感動した。
Firebase Realtime Database も 全体を1つの JSON として扱うシンプルなデータベースをクライアント側から読み書きできるので楽に作れて素晴らしかった。
車輪の再発明のあとに最新式の自動車に乗った気分。

### dotfiles

- [basd4g/dotfiles](https://github.com/basd4g/dotfiles) : my .vimrc, .zshrc, and so on...
- [basd4g/dot.basd4g.net](https://github.com/basd4g/dot.basd4g.net) : HTTP redirect server to download shell script to initialize dotfiles

2020年は私が dotfiles に入門した年でもあった。

dotfiles とは `~/.vimrc` や `~/.bashrc` などの各アプリケーション向けの個人設定ファイルの総称で、よくホームディレクトリの中にドットで始まるファイル名で保存されることからこう呼ばれる。
複数のコンピュータで設定を共有するために dotfiles を GitHub で管理する Tips があり、Qiita で知ってやってみたいと思っていたのだ。

3月の春休みに、4月の研究室配属時に研究室のコンピュータのセットアップを爆速で終わらせることを目指して作り始めた。[^4]

最もシンプルな dotfiles は 設定ファイルを別ディレクトリで git の管理下に置きホームディレクトリにシンボリックリンクを貼るものであるが、これにとどまらず様々な機能をもたせることもできる。
私のリポジトリでは、アプリケーションの一括インストールや OS の設定変更、設定ファイルの自動配置などを行うスクリプトも一緒にまとめて管理している。
OS は macOS と Ubuntu に対応させてそれぞれ判断してスクリプトが実行されるし、ついでに GitHub Actions で CI を回したりもしている。

dotfiles を始めてよかったのはシェルに親しめたことだ。
まずシェルスクリプトを書く機会が圧倒的に増えた。
それまでは普段書かないので if の記法ですら毎度 ggっていたくらいだったが、dotfiles を凝りだすとシェルスクリプトを書く必要が出てきて覚えた。

他にも`.vimrc`を改造してプラグインを入れたり、シェルにエイリアスもたくさん貼るようになって便利になった。
設定ファイルを壊してもすぐ直せるので色々試せるのが良い。

### pdef

- [basd4g/pdef](https://github.com/basd4g/pdef) : Patch script generator of Mac OS X User Defaults
- [basd4g/homebrew-tap](https://github.com/basd4g/homebrew-tap) : basd4g's collection of Homebrew (aka, Brew) "formulae"

dotfiles の開発にあわせて、macOS の設定を保持する UserDefaults をシェルから書き換えたくなって作ったツール。
詳細は当時のブログ記事に書いている。

書いた記事:
[Macの設定を自動化するdefaultsコマンドと、それを助けるpdef](/posts/pdef/)
/ [(余談) User Defaultsとproperty list(plist)](/posts/plist/)

### memo.basd4g.net

- [basd4g/memo.basd4g.net](https://github.com/basd4g/memo.basd4g.net) : my memos. https://memo.basd4g.net/

このブログ ([memo.basd4g.net](https://memo.basd4g.net)) と個人のページ ([basd4g.net](https://basd4g.net)) を用意したのも 2020年。

このブログは[やんまーのブログ](https://basd4g.hatenablog.com)とは別にメモや作業記録を雑に投稿するために作ったのに、使い分けが出来ておらず完全に迷走している。
でも記事を書くハードルが下がったのはとても良くて「とりあえず雑に投稿しておくか」と自分で思える。

Hugo で出来ていて、最近デザインの変更と OGP 対応をした。
拡張したい機能がいくつかあるのでそのために来年は勉強も兼ねて Hugo から Next.js に置き換えたい。

### basd4g.net

- [basd4g/basd4g.github.io](https://github.com/basd4g/basd4g.github.io) : A web page including links for my SNS and Web sites
- [basd4g/rss-republish.basd4g.net](https://github.com/basd4g/rss-republish.basd4g.net) : Republish RSS feeds with Vercel

[個人のページ](https://basd4g.net)。
最初は linktree[^5] を真似して SNS のユーザページのリンクなどを含む HTML と CSS だけのページをおいていた。
最近作り変えて自己紹介と記事の一覧も表示している。

### はてなブログ

- [basd4g/gimonfu](https://github.com/basd4g/gimonfu) : Manage hatena-blog articles
- [basd4g/basd4g.hatenablog.com](https://github.com/basd4g/basd4g.hatenablog.com) : Hatenablog articles
- [basd4g/blog.yammer.fun](https://github.com/basd4g/blog.yammer.fun) : Redirect old blog to new blog
- [basd4g/hatenablog-post](https://github.com/basd4g/hatenablog-post) : Post article of markdown file to hatena-blog.

去年 Nuxt.js で作ったブログをはてなブログに移行した。
移行にあたって、画像を AWS S3 に移したり、旧ドメインをリダイレクトしたり (basd4g/blog.yammer.fun)、はてなブログの記事管理 CLI (basd4g/gimonfu)を作ったりした。

最初は一括投稿のために hatenablog-post という CLI ツールを作ったが、それ以外の機能も欲しくなって gimonfu という CLI ツールに発展した。
gimonfu は初めて npm publish したが、インターネット上のどこかで使ってくれている人がいるようで嬉しい。

書いた記事: [gimonfu で、はてなブログの記事を GitHub と同期する - Qiita](https://qiita.com/basd4g/items/1a38857f6bafb20f065d)

### willani 

- [basd4g/willani](https://github.com/basd4g/willani) : C Compiler

2020年に一番時間を費やしたのが C コンパイラの willani。
5月から2ヶ月くらい作って7月半ばに止まっているが、一応コンパイラ自体のセルフホストは達成した。
(プリプロセッサが未完成。)
また気が向いたら続きをやりたい。

自作したことで今までブラックボックスだったコンパイラがどんな動作をしているか知れて楽しかった。

書いた記事: 
[数日前からCコンパイラを書き始めた。](/posts/willani-start/)
/ [自作Cコンパイラの途中経過](/posts/willani-compliperbook-finished/)
/ [自作コンパイラのセルフホストに挑戦中](/posts/willani-try-selfhost/)
/ [自作コンパイラのfor文バグ](/posts/willani-for-stmt-bug/)
/ [C言語の構造体メンバのアライメント (x86\_64, Linux (System V ABI))](/posts/willani-struct-alignment/)

### mopm

- [basd4g/mopm](https://github.com/basd4g/mopm) : Mopm (Manager Of Package Manager) is meta package manager for cross platform environment.
- [basd4g/mopm-defs](https://github.com/basd4g/mopm-defs) : mopm package definition yaml files
- [basd4g/mopm-defs-test](https://github.com/basd4g/mopm-defs-test)

既存のパッケージマネージャに不満を持ったので作り始めたソフトウェアのインストール支援ツール。
Golang の入門も兼ねて秋に作り始めたが、しばらく進めていくと「これは HomeBrew の劣化版では？」という気がしてきて手が止まっている。

### その他

その他。

- [basd4g/regex-visualizer](https://github.com/basd4g/regex-visualizer), [basd4g/regex2dfa](https://github.com/basd4g/regex2dfa) ... 正規表現をグラフで描画するツール
- [basd4g/pl0i](https://github.com/basd4g/pl0i), [basd4g/cmm](https://github.com/basd4g/pl0i) ... 大学の教科書(コンパイラの講義)で題材とされた言語の拡張
- [basd4g/competitive-programming](https://github.com/basd4g/competitive-programming) ... 競技プログラミングを解いたときのコードを載せるリポジトリ (全然解いていない)
- [basd4g/java-design-pattern-multi-thread](https://github.com/basd4g/java-design-pattern-multi-thread) ... 輪講で読んでいた本の実践 (中断)
- [basd4g/md-prev](https://github.com/basd4g/md-prev), [basd4g/md-server](https://github.com/basd4g/md-server) ... Markdown で書いた記事の確認用アプリケーション
- [basd4g/kozos](https://github.com/basd4g/kozos) 2019年4月に買い牛歩の歩みで進めている OS 自作、[12ステップで作る組込みOS自作入門](https://www.amazon.co.jp/12%E3%82%B9%E3%83%86%E3%83%83%E3%83%97%E3%81%A7%E4%BD%9C%E3%82%8B%E7%B5%84%E8%BE%BC%E3%81%BFOS%E8%87%AA%E4%BD%9C%E5%85%A5%E9%96%80-%E5%9D%82%E4%BA%95-%E5%BC%98%E4%BA%AE/dp/4877832394)。 やらねば。
- [basd4g/solar-log](https://github.com/basd4g/solar-log), [basd4g/solar-web](https://github.com/basd4g/solar-web) ... 家庭用太陽光発電システムのロギングと集計用アプリケーション
- [basd4g/md2hiki](https://github.com/basd4g/md2hiki) ... Markdown 記法の文章を hiki 記法に置換するスクリプト
- [basd4g/cat](https://github.com/basd4g/cat) ... C 言語で cat コマンドを実装してみる試み
- basd4g/album-shelf, basd4g/album-shelf.rb, basd4g/rails-micro-blog (プライベートリポジトリ) ... Ruby on Rails と React で画像を管理する Web アプリケーションを作りたかった (中断)
- [basd4g/ogp-getter](https://github.com/basd4g/ogp-getter) ... OGP の情報を抽出するアプリケーション 
- [basd4g/armyknife: Shell script snippets](https://github.com/basd4g/armyknife) ... bash製のシェルスクリプトで使えるツール群 (を作る予定)
- [basd4g/pocket2retweet](https://github.com/basd4g/pocket2retweet) ... Pocket に保存したツイートをリツイートするスクリプト ([ブログ記事](http://localhost:1313/posts/pocket2retweet/))
- basd4g/keepa (プライベートリポジトリ) ... 日記用のWebアプリケーション ([ブログ記事](https://basd4g.hatenablog.com/entry/2020/12/02/124040)))
- [basd4g/ryu-http-routing](https://github.com/basd4g/ryu-http-routing) ... 卒論の検証用

...

この他にも2020年に手を付けていた自分のリポジトリやフォークしたリポジトリがあるが、ここでは省略する。

## 総括

### 良かったこと

2020年はコロナで家にいたということもあり、自分の時間がとれて継続的に何かしらを作っていた気がする。(後半は研究のために前半ほどの勢いはなかったが。)
昨年ある面接で「作ったものはもっと公開しよう」とアドバイスをもらった事があり、それに従ってなるべくパブリックリポジトリで公開するようにしていた。

結構飽きずにキリのいいところまで作り続けられた。
そのおかげで npm publish や、HomeBrew の Formulae としての公開に繋がった。

また、自分が作りたいものを作るときに新しい技術に少しずつ手を広げていけたように思う。

### 改善したいこと

「コードを読む機会が少ない」

これに尽きると思う。
OSS などの他人の書いたコードを読む機会が全然なくて、どこから手をつけていいのかもわからない。
コードリーディングってどうやってするんでしょう？...
働き始めたら他人のコードを必然的に読むことになると思うが、結構不安。

### 来年も

ものを作るのは楽しい。
今年ほど時間の余裕がないだろうが、来年も新しいことを学ぶためにも何か作りたい。
作りたいものは50個くらいある[^6]。

以上。

[^1]: [リポジトリで振り返る2019年 – memo.basd4g.net](/posts/2019-github-repositories/)
[^2]: 去年のように API をcurlで叩くなら、basic 認証ではなくアクセストークンで行う必要がありそう。[Basic認証は廃止されたはず。](https://github.blog/2020-07-30-token-authentication-requirements-for-api-and-git-operations/)
[^3]: [lovelab-api のドキュメント](https://github.com/basd4g/lovelab-api/blob/master/documents/specification/detail/index.md)
[^4]: 結局新型コロナウィルス感染症の影響でリモートになったので研究室のコンピュータをセットアップすることはないまま卒業しそうである。
[^5]: [linktree](https://linktr.ee) は SNS の自分のページへのリンクなどをまとめて表示する Webページを作成できるサービス。
[^6]: 自分のメモの中に作りたいアプリケーションのネタ帳があり、そこに書かれた数。
