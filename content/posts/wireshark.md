---
title: "WiresharkでHTTP通信の内容を確認する"
date: "2022-08-23T22:32:06+09:00"
tags: [ "ネットワーク", "Wireshark", "HTTP", "TCP", "tcpdump" ]
---

[Wireshark](https://www.wireshark.org)はネットワークプロトコルアナライザとよばれるソフトウェアで、通信の内容を確認することができる。

以下では簡単な使い方として、curlコマンドを使って手元のPCからインターネット上のサーバへHTTP通信した場合のパケットの内容を、tcpdumpでキャプチャし、最後にWiresharkのGUI画面上で確認する手順を示す。
なお、実行したPCは macOS 11.6 BigSur (Apple M1) だが、他の環境でも同様の手順で実行できると思われる。

## パケットのキャプチャ

まずはじめに、キャプチャするパケットを絞り込めるよう、事前に通信先のIPアドレスを調べておく。
次に、tcpdumpコマンドをsudoで実行し、キャプチャするパケットの通信先IPアドレスを指定した上で、内容を適当なファイルに書き込む。 (ここでは`/tmp/memo-yammer-jp`とする。)

(後述のcurlコマンド実行後、キャプチャが終わったらCtrl-cで終了する。)

```
$ dig @8.8.8.8 memo.yammer.jp +short
199.36.158.100
$ sudo tcpdump host 199.36.158.100 -w /tmp/memo-yammer-jp
Password:
tcpdump: data link type PKTAP
tcpdump: listening on pktap, link-type PKTAP (Apple DLT_PKTAP), capture size 262144 bytes
^C11 packets captured
243 packets received by filter
0 packets dropped by kernel
```

別のウィンドウでシェルを開き、curlコマンドを実行してキャプチャされるパケットを送受信する。
ここでは内容が確認できるよう、暗号化されていないHTTPプロトコルを指定している。

```
$ curl http://memo.yammer.jp --verbose
*   Trying 199.36.158.100...
* TCP_NODELAY set
* Connected to memo.yammer.jp (199.36.158.100) port 80 (#0)
> GET / HTTP/1.1
> Host: memo.yammer.jp
> User-Agent: curl/7.64.1
> Accept: */*
>
< HTTP/1.1 301 Moved Permanently
< Server: Varnish
< Retry-After: 0
< Location: https://memo.yammer.jp/
< Content-Length: 0
< Accept-Ranges: bytes
< Date: Tue, 23 Aug 2022 13:26:48 GMT
< Connection: close
< X-Served-By: cache-hnd18733-HND
< X-Cache: HIT
< X-Cache-Hits: 0
< X-Timer: S1661261209.536052,VS0,VE0
<
* Closing connection 0
```

## パケットの内容の確認

tcpdumpをCtrl-cで終了し、パケットがキャプチャできたら、出力されたファイルをWireshark[^1]から確認してみる。
Wiresharkを起動し、ファイルを開くボタンを選択する。

![Wiresharkの起動画面](https://blob.yammer.jp/wireshark-start-up.png)

次に、ファイル名を指定して開く。

![Wiresharkでファイル名を指定して開く](https://blob.yammer.jp/wireshark-open-file.png)

すると、パケットのキャプチャ結果が表示され、画面の中央部にはHTTPのヘッダが表示されているのがわかる。

![Wiresharkで表示したHTTPのヘッダ](https://blob.yammer.jp/wireshark-capture-packet.png)

[^1]: Wiresharkは次のURLからダウンロードできる。 https://www.wireshark.org/download.html
