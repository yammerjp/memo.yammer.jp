---
title: "HugoでURLをパーセントエンコード (CloudinaryでOGP画像生成)"
date: 2020-12-26T20:52:36+09:00
tags: [ "hugo", "blog" ]
---

Hugo で Cloudinary<a id="annotation-1-from" href="#annotation-1" >^1</a> を用いた OGP 画像生成のため日本語を URL に埋め込みたい。
埋め込みのために文字列をパーセントエンコード<a id="annotation-2-from" href="#annotation-2" >^2</a> する方法を記す。

## 方法

Hugo のテンプレートの中で `$string` 変数に文字列が格納されているとき、次の表記で変数内の文字列をパーセントエンコードして出力できる。

```
{{- replace (substr (querify  "a" $string) 2) "+" "%20" -}}
```

例えば OGP 画像のためURLに日本語文字列を埋め込むのは次のようにして実現できる

```
{{ $title := "埋め込む文字列" }}
<meta
  property="og:image"
  content="https://res.cloudinary.com/basd4g/image/upload/{{- replace (substr (querify  "a" $title) 2) "+" "%20" -}}/v1608780036/memo-basd4g-net-ogp.png"
/>
```

## 経緯と補足

上記の方法は少々トリッキーである。
私の調べた範囲ではHugo に定義された関数の中で直接 URL をパーセントエンコードするものは見つけられなかった。
英語圏などでは` `(半角空白)を`%20`に置換すればよいのでは？という回答もあったが、日本語はそれでは困る。

しかしながらテンプレート内で表示されるページの URL を取得する `{{- .Permalink -}}` という値があるらしく、この値からは適切にパーセントエンコードされた値を取得できることがわかった。
ということで Hugo の内部で URL として扱われる文字列はパーセントエンコードされるっぽい。

そこで 任意の文字列を URL として Hugo に扱わせそうな機能である、URL クエリパラメータを生成する querify 関数を利用すると実現できることをみつけた。
上述の方法では、querify 関数によってパーセントエンコードされたクエリパラメータに変換し、クエリパラメータの先頭部分と半角空白文字を処理することで実現している。

というわけでこのブログもOGPに対応した。
もしもっとシンプルな方法があったら教えてください。

---

参考: Hugo

- [URL encoding (percent encoding) with Hugo? [SOLVED] - support - HUGO](https://discourse.gohugo.io/t/url-encoding-percent-encoding-with-hugo-solved/16546/3)
- [URLencode in Hugo - support - HUGO](https://discourse.gohugo.io/t/urlencode-in-hugo/24215/5)
- [Creating a resource from a string | Hugo](https://gohugo.io/hugo-pipes/resource-from-string/)
- [querify | Hugo](https://gohugo.io/functions/querify/)
- [replace | Hugo](https://gohugo.io/functions/replace/)
- [substr | Hugo](https://gohugo.io/functions/substr/)

参考: パーセントエンコード

- [URL Standard](https://url.spec.whatwg.org/)
- [URL Standard （日本語訳）](https://triple-underscore.github.io/URL-ja.html)
- [Percent-encoding (パーセントエンコーディング) - MDN Web Docs 用語集: ウェブ関連用語の定義 | MDN](https://developer.mozilla.org/ja/docs/Glossary/percent-encoding)
- [情報セキュリティ技術動向調査（2009 年下期）：IPA 独立行政法人 情報処理推進機構](https://www.ipa.go.jp/security/fy21/reports/tech1-tg/b_09.html)


---

<a id="annotation-1" href="#annotation-1-from" >^1</a>  ...
[Cloudinary](https://cloudinary.com) はアップロードした画像を配信できるサービスで、URL で画像の大きさや文字などを指定すると加工した画像が返却される機能がある。これを用いて記事のタイトルを URL に含め、事前にアップロードした背景画像と組み合わせて記事ごとの OGP 画像として配信することができる。

<a id="annotation-2" href="#annotation-2-from" >^2</a>  ... 
URL に使用できない文字を、文字コードに置換することで URL に有効な文字の範囲で表現する方法。
置換対象の文字を % とその後ろに文字コードの16進表現を続ける形に置換する。
例えば `https://ja.wikipedia.org/wiki/パーセントエンコーディング` は `https://ja.wikipedia.org/wiki/%E3%83%91%E3%83%BC%E3%82%BB%E3%83%B3%E3%83%88%E3%82%A8%E3%83%B3%E3%82%B3%E3%83%BC%E3%83%87%E3%82%A3%E3%83%B3%E3%82%B0` と表現できる。


