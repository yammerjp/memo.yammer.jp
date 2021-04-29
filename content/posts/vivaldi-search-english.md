---
title: "ブラウザの検索バーから英語サイトに絞って検索出来るようにする (Vivaldi編)"
date: 2020-11-18T02:47:11+09:00
---

コードを書いていると, 英語のサイトに絞ってGoogle検索したいときがままある。
日本語だと文献がみつからなかったり、いかがでしたかブログのような検索結果ばかりが上位に並んだりして、公式のドキュメントだったりに飛ぶには英語で探したほうが早かったりする。

いままでは検索言語を変更する度に、Googleの検索結果ページからオプションを指定できるページに飛んで言語を変更して... とやっていたのだが、結構面倒くさいので楽に出来る方法がないかと考えて思いついたのが以下のやり方。

## 設定内容

URLのクエリパラメータで検索結果の対象言語(`lr=lang_en`)と表示言語(`hl=en`) [^1] を指定できるので、それらを言語ごとに指定して別の検索エンジンとしてブラウザに登録する。

参考: [Request Format - Google Search Appliance Help](https://support.google.com/gsa/answer/6329265?hl=en) [^2]

今メインで使っているブラウザであるVivaldiを対象に設定方法を記すが、他のブラウザでも多分同じことが出来ると思う。
(Vivaldi編と名乗っているが他のブラウザ編は多分公開されない。)

1. アドレスバーに `vivaldi://setings/search/` と入力して検索エンジンの設定画面を開く
2. 次の検索エンジンを追加する

| 名称 | ニックネーム | URL |
| --- | --- | --- |
| Google(en) | ge | `https://www.google.com/search?lr=lang_en&hl=en&q=%s` |
| Google(jp) | gj | `https://www.google.com/search?lr=lang_ja&hl=ja&q=%s` |

Vivaldi では、URLの中に埋め込んだ%sが検索ワードに置換されて送信される。

![vivaldiの検索エンジン設定画面](https://blob.basd4g.net/vivaldi-settings-search.png)

## 検索時

Vivaldi には検索エンジンにニックネームをつけることができるので、これを活用して検索する。

例えばブラウザのアドレスバーに `gj golang` と入力してエンターを押せば日本語の検索結果が、`ge golang` と入力してエンターを押せば英語の検索結果が表示される。


![Googleでgolangと検索した結果 (日本語版)](https://blob.basd4g.net/google-search-golang-ja.png)
![Googleでgolangと検索した結果 (英語版)](https://blob.basd4g.net/google-search-golang-en.png)

便利。

[^1]: 表示言語を変える必要は本来無いのだが、今どの言語で検索しているかわかりやすいので設定している。
[^2]: このGoogleのドキュメントも日本語版は無いので、英語ロケールなら1ページ目の中にあったが日本語ロケールでは中々ヒットしない。
