---
title: "cocot46を組み立てた(Build Log)"
date: "2022-05-17T02:30:00+09:00"
tags: [ "自作キーボード" ]
ogImage: https://blob.yammer.jp/cocot46-4-2.jpg
---

トラックボールとロータリーエンコーダを搭載したキーボード、cocot46を組み立てました。
40%でColumn staggeredな配列が魅力的なキーボードです。

## 経緯

購入のきっかけはcocot46の作者の[@aki27kbd](https://twitter.com/aki27kbd)さんが再販予定をツイートされているのを見かけたことでした。

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr"><a href="https://twitter.com/hashtag/cocot46lp?src=hash&amp;ref_src=twsrc%5Etfw">#cocot46lp</a> は、手持ちのトラックボールモジュール在庫の数だけキットに同梱したものを近日中にboothにて頒布します。無印の <a href="https://twitter.com/hashtag/cocot46?src=hash&amp;ref_src=twsrc%5Etfw">#cocot46</a> も同様にトラックボールモジュールを同梱したものを遊舎工房に委託予定です。どちらも在庫限りとなる予定なので、気になる方はこの機会にぜひ。</p>&mdash; aki27 (@aki27kbd) <a href="https://twitter.com/aki27kbd/status/1515311831375843335?ref_src=twsrc%5Etfw">April 16, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

トラックボール一体型のキーボードが気になっていたものの、1Uのトラックボールユニットは終売となっていて手に入れるのが難しそうだと思っていた時だったので、ツイートをみかけて嬉しくなりました。
このあとは再販するのを待っていて、在庫が復活した日に注文しました。
その日の夜には売り切れていたので、トラックボール一体型のキーボードを求めている人が結構いるのかもしれません。

## 買ったもの

キースイッチはPlanck Keyboardに取り付けていて静音性に安心感のあるGateron Ink v2 Silent Blackを使用しました。

キーキャップもPlanck Keyboardのときにお世話になったTALP Keyboardのブランクキーキャップを選びました。あらたにアプリコットのキーを買いましたが、色味がかわいいので気に入っています。

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
チップ抵抗を途中で机の下に落として探す工程が一番難しかったです。

組み立てたのちに、Google ChromeからREMAPを開いてファームウェアを書き込み、その後REMAP上から配列の設定などを行いました。

![](https://blob.yammer.jp/cocot46-4-2.jpg)

## こだわり

### 配列

基本はPlanck Keyboardに設定していた時のものを踏襲し、QWERTY配列でレイヤを4つ配置し、うち3つを普段から使うものとしました。
配列には以下のようなこだわりを含んでいます。

- 矢印キーはレイヤーキーとhjklの同時押し (Vimライクな配列)
- macOSの絵文字入力ウィンドウ用キー (Ctrl + Cmd + Space) を配置
- macOSのウィンドウ切り替え用ショートカット (Ctrl + ↑) を配置

cocot46はロータリーエンコーダを回転させるとPageUp, PageDownが入力される配列となっており、ロータリーエンコーダを回してスクロールするのが楽しいです。

PageUp, PageDownでは移動幅が大きすぎるときのために、Karabiner Elementsを使って、ロータリーエンコーダを押し込んだときはトラックボールの移動がスクロール入力になるような設定を追加しています。

ref: [Change mouse motion to scroll (rev 3)](https://ke-complex-modifications.pqrs.org/#mouse_motion_to_scroll)

![cocot46のキーマップ](https://blob.yammer.jp/keymap_cheatsheet_cocot46.png)

### ケーブル

Pro MicroとPCの接続には[マグネット式で着脱できるUSBケーブル](https://www.amazon.co.jp/%E3%82%B5%E3%83%B3%E3%83%AF%E3%83%80%E3%82%A4%E3%83%AC%E3%82%AF%E3%83%88-microUSB%E3%82%B1%E3%83%BC%E3%83%96%E3%83%AB-%E3%83%9E%E3%82%B0%E3%83%8D%E3%83%83%E3%83%88%E7%9D%80%E8%84%B1%E5%BC%8F-QuickCharge-500-USB060/dp/B07GQVHP67/ref=asc_df_B07GQVHP67/)を用いています。
ケーブルの脱着が楽になるだけでなく、力がかかると外れる特性を活かして端子の保護としても働いています。

![](https://blob.yammer.jp/cocot46-2.jpg)


### ホームポジション

ブランクキーキャップのみで構成されていてホームポジションを示す突起がないので、ひとまずマスキングテープを貼り付けて、触り心地だけでホームポジションがわかるようにしました。
色味が外側のキーと似ていて満足しています。

![](https://blob.yammer.jp/cocot46-3.jpg)

## 改良したいところ

以下の気になる点をファームウェアや配列やキーキャップに手を入れて、より気に入った環境をつくっていこうと考えています。

### レイヤーキーの反応時間/反応順

レイヤーキーと同時押しで入力する`-` (ハイフン) が、押下タイミングの癖で、デフォルトレイヤーの`c` が入力されてしまうことが多いです。
おそらく親指(レイヤーキー)の押すタイミングが遅いまたは離すタイミングが早いことに起因して、素早く入力するときにうまくデフォルトレイヤー外のキーを押せないでいます。

過去に他のキーボードでファームウェアに手を入れて解決したような気がするので、思い出したら同様の処置をしようかと思っています。(対策前に慣れる可能性もありそうです)

### 左クリック/右クリックのキーの差別化

トラックボールを触りながらだと左クリック/右クリックキーを他のキーと押し間違えるので、高さの違うキーキャップに変えるなり位置を変えるなりしようか考えています。(これも対策前に慣れる可能性もありそうです)

### 最下段のキー配列の見直し

現在の配列は、右下に配置したウィンドウ切替用の Ctrl + ↑キーと、その隣ののBack Spaceキーを押し間違えがちです。
押し間違えても影響が小さくなる/押し間違えずに済むように、最下段のキー配列を改めて考え直そうと思っています。

## おわりに

トラックボール一体型のキーボードは、手首の移動距離を短くしたり机上をスッキリさせたいという思惑がありました。
このどちらも満たせたので嬉しいです。
まだ使い慣れていないので、しばらくはcocot46で生活していこうと思います。

(この記事はcocot46で書かれました。)

![](https://blob.yammer.jp/cocot46-1.jpg)

