---
title: npm publishの手順
date: "2020-05-21T15:40:14+09:00"
tags: [ "JavaScript" ]
---

npm (Node Package Manager) とは、Node.js におけるパッケージ管理ツールである。

npm が GitHub に買収されたり、deno が正式リリースされたりしているこのご時世であるが、初めて npm にパッケージを公開したので手順と注意点を振り返る。

ちなみ公開したのは、はてなブログ記事管理ツールの [gimonfu](https://www.npmjs.com/package/gimonfu)。

## 全体の流れ

`$ npm publish`する作業をよしなにしてくれる CLI ツール [np](https://www.npmjs.com/package/np) などもあるようだ。
今回は必要な作業を知る意味を込めて手動で行った。

私がやったのは以下の通り。細かくはこれから述べる。

1. npm に登録する
1. 内容を確認する
1. package.json の version を上げる
1. `$ npm publish`
1. GitHub の Web ページ上で Release を書く

## npmに登録する

1. npm に登録する (https://www.npmjs.com/signup)
2. npm にログインする(`$ npm login`)
3. npm にログインしたことを確認する(`$ npm whoami`)

## package.json を振り返る

package.json の内容に不備がないか、各項目を確認していく。

一通り確認し終えたら [fixpack](https://www.npmjs.com/package/fixpack) を使って、抜けがないかチェックする。

version については [semantic versioning](https://docs.npmjs.com/about-semantic-versioning) に従う。
要するに `0.0.1` や `1.0.2` といった形式だ。
`$ npm version`でも上げることができるらしい。

( files キーについては次に述べる。)

## 配布するファイルを確認する

配布するファイルは次の項目で決まる。

###  package.json 内の files キー

文字列の配列を渡すと、ファイルやディレクトリを配布ファイルに含める。
ホワイトリスト形式。

今回は次のように指定した。
TypeScriptでCLIツールを作るなら同じように指定できるのではないだろうか。

なお [package.json などは自動で含めてくれる](https://docs.npmjs.com/files/package.json#files)ようなので指定しなくてよい。

```json
{
  "files": [
    "dist",
    "bin"
  ],
}
```

### .npmignore

.gitignore と同じフォーマットで、ファイルやディレクトリを配布ファイルから除外する。
ブラックリスト形式。

[npmのドキュメント](http://npm.github.io/publishing-pkgs-docs/publishing/the-npmignore-file.html)を読むと、.npmignore だけではなく .gitignore も読み込んで除外してくれそうな感じだ。

今回は package.json#files で指定したので使わなかった。

<br/>

配布するファイルは、特にTypeScriptのとき注意する必要がある。dist ディレクトリだ。

npm での配布コンパイル結果を含む必要がある。
しかし git ではコンパイル結果をリポジトリに含めないのが普通だ。
何も設定しないと .gitignore を解釈して dist ディレクトリは配布対象外となってしまう。

これを避けるためには、package.json#files で指定してあげる必要がある。

<br/>

ところで、`$npm link`を使うと手元のPCでグローバルインストールしたのと同様にpathを通してくれるらしい。

ただ、シンボリックリンクを貼るだけなので配布するファイルの確認には使えないことに注意。
配布対象外のファイルもローカルに存在するので動いてしまう。

## ビルドとテストが通る

動かないファイルを公開するわけにはいかない。

間違えて公開してしまっても[72時間以内なら`$npm unpublish`で取り消せる](https://docs.npmjs.com/cli/unpublish)。

それ以降はnpmのサポートにメールする必要がある。
パッケージが簡単に消せてしまうと依存関係に問題が生じるので、削除には慎重なようだ。

## README.mdを読み直す

README.md は npm のページにも表示されるので、改めて間違いがないかを確認する。

自分は Installation のところを間違えたまま公開してしまった。(現在は修正済み)

```sh
# 間違い
$ npm install --global basd4g/gimonfu

# 正しい
# npm install --global gimonfu
```

実は npm にパッケージを公開せずとも、install 時に [githubユーザ名]/[githubレポジトリ名] とすると、パッケージをインストールできる。
もともと README.md にこの方法が記述していた。

しかし今回はこの記述は間違い。
Github リポジトリには TypeScript のコンパイル結果が含まれていないので、インストールできても動かない。

ちなみに英語の README.md は、DeepL と grammaly の力を借りて適当な GitHub リポジトリの README.md を参考にすることで作っている。
先人と文明は偉大。

## `$ npm publish`

問題ないことが確認できたらいよいよ公開する。

```sh
$npm publish
```

たった一行打つだけ。

公開したら、GitHub 上でも Release をつくる。

## おわりに

はじめての`$ npm publish`はなんだか気分が良い。

npm のパッケージのページでは Download 数が見れるのだが、公開された瞬間に40くらいになっていた。
謎。
ミラーだったりで自動取得されてるのかな。

そもそも Download 数ってそんなに正確である必要はないので、40など誤差の範囲内だが。

---

追記: (2020/10/04) 不要な改行タグを削除
