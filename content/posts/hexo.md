---
title: "hexoによる静的サイトの構築"
date: "2020-03-16T09:09:00+09:00"
tags: [ "hexo", "JavaScript", "ブログ" ]
---

## Hexoによる静的サイトの構築

[Hexo](https://hexo.io/)は、node.jsを使った静的サイトジェネレータ。

markdown形式の記事を静的サイトに簡単に公開できる。

### Hexoの導入

```shell
$ npm install hexo-cli
$ npx hexo init ../memo.yammer.jp 
$ cd ../memo.yammer.jp
$ npm install
$ hexo server
# ローカルでサイトの確認
```

### Hexoの設定について

設定は基本的に`_config.yml`に書き込む。

例えば、このサイトの[`_config.yml`](https://github.com/yammerjp/memo.yammer.jp/blob/master/_config.yml)が一例。

### テーマの導入

Hexoはサードパーティで公開された様々なテーマを導入できる。

[公式サイトのテーマ一覧](https://hexo.io/themes/)にあるように、様々なものが選べる。

今回は[air-cloud](https://github.com/aircloud/hexo-theme-aircloud)を導入した。

```shell
$ git clone https://github.com/aircloud/hexo-theme-aircloud.git theme/air-cloud
```

テーマ特有の設定は、[Demo](https://github.com/aircloud/hexo-aircloud-blog)の[`_config.yml`](https://github.com/aircloud/hexo-aircloud-blog/blob/master/_config.yml)が参考になる。

### 特別なページの設置

#### 自己紹介ページの追加

```shell
$ npx hexo new page about
```

`source/about/index.md`を次の内容に編集する。


```md
---
layout: about
title: About Me
date: "2020-03-16 11:22:00"
---

## About Me

yammerjpの雑多なメモ。

- twitter: [@yammerjp](https://twitter.com/yammerjp)
- GitHub: [@yammerjp](https://github.com/yammerjp) 
- [blog](https://blog.yammer.fun)

```


#### タグページの追加

次のコマンドで、tagページを作る

```shell
$ npx hexo new page "tags"
```

`source/tags/index.md`を次のように書き換える


```md
---
title: All tags
type: "tags"
--- 
```

#### 検索機能の追加

```shell
$ npm i hexo-generator-search --save
```

`_config.yml`に次の内容を記載する

```yaml
# _config.yml
search:
  path: search.json
  field: post
```
