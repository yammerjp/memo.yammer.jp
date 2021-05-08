---
title: "Zeit Now を使って、express.jsで書かれたアプリケーションを独自ドメインで公開する"
date: "2020-05-31T16:44:33+09:00"
tags: [ "JavaScript", "ドメイン" ]
---

now という PaaS がある。

Node.js で書かれたアプリケーションを、無料で3つまでホスティングできるらしい。

heroku を無料プランで使うと、dyno の立ち上げに30秒くらいかかるので、Web サーバとしては致命的に遅い。
一方 zeit はそのような待ち時間は発生しない。(どこかに、AWS Lambda を中で使っていると書いてあった気がする)

今回はシンプルな express.js のアプリケーションを now でホスティングする手順。

## インストール

```sh
$ mkdir now-app
$ cd now-app
$ yarn init
$ yarn global add now
$ yarn add express
$ touch index.js
$ touch now.json
```

## アプリケーションを作る

index.js に次のように記入

```js:index.js
`use strict`

const express = require('express');
const app = express();

app.get('/*', (req,res) => {
  res.send('hello, world!');
  res.end();
})

const port = process.env.PORT || 3000;
// ポート番号は上記のように環境変数から読み込むこと
app.listen(3000, () => console.log(`listening on port ${port}`));
```

## now の設定

事前に、node.js のアプリケーションであることを指定しなければならない。

何もしないと静的ホスティングと判断され、アプリケーションのソースコードを写した Web ページがデプロイされる。

now.json に次のように記入

```json:now.json
{
    "version": 2,
    "builds": [{ "src": "index.js", "use": "@now/node" }],
    "routes": [{ "src": "(.*)", "dest": "index.js" }]
}
```

## npm scriptの設定

now が実行時に index.js を実行してくれるように、package.json に次の項目を追加

```json:package.json
{
 "scripts": {
    "start": "node index.js"
  }
}
```

## デプロイ

```sh
$ now
# 対話にしたがってメールを入れると、ログインリンクのついたメールが届くので、クリックして認証。
```

## 独自ドメイン(サブドメイン)を登録

以下、現在`hogehoge-hogehoge.now.sh`で公開されていて、`hogehoge.example.com`でアクセスできるようにするときの設定。

まずは親のドメインをzeitに登録する

```sh
$ now domains add example.com
```

ドメインの所有者認証を行う

```sh
$ now domains verify example.com
```

すると、DNSに何も設定していないので失敗する。
どう設定すべきか表示されるので 画面に表示される通り、DNSに登録する。
ついでに先にお目当てのサブドメインの CNAME も登録しておく。

| name | type | value |
| --- | --- | --- |
| \_now | TXT | 表示されたキー |
| hogehoge | CNAME | alias.zeit.co |

再度ドメインの所有者認証を行う

```sh
$ now domains verify example.com
```

サブドメインのエイリアスを設定する

```sh
$ now alias https://hogehoge-hogehoge.now.sh hogehoge.example.com
```

## おわりに

以上の手順と同様の作業で公開したリポジトリ: [blog.yammer.fun - GitHub basd4g](https://github.com/basd4g/blog.yammer.fun)

古いブログのURLをリダイレクトさせるために使った。
