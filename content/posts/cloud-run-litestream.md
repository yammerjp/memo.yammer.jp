---
title: "HerokuからCloud Run + Litestreamへ移行した"
date: "2022-10-12T10:15:00+09:00"
tags: [ "CloudRun", "heroku", "docker", "SQLite", "Litestream", "雑記" ]
---

## はじめに

[Herokuの無料枠が終了](https://blog.heroku.com/next-chapter)することにあわせて、個人で動かしているRailsアプリケーションを他の場所へ移行する。
いままで無料で使わせていただいたこと感謝しつつも、月千円ほど払うほどのアプリケーションでもないので、ほぼ無料で移行できそうな場所を探すことにした。[^1]

コンテナをホスティングできるGoogle Cloud Runは従量課金制だが、個人で使う分にはほぼ無料なので、これを選ぶことにする。
Cloud Runで使うRDBは一般にはGoogle Cloud SQLが推奨されていそうだが、ここでは安さのためにSQLite3 + Litestream + Google Cloud Storage(以下GCS)を使うこととしたい。

## 実装の方向性

[Litestream](https://litestream.io)は、SQLite3のデータベースを、オブジェクトストレージやNFS、SFTPのストレージにレプリケーションできるOSSのソフトウェア。

今回はコンテナの起動時にデータベースをGCSから復元し、コンテナの実行中はGCSへレプリケーションしつづける動作を実装する。
Dockerコンテナのエントリポイントに設定するシェルスクリプトのなかで、アプリケーションの起動前に処理を加えて対応する。

コンテナの同時実行数は0~1にしている。
0にしていいのかは微妙だが、個人でしか使っていないうえ、大して重要なデータを扱っているわけでもないのでひとまずこれで様子を見ることにする。

## 移行の手順

ざっくり以下の手順で進めた。

### SQLite3化

まず、PostgreSQLからSQLite3へ移行する。
Railsに用意されたコマンド `./bin/rails db:system:change --to=sqlite3` を実行するだけで、環境問わずSQLite3で動くように修正された。

あわせてDocker化しておく。
適当なDockerfile (とdocker-compose.yml) を書いて、手元のPCのDocker上で立ち上がるようにした。

### LitestreamとGCSの利用

Litestreamのレプリケーション先にGCSを利用するので、GCSのセットアップをする。
まず、GCSにバケットを作り、接続情報を用意する。
権限を絞るためにサービスアカウントを作成し、取得した認証情報のJSONを保存しておく。[^2]

<details>
<summary>
2023/01/17追記: くのきみさんから教えていただき、Cloud RunとLitestreamの組み合わせの場合、GCSの認証情報はよしなに取得してくれるようです。この記事で行っているような認証情報の設定は不要であることがわかりました。
</summary>

> On a Compute Engine VM or Cloud Run service, Litestream will automatically pick up the credentials associated with the instance from the instance’s metadata server.
https://litestream.io/guides/gcs/

https://twitter.com/knokmki612/status/1614856237774168064

くのきみさん、情報提供ありがとうございます。

---

</details>

つぎに、Dockerコンテナ起動時にLitestreamによる復元とレプリケーションを設定する。

Dockerfileでは、Litestreamのインストールと設定ファイルの設置を行っている。[^3]

```Dockerfile
# Dockerfile
FROM rubylang/ruby:3.0.1-focal

RUN mkdir /app
WORKDIR /app

# Google Cloud Storageへの接続情報を保存するファイルのパスを事前に指定しておく。
# コンテナイメージにこのファイルを含める必要はない。
ENV GOOGLE_APPLICATION_CREDENTIALS /app/.gcs-credentials.json

ENV TZ Asia/Tokyo
RUN apt update \
 && apt install -y sqlite3 \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*

# Litestreamのバイナリを設置する。
ADD https://github.com/benbjohnson/litestream/releases/download/v0.3.8/litestream-v0.3.8-linux-amd64-static.tar.gz /tmp/litestream.tar.gz
RUN tar -C /usr/local/bin -xzf /tmp/litestream.tar.gz

ADD Gemfile /app/Gemfile
ADD Gemfile.lock /app/Gemfile.lock
RUN bundle install

COPY . /app

# Litestreamの設定ファイルを設置する。
COPY ./litestream.yml /etc/litestream.yml
```


```yaml
# litestream.yml
dbs:
  - path: /app/db/production.sqlite3
    replicas:
      - url: gcs://____YOUR_BACKET_NAME____/db/production.sqlite3
  - path: /app/db/staging.sqlite3
    replicas:
      - url: gcs://____YOUR_BACKET_NAME____/db/staging.sqlite3
```

entrypoint.shでは、データベースを復元してからレプリケーションを開始する。
あわせて以下も実装している。

- 開発環境や初回起動時は、データベースの復元の代わりに、マウントされたファイルを使う、もしくは`rake db:migrate:reset`する。
- ポート番号は`$PORT`を優先して利用する。[^4]
- 接続情報は環境変数に集約する。LitestreamはGCSへの接続情報として`$GOOGLE_APPLICATION_CREDENTIALS`にJSONファイルへのパスが入ることを期待する。コンテナイメージに接続情報を含めないために、JSONをbase64でエンコードして環境変数に保存しておき、起動時に書き出す。

entrypoint.sh

```bash
#!/bin/bash -e

# entrypoint.sh

if [ "$RAILS_ENV" = "" ]; then
  DATABASE_FILE="db/development.sqlite3"
else
  DATABASE_FILE="db/$RAILS_ENV.sqlite3"
fi
DATABASE_FILE_FULLPATH="/app/$DATABASE_FILE"
DATABASE_FILE_BACKET_FULLPATH="gcs://____YOUR_BACKET_NAME____/$DATABASE_FILE"


# PORT番号は$PORTを優先する
if [ "$PORT" = "" ]; then
  PORT=8080
fi
EXEC_COMMAND="bundle exec rails server -p $PORT -b 0.0.0.0"


if [ "$RAILS_ENV" = "production" ] || [ "$RAILS_ENV" = "staging" ] ; then
  USE_LITESTREAM="true"
else
  USE_LITESTREAM="false"
fi


# Litestreamを使う場合は、データベースをGCSから復元する
if [ "$USE_LITESTREAM" = "true" ] ; then
  # GCSの接続情報を環境変数から読み込み、base64デコードしてからファイルに書き込む
  # (事前に、接続情報をbase64エンコードして環境変数に設定しておく)
  if [ "$GOOGLE_APPLICATION_CREDENTIALS" = '' ] || [ "$GOOGLE_APPLICATION_CREDENTIALS_BASE64" = '' ] ; then
    echo "Need to set \$GOOGLE_APPLICATION_CREDENTIALS and \$GOOGLE_APPLICATION_CREDENTIALS_BASE64"
    exit 1
  fi
  echo "$GOOGLE_APPLICATION_CREDENTIALS_BASE64" | base64 --decode > "$GOOGLE_APPLICATION_CREDENTIALS"

  # GCSからデータベースを復元する
  litestream restore -v -if-replica-exists -o "$DATABASE_FILE_FULLPATH" "$DATABASE_FILE_BACKET_FULLPATH"
fi

# データベースを初期化する (初回起動時は復元されたファイルがないため)
if ! [ -f "$DATABASE_FILE_FULLPATH" ] && [ "$ALLOW_RESET_DATABASE" = 'true' ]; then
  rake db:migrate:reset
  # ここで初期化用のSQLを流してもよい
  # if [ -f "$SETUP_SQL_PATH" ]; then
  #   cat "$SETUP_SQL_PATH" | sqlite3 "$DATABASE_FILE_FULLPATH"
  # fi
fi

if ! [ -f "$DATABASE_FILE_FULLPATH" ]; then
  echo "$DATABASE_FILE_FULLPATH is not found..."
  exit 1
fi


if [ "$USE_LITESTREAM" = "true" ] ; then
  # Litestreamによってレプリケーションしながら、アプリケーションを起動する
  exec litestream replicate -exec "$EXEC_COMMAND" -config /etc/litestream.yml
else
  # shellcheck disable=SC2090
  exec $EXEC_COMMAND
fi
```

### アプリケーションのデプロイ

Staging環境をつくって、ひとまずは`gcloud`コマンドで手動でデプロイしたあとに、GitHubのリポジトリと紐付けて自動デプロイがなされるように設定した。

Cloud RunとLitestream関係ないが、`RAILS_ENV=production`として動かすためやコンテナ上で動かすための設定(`RAILS_LOG_TO_STDOUT`や`RAILS_SERVE_STATIC_FILES`など)をいくつか調整した。

### データの移行

HerokuのPostgreSQLからのデータの移行は、`pg_dump`を用いた。

```shell
# 接続先の認証情報を得る
$ heroku pg:credentials:url --app APPNAME
# 認証情報を使って、データベースの内容をINSERT文形式で取得する。
$ pg_dump --data-only --no-owner --no-privileges --disable-dollar-quoting --no-acl --inserts -h HOSTNAME -U USERNAME DBNAME > data.sql
```

得られた`data.sql`をちょこちょこ編集して、SQLite3で読み込めるINSERT文だけにする。
SQLを流し込むのはローカルPC上で実施した。
`entrypoint.sh`を一時的にすこし変えて、`rake db:migrate:reset`のあとに`data.sql`を流し込むようにしておく。

さきほどの`entrypoint.sh`を使えば、環境変数に応じてローカルPC上でも本番環境のデータベースをレプリケーションできる。
`RAILS_ENV=production`としてコンテナを立ち上げて、データが挿入されているのを確認したら移行はおわり。

### 感想

Cloud Run + Litestream + GCSはコールドスタート時は少し時間がかかるが、Herokuの無料枠とさして変わらないかむしろ早いかもしれない。[^5]
それ以外の動作は結構サクサクしていていい感じ。

ローカルでも気軽に同じ構成で動かせたりして結構よいので、Cloud RunでLitestreamを使うテンプレートを用意したい気持ちになった。

[^1]: お金がかかってもよい場合のホスト先はRenderやFly.io、もしくはHerokuのEco Dynoなどがありそう。[Herokuの新しい有料プランのまとめと、無料プラン終了後の個人的な移行方針について - give IT a try](https://blog.jnito.com/entry/2022/10/04/104100)
[^2]: 参考: [特定のGCSバケットにのみアクセスできるサービスアカウントの作り方 - Carpe Diem](https://christina04.hatenablog.com/entry/access-gcs-bucket-with-iam-policy)
[^3]:  参考: [Cloud RunとLitestreamで激安GraphQL/RDBサーバーを動かす](https://zenn.dev/oubakiou/articles/382839bfc65931)
[^4]: Cloud Runでは環境変数`PORT`を参照することがおすすめされている。[既存のサービスを移行する  |  Cloud Run のドキュメント  |  Google Cloud](https://cloud.google.com/run/docs/migrating?hl=ja)
[^5]: データ量が大変少ない単純なアプリケーションだからということもあるだろう。
