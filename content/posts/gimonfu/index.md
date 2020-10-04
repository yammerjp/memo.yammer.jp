---
title: "gimonfu で、はてなブログの記事を GitHub と同期する"
date: 2020-06-14T21:23:06+09:00
tags: [ "JavaScript", "はてなブログ", "CI", "GitHub Actions" ]
---

ブログをはてなブログに移行するにあたり、記事を管理する CLI [「gimonfu」](https://github.com/basd4g/gimonfu)を作成した。

本記事では、gimonfu と GitHub Actions を使って、GitHub のリポジトリとはてなブログを連携し、記事を git で管理できるように設定を行う。

記事の内容を設定すれば、Markdown ファイルを GitHub のリポジトリにプッシュするとはてなブログに記事を公開できたり、はてなの Web ページで記事を編集すると、GitHub のリポジトリに自動で反映されてバックアップを取ることができる。

最終的な GitHub Actions の設定は、[私のブログの記事リポジトリ](https://github.com/basd4g/basd4g.hatenablog.com/tree/master/.github/workflows)にある yaml にて確認できる。

## もくじ

次の流れで設定する

1. はてなブログの記事執筆設定を Markdown モードにする
2. はてなブログの API キーを確認する
3. GitHub リポジトリを作り、ワークフローに使う Secrets を登録する
4. 記事をダウンロードするワークフローを追加する
5. 記事をダウンロードするワークフローを定期実行させる
6. 記事をアップロードするワークフローを追加する

## 1. はてなブログの記事執筆設定を Markdown モードにする

はじめに、はてなブログの設定を変更し、記事執筆設定を Markdown モードにする。

[はてなブログの設定ページ](https://blog.hatena.ne.jp/-/config)から、設定 -> 編集モード を 「Markdownモード」に設定し「変更する」ボタンを押す


まずはてなブログの基本設定を開く。

![はてなブログの基本設定を開く](./1.png)

下へスクロールし、編集モードを Markdown モードにする。

![編集モードを Markdown モードへ](./2.png)

「変更する」ボタンを押して変更を反映する。

![「変更する」ボタンを押して変更を反映する](./3.png)

(補足: 他のモードでも動作確認はしていないので、もし Markdown 記法以外を利用する場合はご自身で試して欲しい。

## 2. はてなブログの API キーを確認する

[はてなブログの設定ページ](https://blog.hatena.ne.jp/-/config)から、設定 -> 詳細設定 に移動し、ユーザID, ブログID, API キー をメモする

まずはてなブログの詳細設定を開く。

![詳細設定へ移動](./4.png)

下へスクロールし、AtomPubの項目から、ユーザID, ブログID, APIキーを確認する。

![APIキーをメモする](./5.png)

## 3. GitHub リポジトリを作り、ワークフローに使う Secrets を登録する

ワークフローとは、GitHub Actions で実行する一連の内容を記したものである。
指定した時間になったときや、GitHub に コミットをプッシュしたとき、事前に作成したワークフローを自動で実行できる。

この章では、GitHub で新しいリポジトリを作り、ワークフローで使う Secrets を登録する。
  

まずは、新しいリポジトリを作った後、Settings -> Secrets を開く

![Secrets 登録画面を開く](./6.png)

ワークフローで使う Name と Value の組み合わせを5組登録する

![Secrets の Name と Value を登録する](./7.png)

登録する内容は次の通り。
例を参考に自分の文字列に置き換えてほしい。

| Name | Value | Value (例) |
| --- | --- | --- |
| `HATENA_USER` | 先程確認したはてなブログのユーザID | basd4g
| `HATENA_BLOG_ID` | 先程確認したはてなブログのブログID | basd4g.hatenablog.com |
| `HATENA_API_KEY` | 先程確認したはてなブログのAPIキー | abcdef0123 |
| `GIT_NAME` | (ワークフローで自動的に作られるコミットの)自分の名前 | Taro Yamada |
| `GIT_MAIL` | (ワークフローで自動的に作られるコミットの)自分のメールアドレス | basd4g@example.com |

## 4. 記事をダウンロードするワークフローを追加する

記事をダウンロードする GitHub Actions ワークフローを追加する。

ワークフローは GitHub リポジトリのWebページ上からも追加できる。

![新しいワークフローを追加する](./8.png)

![記事をダウンロードするワークフローを追加する](./9.png)

`.github/workflows/pull.yaml` に次の内容を記述する

```pull.yaml
name: Pull

on:
  push:
    branches: [ master ]

jobs:
  pull:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2

    - name: Deploy and Commit
      env:
        HATENA_USER_ID: ${{ secrets.HATENA_USER }}
        HATENA_BLOG_ID: ${{ secrets.HATENA_BLOG_ID }}
        HATENA_API_KEY: ${{ secrets.HATENA_API_KEY }}
        GIT_NAME: ${{ secrets.GIT_NAME }}
        GIT_MAIL: ${{ secrets.GIT_MAIL }}
        REPO_OWNER: ${{ github.repository_owner }}
      run: |
        cd ${GITHUB_WORKSPACE}

        # コミットのためのgitの設定
        echo 'git initialize'
        git config --global user.name "${GIT_NAME}"
        git config --global user.email "${GIT_MAIL}"
        git remote set-url origin "https://${REPO_OWNER}:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"
        echo 'gimonfu initialize'

        # gimonfuの初期設定
        npm init -y > /dev/null 2>&1
        npm install gimonfu
        echo "{\"user_id\":\"${HATENA_USER_ID}\",\"blog_id\":\"${HATENA_BLOG_ID}\",\"api_key\":\"${HATENA_API_KEY}\"}" > .gimonfu.json

        # 新しい/更新された記事をダウンロード
        echo 'gimonfu pull'
        npx gimonfu --git-commit-date pull

        # コミットを作成する
        git add entry
        # This script will not make a commit if there are no changes.
        if ! git diff --staged --exit-code --quiet; then \
          git commit -m "Pull articles (automatic commit)" ;\
        fi

        git push origin HEAD:master
```

コミットが GitHub 上にプッシュされると、ワークフローが走ってリポジトリに記事が反映される。

## 5. 記事をダウンロードするワークフローを定期実行させる

先程は初回だったので「master ブランチにプッシュしたときにワークフローを実行する」(=>はてなブログの内容を GitHub リポジトリに反映させる)設定にした。

ここではワークフローの一部を書き換えて、1時間に一回ワークフローを実行させる。

`.github/workflows/pull.yaml` の内容を一部書き換える。

```diff
--- a/.github/workflows/pull.yaml
+++ b/.github/workflows/pull.yaml
@@ -1,8 +1,8 @@
 name: Pull
 
 on:
-  push:
-    branches: [ master ]
+  schedule:
+    - cron: '0 * * * *'
 
 jobs:
   pull:
```

## 6. 記事をアップロードするワークフローを追加する

`.github/workflows/push.yaml`に次の内容を記述してコミット、プッシュする。

```.github/workflows/push.yaml
name: Push

on:
  push:
    branches: [ master ]

jobs:
  push:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2

    - name: Deploy and Commit
      env:
        HATENA_USER_ID: ${{ secrets.HATENA_USER }}
        HATENA_BLOG_ID: ${{ secrets.HATENA_BLOG_ID }}
        HATENA_API_KEY: ${{ secrets.HATENA_API_KEY }}
        GIT_NAME: ${{ secrets.GIT_NAME }}
        GIT_MAIL: ${{ secrets.GIT_MAIL }}
        REPO_OWNER: ${{ github.repository_owner }}
      run: |
        cd ${GITHUB_WORKSPACE}

        # コミットのためのgitの設定
        echo 'git initialize'
        git config --global user.name "${GIT_NAME}"
        git config --global user.email "${GIT_MAIL}"
        git remote set-url origin "https://${REPO_OWNER}:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"

        # gimonfuの初期設定
        echo 'gimonfu initialize'
        npm init -y > /dev/null 2>&1
        npm install gimonfu
        echo "{\"user_id\":\"${HATENA_USER_ID}\",\"blog_id\":\"${HATENA_BLOG_ID}\",\"api_key\":\"${HATENA_API_KEY}\"}" > .gimonfu.json

        # 新しい/更新された記事をアップロード
        echo 'gimonfu push'
        npx gimonfu --git-commit-date push
        git add entry

        # コミットを作成する
        # This script will not make a commit if there are no changes.
        if ! git diff --staged --exit-code --quiet; then \
          git commit -m "Pull articles (automatic commit)" ;\
        fi

        git push origin HEAD:master
```

## 6. 記事の投稿と更新

以上の設定を行うと、GitHub のリポジトリとはてなブログの記事が同期できる。

GitHub 上の Markdown ファイルを上書きすると記事が更新されるし、新しい Markdown ファイルを追加すると記事が投稿される。

Markdownファイルは次のような記述で始まる。

```md
---
title: タイトル
date: 2019-09-18T12:50:00.000Z
id: "26006613576772424"
---

記事本文が以降続く。
```

記事の冒頭に `---` で挟んだYAML形式のメタ情報を付加する。
`id: `の行は新規投稿時には記述しない。投稿されると自動で付加される。

## おわりに

ブログ記事を Git で管理したいというモチベーションから CLI を作るまでに至った。

GitHub Actions のワークフローを登録しておけば、ローカルに gimonfu をインストールせずに使えるが、インストールして使うこともできる。
`$ npm install -g gimonfu`でインストールでき、使い方は [README](https://github.com/basd4g/gimonfu) で説明している。

---

ここまで読んでいただいてありがとうございました。
あなたのはてなブログ生活が捗ることを願っています。

