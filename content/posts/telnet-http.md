---
title: "TELNETでHTTP通信する"
date: "2020-05-16T00:43:55+09:00"
tags: [ "Shell", "HTTP" ]
---

TELNETでHTTP通信するだけの記事である。
すぐ終わる。

相手ホストやポート番号、手書きのHTTPヘッダを渡せば、 TELNET で HTTP 通信ができる。

```sh
$ telnet memo.yammer.jp 80
Trying 2400:6180:0:d1::4df:d001...
Connected to memo-basd4g-net.netlify.com.
Escape character is '^]'.
GET / HTTP/1.1
Host: memo.yammer.jp
Connection: close

HTTP/1.1 301 Moved Permanently
Cache-Control: public, max-age=0, must-revalidate
Content-Length: 40
Content-Type: text/plain
Date: Fri, 15 May 2020 15:46:22 GMT
Location: https://memo.yammer.jp/
Age: 2
Connection: close
Server: Netlify
X-NF-Request-ID: e38b7b4a-47e9-4306-8d60-e917e96c78cd-2547281

Redirecting to https://memo.yammer.jp/
Connection closed by foreign host.
```

IPv6でつないでくれている。

あいにく memo.yammer.jp は HTTP をリダイレクトしてしまうのでページの内容は取得できなかったが、通信できた。

たまには HTTP ヘッダを手書きしてみるのも趣があるのではなかろうか。(??)

以上。

