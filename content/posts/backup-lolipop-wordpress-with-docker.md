---
title: "ロリポップ上に公開された WordPress サイトを、ローカルの docker-compose 上で再現する"
date: 2021-04-24T03:41:20+09:00
---

表題の通り、ロリポップ！レンタルサーバ上に公開されている自身のWebサイトをバックアップし、さらに手元のPC上にdocker-composeで動作するように配置する。

## 前提の環境

- ロリポップ！レンタルサーバ上で WordPress を用いた Webサイトを構築している。
- macOS 10.15 Catalina
- [Docker Desktop for Mac がインストールされている](https://matsuand.github.io/docs.docker.jp.onthefly/docker-for-mac/install/)
- wget がインストールされている。 (Homebrew を用いて `brew install wget` でインストール)

## 手順1: ロリポップ上の情報をダウンロード

### 1-1: ファイルを抜き出す

はじめにロリポップ！ユーザ専用ページ > ユーザー設定 > アカウント情報 を開いてアカウント情報を確認する。
今回は以下の内容であったとする。

| | |
| --- | --- |
| FTPS サーバー | `ftp.lolipop.jp` |
| FTP ・WebDAV アカウント | `chu.jp-user` |
| FTP ・WebDAV パスワード | `password` |

次に、ターミナルから以下のコマンドを実行する。
ftp を使って、階層の深さ制限なしに再帰的にファイルをダウンロードする。

```sh
$ mkdir -p ~/lolipop-backup/download && cd ~/lolipop-backup/download
$ wget -r -l 0 "ftp://chu.jp-user:password@ftp.lolipop.jp"
# (ホスト名、ユーザ名、パスワードは適宜置き換えていただくとよし)
```

ちなみに私の場合は8分で200MB弱をダウンロードした。

### 1-2: データベースを抜き出す

1. ロリポップ！ユーザ専用ページ > サーバの管理・設定 > データベース を開く。
1. データベース名をメモする。今回は `LAA0000000-xxxxxx` であるとする。
1. phpMyAdmin を開く。
1. ログインして、画面左のデータベース名を選択 (今回で言えば `LAA0000000-xxxxxx`)。
1. "エクスポート" タブを開く。
1. エクスポート方法: "詳細 - 可能なオプションを全て表示" のラジオボタンを選択。
1. 生成オプションより追加コマンド: "CREATE DATABASE / USE コマンドを追加する" にもチェックを入れる。
1. 他はデフォルトのままで、ページ左下の "実行" をクリック。
1. ファイルがダウンロードされるので `~/lolipop-backup/downlaod/LAA0000000-xxxxxx.sql` に移動させる。

## 手順2: ローカルにWordPress環境を構築

### 2-1: docker-compose.ymlを整備する

`~/lolipop-backup/docker-compose.yml` を作成し、以下の内容を記述する。
`- MYSQL_DATABASE=LAA0000000-xxxxxx`の行についてのみ、イコール以降に各自のデータベース名を書き込む必要がある。

```docker-compose.yml
version: "3"
services:
  db:
    image: mysql:5.6
    container_name: "mysql"
    volumes:
      - ./db:/var/lib/mysql
      - ./db-init:/docker-entrypoint-initdb.d
    restart: always
    environment:
      - MYSQL_DATABASE=LAA0000000-xxxxxx # この行は各自で記述
      - MYSQL_USER=user
      - MYSQL_PASSWORD=password
      - MYSQL_ROOT_PASSWORD=root
  wordpress:
    image: wordpress:5.7.1
    container_name: "wordpress"
    volumes:
      - ./wp:/var/www/html
    restart: always
    depends_on:
      - db
    ports:
      - 8080:80
  phpmyadmin:
    image: phpmyadmin/phpmyadmin:latest
    container_name: "phpmyadmin"
    restart: always
    depends_on:
      - db
    ports:
      - 8888:80
    environment:
      - PMA_ARBITRARY=1
      - PMA_HOSTS=mysql
      - PMA_USER=user
      - PMA_PASSWORD=password
```

### 2-2: 抜き出したファイルを設置する

```sh
# 抜き出したファイル群を設置
$ cp -r ~/lolipop-backup/download/ftp.lolipop.jp ~/lolipop-backup/wp
# 上の行はロリポップ側でルートディレクトリに WordPress を設置している場合である
# ルートディレクトリ以外に WordPress を設置している場合は、index.php が wp ディレクトリの直下に配置されるようにコピー元のディレクトリを指定する

# 抜き出したデータベース初期化情報を設置
$ mkdir db-init
$ cp ~/lolipop-backup/download/LAA0000000-xxxxxx.sql ~/lolipop-backup/db-init/
```

### 2-3: WordPressの設定を変更

WordPress の設定が記述されたファイル `~/lolipop-backup/wp/wp-config.php` を編集し、WordPress が正しくデータベースに接続できるようにする。

- `define('DB_USER', '...');` →`define('DB_USER', 'user');`
- `define('DB_PASSWORD', '...');` →`define('DB_PASSWORD', 'password');`
- `define('DB_HOST', '...');` →`define('DB_HOST', 'mysql:3306');`

### 2-4: Search-Replace-DB を設置

のちほど、データベース内のURLを書き換える必要があるため、書き換えに用いるツールを配置する。

```
$ git clone https://github.com/interconnectit/Search-Replace-DB.git ~/lolipop-backup/wp/Search-Replace-DB
```

### 2-5: Apache の設定を変更

トップページ以外のページのURIを開いた時も、ApacheではなくWordPressに処理して欲しいので、リクエスト先をindex.phpに向ける必要がある。
`~/lolipop-backup/wp/.htaccess` に以下を記述する。

```.htaccess
# BEGIN WordPress

RewriteEngine On
RewriteBase /
RewriteRule ^index\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]

# END WordPress
```

## 手順3: 起動する

### 3-1. Dockerコンテナ群の立ち上げ

Dockerコンテナを立ち上げて、バックアップしたページが表示されることを確認する。

```sh
$ cd ~/lolipop-backup
$ docker-compose up -d
# 少し待つ (10秒とか。初回起動時はDBを初期化するので、立ち上げた瞬間にアクセスするとエラーが発生して開けない。開けないだけだが)

$ open http://localhost:8080
# トップページが開けることを確認する
# この状態ではリンクを踏むと、localhost ではなくWeb上のページに飛んでしまう
```

### 3-2. データベース内のURLの置換

WordPressのデータベース内では、URLが絶対パスで保持されているらしく、ここまでの手順では、ページ内リンクを踏むと、バックアップ元のWebサーバのページに飛んでしまう。この手順では、データベースを書き換えて、リンクを踏んでもローカルのページを回遊できるようにする。

今回は `www.example.com` に設置されたWebサイトをバックアップしているものとする。

1.Search Replace について

- `http://localhost:8080/Search-Replace-DB` を開く。
- replace (search for...) に `http://www.example.com`、with (replace with...) に `http://localhost:8080` を入力
- + add more search terms をクリック
- replace (search for...) に `https://www.example.com`、with (replace with...) に `http://localhost:8080` を入力

2.Database Details について

- database name に データベース名 (`LAA0000000-xxxxxx`など) を入力
- username に `user` と入力
- pass に `password` と入力
- host に `mysql` と入力
- port に `3306` と入力

Test connection を押して、「Success. You are connected.」と表示されることを確認する。

3.Which Tables? について

ラジオボタンが all tables を選択していることを確認する。

4.実行

入力に誤りがないことを確認して、不安なら「Do a safe test run」をしてみたあとに、「Search and Replace」を実行する。

---

ここまでの手順を踏めば、http://localhost:8080 上で正しくページが表示され、リンクを踏んでもローカルのページに飛べるはず。

## うまくいかないとき

- 「データベース接続確立エラー」と表示される。

まず、wp/wp-config.php の中が正しく書き換えられているか確認するとよさそう。
WordPress に接続した時に「データベース接続確立エラー」と表示される場合は、docker-compose.yml 内のホスト名(今回はmysqlコンテナの3306番に公開されたポートを観に行くので `mysql:3306`)・データベース名・ユーザ名・パスワード、初期化用sqlファイル内の CREATE DATABASE の行にあるデータベース名、wp-config.php の中にあるホスト名・データベース名・ユーザ名・パスワードが一致しているかを確認してみる

- WordPressのサイトが開けない。「サイトに重大なエラーがありました。」と表示される。

wp-config.php の中で `define('WP_DEBUG', false);` の行を `define('WP_DEBUG', true);` に書き換えるとデバッグモードになってエラーが表示されるので原因究明につながるかもしれない。
ちなみに ftp でファイルをダウンロードするとき、wget コマンドに `-l 0` オプションを指定しないと途中の階層までしかダウンロードされず、ファイルが欠けてWordPressが起動しなくなる。

- Webページを開くとApacheの404エラーページが出る。

.htaccess ファイルを設置して、リクエストしたURIに関わらずindex.phpで処理するように設定するとよいかも。
