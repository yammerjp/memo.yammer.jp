---
title: はてなブログに乗り換えた
date: "2020-06-14T21:26:00+09:00"
tags: [ "はてなブログ" ]
---

昨年に作ったブログの公開場所をはてなブログに変え、名前も「やんまーのブログ」と改名した。

以前は Firebase Hosting 上に、 Nuxt.js の Generate モードで生成した HTML ファイルを公開していた。

移行するにあたって次のことを行った。

1. はてなブログCLI gimonfu による記事管理
2. Zeit Nowを使った旧ドメインの転送処理

## 1. [gimonfu](https://github.com/basd4g/gimonfu) による記事管理

はてなブログは Markdown で記事を作成でき、これが乗り換える後押しになった。

Markdown の記事は、以前のブログでも GitHub 上で記事を管理していたので、今回も同じことを行いたいと思っていた。

そこではてなブログの CLI を作り、GitHub上のリポジトリと同期するようにした。  
[はてなブログはAPIを公開しており](http://developer.hatena.ne.jp/ja/documents/blog/apis/atom)、これを使って Markdown ファイルをアップロード、ダウンロードしている。

はてなブログの CLI には、既に [blogsync](https://github.com/x-motemen/blogsync) というソフトウェアがある。  
当初はこのソフトウェアを使おうと思っていたのだが、新規記事投稿の部分が自分の思うように行かず、APIを触っているうちに、全部作ったほうがいいのでは？という気持ちになり CLI が出来上がってしまった。

[blogsync](https://github.com/x-motemen/blogsync) と [gimonfu](https://github.com/x-motemen/blogsync) はどちらも1記事につき、1ファイルで、ファイル先頭に YAML Front matter といわれる YAML 形式の記事情報を含む。
またURLの構造が記事ファイルのディレクトリ構造となる点も同じだ。

一方で、記事の投稿に関しては異なる点がある。  
blogsync では、記事本文のみを標準入力で CLI に渡すが、 gimonfu では、対象ディレクトリ内にある新しいファイルを新規記事として認識し投稿する。

こうすると、CIを組み合わせれば、新規投稿時にも CLI を直接触らずに運用できる。

現にこのブログも、新規投稿時にファイルを追加して GitHub に push すれば、自動的にはてなブログも更新されるようにしてある。 (逆にはてなブログが更新されたらGitHub にも反映されるワークフローも設定している。)

gimonfu の使い方の詳細は [README](https://github.com/basd4g/gimonfu) に譲るが、[このブログのワークフロー](https://github.com/basd4g/basd4g.hatenablog.com/tree/master/.github/workflows)と同じものを GitHub Actions に指定すれば、記事管理がとても捗ると思うので是非活用して欲しい。

## 2. Zeit now を使った旧ドメインの転送処理

旧ドメインの記事を公開していた URL は全て、express.js を使って、今の記事に 301 リダイレクトするように設定した。([設定した内容](/posts/zeit-now/))

Now を初めて使ったが、とても簡単にアプリケーションを公開できるので、さくっと作ったときなどに活用していきたい。

---

というわけで、これからはてなブログで更新していきます。
よろしくお願いします。(誰に)

---

追記: (2020/10/04) ドメイン転送の記事へのリンクを相対リンクに修正
