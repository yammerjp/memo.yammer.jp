---
title: "Dockerチートシート プログラマのためのDocker教科書 第2版より"
date: "2020-08-14T18:59:31+09:00"
tags: [ "Docker", "Shell" ]
---

以下、過去の自分用メモの移動。

dockerに入門するにあたり「プログラマのためのDocker教科書 第2版より」を読んだ。
Dockerfileを書いてコンテナを走らせるための自分向けのまとめをチートシート的に書き記す。

## Dockerfileの命令

### 命令一覧

- FROM .. ベースイメージの指定
- RUN .. コマンド実行
- CMD .. コンテナの実行コマンド
- LABEL .. ラベルを設定
- EXPOSE .. ポートのエクスポート
- ENV .. 環境変数
- ADD .. ファイル/ディレクトリの追加
- COPY .. ファイルのコピー
- ENTRYPOINT .. コンテナの実行コマンド
- VOLUME .. ボリュームのマウント
- USER .. ユーザの指定
- WORKDIR .. 作業ディレクトリ
- ARG .. Dockerfile内の変数
- ONBUILD .. ビルド完了後に実行される命令
- STOPSIGNAL .. システムコールシグナルの設定
- HEALTHCHECK .. コンテナのヘルスチェック
- SHELL .. デフォルトシェルの設定

### コメント

```Dockerfile
# コメント
命令 # コメント
```

### FROM

```Dockerfile
FROM centos:7
# FROM [イメージ名]
# FROM [イメージ名]:[タグ名]
# FROM [イメージ名]@[ダイジェスト]
```

#### ダイジェスト

Docker Hubにアップロードする際に自動で付与されるユニークな識別子。
ダイジェストを使うことでイメージを一意に指定できる。
`docker image ls --digests`で確認できる

### build

```bash
$ docker build -t [作成するイメージ名]:[タグ名] [Dockerfileのあるディレクトリのパス]
```

## docker engineの状態を確認
```
$ docker version
$ docker tutorial
$ docker system info
$ docker system df
# disk info
```

## nginxをdockerで動かしてみる
```
$ docker pull nginx
$ docker image ls
$ docker container run --name nginxserver -d -p 80:80 nginx
# open http://localhost:80/ on web browser
$ docker ps
$ docker stop nginxserver
$ docker start nginxserver
```

## centosをpullしてみる
```
# p96
$ docker image pull centos:7
$ docker image ls
```

## DCT

docker imageが改ざんされているかどうか、公開鍵(Tagging Key)を用いて検証し、改ざんがある場合そのイメージを無効化する機能。

有効化するには環境変数を付加

署名なしイメージのpull時は無効化しなければならない。

```
# enable
$ export DOCKER_CONTENT_TRUST=1

# disable
$ export DOCKER_CONTENT_TRUST=0
```

## docker imageの操作

```
# pullしたイメージの詳細情報を確認(イメージID,作成日,dockerのversion,CPUアーキテクチャ等)
$ docker image inspect ubuntu:latest

# jsonの一部のみを取得
$ docker image inspect --format="{{ .Os }}" ubuntu:latest
$ docker image inspect --format="{{ .ContainerConfig.Image }}" ubuntu:latest

# docker image にタグ付け
$ docker image tag nginx yammerjp/nginxserver:1.0

# docker hub上のimage(この場合はnginx)を検索
$ docker search nginx 
# Option: --no-trunc .. 結果をすべて表示,  --limit n .. n件の検索結果, --filter=stars=n .. star数下限による絞り込み

$ docker image rm [--force(-f) --no-prun] yammerjp/nginxserver
# --force .. -f , --no-prune .. 中間イメージを削除しない
# yammerjp/nginxserver ... REPOSITORYではなくIMAGE IDでも良い

$ docker image prune [--all(-a) --force(-f)]
# 未使用のdocker imageを削除
```

## docker image のpush

```
$ docker login -u yammerjp -p xxx
$ docker image push yammerjp/nginxserver:1.0
$ docker logout
```

## docker container run

```
$ docker container run [ option ] yammerjp/nginxserver
$ docker run [ option ] yammerjp/nginxserver # containerは省略可能
$ docker run -it --name "test1" ubuntu /bin/bash
$ docker run -d -p 8080:80 nginx
$ docker run -d --dns 8.8.8.8 nginx
$ docker run -d --mac-address="92:d0:c6:0a:29:33" ubuntu
# $ docker container inspect --format="{{ .Config.MacAddress }}" [Container ID]
$docker run -id --add-host test.com:192.168.0.1 ubuntu
```

### 実行開始時オプション

--attach(-a) STDIN/STDOUT/STDERR --cidfile --detach(-d) --interactive(-i) --tty(-t) 

- -a .. 標準入力/標準出力/標準エラー出力にアタッチ
- -d .. バックグラウンドで実行
- -i .. コンテナの標準入力を開く
- -t .. 端末デバイスを使う

### 終了時オプション
- --restart .. no (再起動しない)/ on-failure (終了ステータスが0でないなら再起動)/ on-failure:4 (終了ステータスが0でないなら4回再起動/ always (常に)/ unless-stopped (直前のコンテナの状態が停止状態でなければ再起動)
- --rm .. 実行後のコンテナを自動で削除(--restartオプションと排他)

### ネットワークオプション
- --add-host=localhost:127.0.0.1 ... コンテナの/etc/hostsにホスト名とIPアドレスを定義
- --dns=8.8.8.8 ... コンテナ用のDNSサーバのIPアドレス
- --expose .. 指定したレンジのポート番号を割り当てる
- --mac-address=FF:FF:FF:FF:FF:FF .. コンテナのMACアドレスを指定
- --net=[bridge | none | container:<name | id > | host | NETWORK] .. コンテナのネットワークを指定
- --hostname(-h) .. コンテナ自信のホスト名を指定
- --publish(-p) [ホストのポート番号]:[コンテナのポート番号] .. ホストとコンテナのポートマッピング
- --publish-all(-P) .. ホストの任意のポートをコンテナに割り当てる

### リソースオプション

- --cpu-shares(-c) .. CPUの使用の配分(1024が100%)
- --memory(-m) .. 使用するメモリを制限(単位はb,k,m,gのいずれか)
- --volume(-v)=[ホストのディレクトリ]:[コンテナのディレクトリ] .. ディレクトリを共有

### 環境変数など

- --env(-e)=[環境変数] .. 環境変数を設定
- --envfile=[ファイル名] .. fileから環境変数を設定
- --readonly=[true|false] .. コンテナのファイルシステムを読み込み専用にする
- --workdir(-w)=[パス] .. コンテナの作業ディレクトリを指定する
- --user(-u)=[ユーザ名] .. ユーザ名かUIDを指定する

```
$ docker run --cpu-shares=512 --memory=1g ubuntu
$ docker run -v /Users/yammerjp/webap:/usr/share/nginx/html nginx
```

## docker network

```
$ docker network create -d bridge webap-net
$ docker container run --net=webap-net -it ubuntu

$ docker network ls
$ docker network connect [ option ] ネットワーク コンテナ
$ docker network disconnect ネットワーク コンテナ
$ docker network inspect [ option ] ネットワーク
$ docker network rm [ option ] ネットワーク

```
## コンテナの状態確認

```
$ docker container ls [ --all(-a) --filter(-f) --format --last -8 --latest -l --no-trunc --quiet(-q) --size(-s) ]
# 稼働しているコンテナの状態一覧

$ docker container stats コンテナ識別子
# コンテナ稼働確認 識別子はnginxserver等 Ctrl+Cで終了

$ docker container top コンテナ識別子
# コンテナで実行中のプロセスを確認
```

## コンテナの状態変更

```
$ docker container start[ --atatch(-a) --interactive(-i) ] コンテナ識別子
$ docker container stop [ -time(-t) ..コンテナの停止時間を指定する(defaultは10s) ] コンテナ識別子
$ docker container restart [ -time(-t) ..コンテナの再起動時間を指定する(defaultは10s) ] コンテナ識別子

$ docker container pause コンテナ識別子
$ docker container unpause コンテナ識別子
```

## others

```
$ docker container rm [ --force(-f) .. 起動中のコンテナを強制的に削除 , --volumes(-v) .. 割り当てたボリュームを削除 ] コンテナ識別子

$ docker container attach コンテナ識別子
# 接続後、Ctrl+Cでコンテナごと終了、デタッチのみはCtrl+P -> Ctrl+Q

$ docker container exec [ --detach(-d) --interactive(-i) --tty(-t) --user(-u) ] コンテナ識別子 実行コマンド

$ docker container top

$ docker container port # 転送されているポートの確認

$ docker container cp コンテナ識別子:コンテナ内のファイルパス ホストのディレクトリパス # ファイルをコピー
# cp以後を逆にすると、逆転送も可能

$ docker container diff コンテナ識別子　
# コンテナがイメージから作成されたときとの差分 A..ファイル追加 B..ファイル削除 C..ファイル更新

$ docker container commit [オプション] コンテナ識別子 [イメージ名[:タグ名]

```

