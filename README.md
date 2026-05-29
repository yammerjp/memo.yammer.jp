# memo.yammer.jp

日々のインプットを整理するためのブログです。Astro で生成して、GitHub Actions で `ghcr.io/yammerjp/memo.yammer.jp` に publish し、`shima` の k3s から配信しています。

## Development

```sh
npm install
export PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXX
npm run dev
```

## Commands

```sh
npm run build
npm test
npm run test:astro
npm run typecheck
```

- `npm run build:post-history` は記事の git 履歴キャッシュを生成します。
- `npm run test:astro` は Astro の生成 HTML を対象にした統合テストです。
- Google Analytics を出したい場合は、ビルド時に `PUBLIC_GOOGLE_ANALYTICS_ID` を設定します。

## Content

- `content/posts/*.md` - 記事
- `content/*.md` - 固定ページ

タグ一覧を数と一緒に出したいときは、`npm run tags:list` を使う。

## New Article

```sh
./bin/new.sh
```

## Commit Message

記事ページに git のコミットメッセージを表示しているので、コミットメッセージは日本語を基本にしています。

`.git-commit-template` をローカルのテンプレートに登録すると便利です。

```sh
git config --local commit.template .git-commit-template
```
