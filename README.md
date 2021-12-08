# memo.yammer.jp

日々のインプットを整理するためのブログのリポジトリ with Next.js

[memo.yammer.jp](https://memo.yammer.jp)

## Setup

```sh
$ git clone https://github.com/yammerjp/memo.yammer.jp.git
$ cd memo.yammer.jp
$ docker-compose up
$ open http://localhost:3000
```

## Development

```sh
# run test
$ docker-compose run app npm test
```

## Directory Structure

- `content/posts/*.md` ... 各記事のMarkdownファイル
- `content/*.md`... 固定ページのMarkdownファイル

## New Article

```
$ ./bin/new.sh
```

## Commit Message

[d2c19257b81842583cd561b5e2fba6365ace7b57](https://github.com/yammerjp/memo.yammer.jp/commit/d2c19257b81842583cd561b5e2fba6365ace7b57) より、各記事のWebページ上にgitのコミットメッセージを記載するようにしたので、コミットメッセージは日本語で記載することとする。

`.git-commit-template` にあるスタイルを基本とする。

これは以下のコマンドでローカルリポジトリのコミットメッセージのテンプレートに登録できる

```
git config --local commit.message .git-commit-template
```
