# memo.basd4g.net

日々のインプットを整理するためのブログのリポジトリ with Next.js

[memo.basd4g.net](https://memo.basd4g.net)

## Setup

```sh
$ git clone https://github.com/basd4g/memo.basd4g.net.git
$ cd memo.basd4g.net
$ npm i
$ npm run dev &
$ open http://localhost:3000
```

## Directory Structure

- `content/posts/*.md` ... 各記事のMarkdownファイル
- `content/*.md`... 固定ページのMarkdownファイル

## Commit Message

[d2c19257b81842583cd561b5e2fba6365ace7b57](https://github.com/basd4g/memo.basd4g.net/commit/d2c19257b81842583cd561b5e2fba6365ace7b57) より、各記事のWebページ上にgitのコミットメッセージを記載するようにしたので、コミットメッセージは日本語で記載することとする。

次のようなスタイルを基本とする。

- `Post: 「投稿した記事タイトル」`
- `Append: 追記の内容`
- `Add: 機能追加の内容`
- `Fix: 記事/機能の修正内容`
- `Improve: 記事/機能の改善内容`
- `Update: 記事/機能の更新内容`
- `Delete: 記事/機能の削除内容`
- `Rename: 何を改名したか`
- `Move: 何を移動したか`
- `Change: 何を交換したか`
