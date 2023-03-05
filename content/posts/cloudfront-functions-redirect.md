---
title: "CloudFront Functionsで指定したURLにリダイレクトさせる"
date: "2022-10-08T10:25:00+09:00"
tags: [ "AWS", "CloudFront", "dotfiles" ]
---

CloudFront Functionsというサービスがあり、軽量のJavaScriptコードをデプロイしてCloudFrontディストリビューションに紐づけることができるらしい。
他のサーバレスの実行環境との比較は以下の記事が参考になる。

- [CloudFront Functions の導入 – 任意の規模において低レイテンシーでコードをエッジで実行 | Amazon Web Services ブログ](https://aws.amazon.com/jp/blogs/news/introducing-cloudfront-functions-run-your-code-at-the-edge-with-low-latency-at-any-scale/)
- [エッジで爆速コード実行！CloudFront Functionsがリリースされました！ | DevelopersIO](https://dev.classmethod.jp/articles/amazon-cloudfront-functions-release/)

ちょうどdotfilesリポジトリのセットアップ用スクリプトを取得できるエンドポイントを用意したかったので、今回はCloudFront Functionsで他のURLへの302リダイレクトを発行するエンドポイントを作成してみる。


まずは、AWSコンソールのCloudFrontのページへ行き、左側のメニューから「関数」を選択する。

![関数の作成](https://blob.yammer.jp/cloudfront-functions-01.png)


「関数を作成」を選択すると、サンプルコード付きのCloudFront Functionsの関数(実行できる一単位)が一つ作成される。

今回はリダイレクトしたいので、以下のようなコードに書き換える。

```javascript
function handler(event) {
    var response = {
            statusCode: 302,
            statusDescription: 'Found',
            headers: {
                "location": { "value": 'https://raw.githubusercontent.com/yammerjp/dotfiles/master/setup.sh' }
            }
    };
    return response;
}
```

テストタブでは関数を動作させてどんなレスポンスが返るかをみることができる。

![テスト実行の結果を確認する様子](https://blob.yammer.jp/cloudfront-functions-redirect-test.png)

問題なさそうであれば、発行タブから「関数を発行」する。
さらに作成した関数をCloudFrontのディストリビューションに紐付け、実際のWebからのリクエストで発火するようにする。

手元でcurlコマンドを実行してみると、実際にリダイレクトが確認できる。

```shell
$ curl http://dot.yammer.jp --verbose
*   Trying 2606:4700:3031::6815:2cf8...
* TCP_NODELAY set
* Connected to dot.yammer.jp (2606:4700:3031::6815:2cf8) port 80 (#0)
> GET / HTTP/1.1
> Host: dot.yammer.jp
> User-Agent: curl/7.64.1
> Accept: */*
>
< HTTP/1.1 302 Found
< Date: Thu, 06 Oct 2022 16:17:57 GMT
< Content-Length: 0
< Connection: keep-alive
< Location: https://raw.githubusercontent.com/yammerjp/dotfiles/master/.bin/download.sh
< X-Cache: FunctionGeneratedResponse from cloudfront
< Via: 1.1 b4dadadff1d09a3efb8a9374bdfc2848.cloudfront.net (CloudFront)
< X-Amz-Cf-Pop: NRT12-C2
< Alt-Svc: h3=":443"; ma=86400, h3-29=":443"; ma=86400
< X-Amz-Cf-Id: Hx-hLyCjKYgzxYXB_cUrSQgtHDgQW-maDnfZvaXmn0mtzPu2hC_YSg==
< CF-Cache-Status: DYNAMIC
< Report-To: {"endpoints":[{"url":"https:\/\/a.nel.cloudflare.com\/report\/v3?s=E2QYl2tLkUVmKzT2wAiYJhTp9NTPLj2s%2BtOwP%2Fx%2Fuq5qeDKYK5gttDmaBH8k1BxB9d0GPK8prNS7I5UMpG1aeUijjhl%2B32uT87m%2FhRGc6Jt9CGY1DHnld3Fku21CCEGZu2cnl6g2Yf1pvEU2"}],"group":"cf-nel","max_age":604800}
< NEL: {"success_fraction":0,"report_to":"cf-nel","max_age":604800}
< Server: cloudflare
< CF-RAY: 755fb5ce8bceafab-NRT
<
* Connection #0 to host dot.yammer.jp left intact
* Closing connection 0
$ curl -sL http://dot.yammer.jp | head -30
#!/bin/bash -e

if [ "$(whoami)" = "root" ]; then
  echo "The script must be running without root."
  exit 1
fi

REPO="yammerjp/dotfiles"

DOTFILES_DIR="$HOME/src/github.com/$REPO"
if [ -d "${DOTFILES_DIR}" ]; then
  echo "Dotfiles is already exist."
  echo "${DOTFILES_DIR}"
else

cat <<-"EOF"



      .o8                .    .o88o.  o8o  oooo
     "888              .o8    888 `"  `"'  `888
 .oooo888   .ooooo.  .o888oo o888oo  oooo   888   .ooooo.   .oooo.o
d88' `888  d88' `88b   888    888    `888   888  d88' `88b d88(  "8
888   888  888   888   888    888     888   888  888ooo888 `"Y88b.
888   888  888   888   888 .  888     888   888  888    .o o.  )88b
`Y8bod88P" `Y8bod8P'   "888" o888o   o888o o888o `Y8bod8P' 8""888P'




$
```

