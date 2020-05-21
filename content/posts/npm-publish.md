---
title: npm publishの手順
date: 2020-05-21T15:40:14+09:00
keywords:
 - node.js
 - npm
 - JavaScript
---

npm (Node Package Manager) とは、Node.jsにおけるパッケージ管理ツールである。

npmがGitHubに買収されたり、denoが正式リリースされたりしているこのご時世であるが、初めて`$ npm publish`したので、そのときの手順と注意点を振り返る。

ちなみにpublishしたパッケージは、はてなブログ記事管理ツールの[gimonfu](https://www.npmjs.com/package/gimonfu)。

## 全体の流れ

npm publishするためのもろもろは、[np](https://www.npmjs.com/package/np)という便利なツールもあるようだ。
今回は必要な作業を知る意味を込めて手動で行った。

私がやったのはこんなくらい。細かくはこれから述べる。

1. npmに登録する
1. 内容を確認する
1. package.jsonのversionを上げる
1. `$ npm publish`
1. GitHubのWebページ上でReleaseを書く

## npmに登録する

1. npmに登録する (https://www.npmjs.com/signup)
2. npmにログインする(`$npm login`)
3. npmにログインしたことを確認する(`$npm whoami`)

## `package.json`を振り返る

`package.json`の内容に不備がないか、各項目を確認していく。

一通り確認し終えたら[`fixpack`](https://www.npmjs.com/package/fixpack)を使って、抜けがないかチェックできる。

versionについては[semantic versioning](https://docs.npmjs.com/about-semantic-versioning)に従う。
要するに`0.0.1`だとか`1.0.2`だとかの形式だ。
`$ npm version`でも上げることができるらしい。

(`files`キーについては次に述べる。)

## 配布するファイルを確認する

配布するファイルは次の項目で決まる。

### `package.json`内の`files`キー

文字列の配列を渡すと、ファイルやディレクトリを配布ファイルに含める。
ホワイトリスト形式。

今回は次のように指定した。
TypeScriptでCLIツールを作るなら同じように指定できるのではないだろうか。

なお[package.jsonなどは自動で含めてくれるようなので](https://docs.npmjs.com/files/package.json#files)指定しなくてよい。

```json
{
  "files": [
    "dist",
    "bin"
  ],
}
```

### `.npmignore`

`.gitignore`と同じフォーマットで、ファイルやディレクトリを配布ファイルから除外する。
ブラックリスト形式。

ドキュメントを読むと、[`.npmignore`だけではなく`.gitignore`も読み込んで除外してくれそう](http://npm.github.io/publishing-pkgs-docs/publishing/the-npmignore-file.html)な感じだ。

今回は`package.json`#`files`で指定したので使わなかった。

<br/>

配布するファイルは、特にTypeScriptのとき注意する必要がある。`dist`ディレクトリだ。

npmで配布するのはコンパイル結果なので、`dist`ディレクトリを配布対象に含めなければならない。
が、gitではコンパイル結果をリポジトリに含めないのが普通だ。
何も設定しないと`.gitignore`を解釈して`dist`は配布対象外となってしまう。

これを避けるためには、`package.json`#`files`で指定してあげる必要がある。

<br/>

ところで、`$npm link`を使うと手元のPCでグローバルインストールしたのと同様にpathを通してくれるらしい。

ただ、シンボリックリンクを貼るだけなので配布するファイルの確認には使えないことに注意。
配布対象外のファイルもローカルに存在するので動いてしまう。

## ビルドとテストが通る

動かないファイルをpublishするわけにはいかない。

間違えてpublishしてしまっても、[72時間以内なら`$npm unpublish`で取り消せる](https://docs.npmjs.com/cli/unpublish)。

それ以降はnpmのサポートにメールする必要がある。パッケージが簡単に消せてしまうと依存関係に問題が生じるので、削除には慎重なようだ。

## README.mdを読み直す

READMEはnpmのページにも表示されるので、改めて間違いがないかを確認する。

自分は`Installation`のところを間違えたまま公開してしまった。(現在は修正済み)

```sh
# 間違い
$ npm install --global basd4g/gimonfu

# 正しい
# npm install --global gimonfu
```

実はnpmにパッケージを公開せずとも、install時に [githubユーザ名]/[githubレポジトリ名]とすると、パッケージをインストールできる。

なのでもともとREADME.mdにはこの方法が記述されていた。
しかし今回はこの記述は間違い。
GithubのリポジトリにはTypeScriptのコンパイル結果が含まれていないので、インストールできても動かない。

ちなみに英語のREADME.mdは、DeepLとgrammalyの力を借りて適当なGitHubリポジトリのREADMEを参考にすることで作っている。
先人と文明は偉大。

## `$ npm publish`

問題ないことが確認できたらいよいよ公開する。

```sh
$npm publish
```

たった一行打つだけ。

公開したら、GitHub上でもReleaseをつくる。

## おわりに

はじめての`$ npm publish`はなんだか気分が良い。

npmのパッケージのページではDownload数が見れるのだが、公開された瞬間に40くらいになっていた。
謎。
ミラーだったりで自動取得されてるのかな。

そもそもDownload数ってそんなに正確である必要はないので、40など誤差の範囲内だが。

