---
title: "cocot46を組み立てた(Build Log)"
date: "2022-05-16T00:58:59+09:00"
tags: [ "自作キーボード" ]
ogImage: https://blob.yammer.jp/cocot46-4.jpg
---

トラックボールとロータリーエンコーダを搭載した40%キーボード、cocot46を組み立てました。

購入のきっかけはcocot46の作者の[@aki27kbd](https://twitter.com/aki24kbd)さんが再販予定をツイートされているのを見かけたことでした。

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr"><a href="https://twitter.com/hashtag/cocot46lp?src=hash&amp;ref_src=twsrc%5Etfw">#cocot46lp</a> は、手持ちのトラックボールモジュール在庫の数だけキットに同梱したものを近日中にboothにて頒布します。無印の <a href="https://twitter.com/hashtag/cocot46?src=hash&amp;ref_src=twsrc%5Etfw">#cocot46</a> も同様にトラックボールモジュールを同梱したものを遊舎工房に委託予定です。どちらも在庫限りとなる予定なので、気になる方はこの機会にぜひ。</p>&mdash; aki27 (@aki27kbd) <a href="https://twitter.com/aki27kbd/status/1515311831375843335?ref_src=twsrc%5Etfw">April 16, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

トラックボール一体型のキーボードが気になっていたものの、1Uのトラックボールユニットは終売となっていて手に入れるのが難しそうだと思っていた時だったので、ツイートをみかけて嬉しくなりました。
このあとは再販するのを待っていて、在庫が復活した日に注文しました。
その日の夜には売り切れていたので、トラックボール一体型のキーボードを求めている人が結構いるのかもしれません。

<!--
ちなみにもともとの私のスタイルとしては、キーボードは40%のOrtholinearないしColumn staggeredな配列のもの、ポインティングデバイスはトラックボール([Kensington Orbit](https://www.kensington.com/ja-jp/p/%E8%A3%BD%E5%93%81/%E3%82%B3%E3%83%B3%E3%83%88%E3%83%AD%E3%83%BC%E3%83%AB/%E3%83%88%E3%83%A9%E3%83%83%E3%82%AF%E3%83%9C%E3%83%BC%E3%83%AB/%E3%82%AA%E3%83%BC%E3%83%93%E3%83%83%E3%83%88%E3%83%88%E3%83%A9%E3%83%83%E3%82%AF%E3%83%9C%E3%83%BC%E3%83%AB%E3%82%A6%E3%82%A3%E3%82%BA%E3%82%B9%E3%82%AF%E3%83%AD%E3%83%BC%E3%83%AB%E3%83%AA%E3%83%B3%E3%82%B0/))を使っていました。
-->

## 買ったもの

キースイッチはPlanck Keyboardに取り付けていて静音性に安心感のあるGateron Ink v2 Silent Blackを使用しました。
キーキャップもPlanck Keyboardのときにお世話になったTALP Keyboardのブランクキーキャップを改めて使用。色味がかわいいので気に入っています。

![](https://blob.yammer.jp/cocot46-0.jpg)

写真にはシルバーのロータリーエンコーダ用ノブが写っていますが、これは寸法的に取り付けられず誤って買ってしまったものでした。ロータリーエンコーダにノブが付属しているので今のところは困っていません。

| 商品名 | 個数 | 単価(円) | 小計(円) |
| --- | --- | ---:| ---:|
| [【委託】cocot46（トラックボールモジュール付き）](https://shop.yushakobo.jp/products/2817?variant=40863445549217) | 1 | 16000 | 16000 |
| [ロータリーエンコーダ 24クリック / プッシュスイッチ付き / 高さ20mm (EC12互換品)](https://shop.yushakobo.jp/products/3762) | 1 | 330 |  330 |
| [XDA PBT ブランク キーキャップ (ホワイト/2個)](https://talpkeyboard.net/items/60f987230d4f3a07a4652ec3) | 19 | 110 | 2090 |
| [XDA PBT ブランク キーキャップ (アプリコット/2個)](https://talpkeyboard.net/items/616a3e71ac36613c126c4fa0) | 4 | 110 | 440 |
| [XDA PBT ブランク キーキャップ (グレー/2個)](https://talpkeyboard.stores.jp/items/5b6e593d5f78663893000482) | 4 | 110 | 440 |
| [Gateron Ink スイッチ v2 (10個入り) Silent Black](https://shop.yushakobo.jp/products/gateron-ink-switches) | 5 | 1320 | 6600 |
| TALP KEYBOARD キースイッチ 10個以上購入で5%オフ |   |      | -95 |
| TALP KEYBOARD 送料 |   |     | 300 |
| __合計__ |   |     | 25805 |

40%だからということもありますが、結構安い気がします。
特にcocot46のキットは、同梱されていたパーツが多かった割に値段が安かったように思います。

## 組み立て

組み立ては[ビルドガイド](https://github.com/aki27kbd/cocot46/blob/main/doc/buildguide.md)の通りに素直に進めました。
チップ抵抗を途中で机の下に落として探すのが一番難しかったです。

組み立てたのちに、Google ChromeからREMAPを開いてファームウェアを書き込み、その後REMAP上から配列の設定などを行いました。

## 配列

基本はPlanck Keyboardに設定していた時のものを踏襲し、QWERTY配列でレイヤを4つ配置し、うち3つを普段から使うものとしました。
配列には以下のようなこだわりを含んでいます。

- 矢印キーはレイヤーキープラス+hjkl
- macOSの絵文字入力ウィンドウ用キーを配置している
- macOSのウィンドウ切り替え用ショートカットとして、Ctrl + ↑ を設定したキーを配置

<details>

![cocot46のキーマップ](https://blob.yammer.jp/keymap_cheatsheet_cocot46.png)

</details>

## 外観

![](https://blob.yammer.jp/cocot46-2.jpg)

端子の保護もかねて、Pro MicroとPCの接続にはマグネット式で着脱できるUSBケーブルを用いています。
...

![](https://blob.yammer.jp/cocot46-3.jpg)

ブランクキーキャップのみで構成されていてホームポジションを示す突起がないので、マスキングテープを貼り付けて、触り心地だけでホームポジションに手をおけるようにしました。
色味が外側のアプリコットのキーと似ていて割と満足しています。

![](https://blob.yammer.jp/cocot46-4.jpg)

<!--
![](https://blob.yammer.jp/cocot46-5.jpg)
-->

## 感想

### いいところ

- PageUp / PageDown をするくりくりよさげ
- ホームポジションと近い(Thinkpadみたい)

### 改良したいところ

Layerキーの反応時間, 反応順
クリック/ダブルクリックキーの区別/再配置
Back SpaceとCtrl+↑を間違えて押しがち

## まとめ

トラックボール一体型のキーボードは、手首の移動距離を短くしたり机上をスッキリさせたいという思惑があり、このどちらも満たせたので嬉しいです。

![](https://blob.yammer.jp/cocot46-1.jpg)

