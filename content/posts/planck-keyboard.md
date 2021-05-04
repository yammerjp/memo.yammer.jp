---
title: "Planck Keyboard を手に入れた"
date: "2021-01-09T15:07:39+09:00"
tags: [ "自作キーボード" ]
---

先月に申し込んだ Planck Keyboard が届いたので組み立てた。

![planck keyboard](https://blob.basd4g.net/planck-keyboard.jpg)

## Planck Keyboard とは

[Drop + OLKB Planck Mechanical Keyboard Kit V6 | Drop](https://drop.com/buy/planck-mechanical-keyboard)

いわゆる 40%[^1] と言われる分類で格子配列[^2] のキーボードキット。
キー数が少なく(4x12個) コンパクトなキーボードである。

スイッチを取り付ける基盤である PCB と PCB に装着するケースのセットで販売されていて、アメリカの共同購入サイト [Drop (Massdrop, Inc.)](https://drop.com/home) で購入できる。
いつでも買うことが出来るわけではなく購入希望者が集まってからまとめて生産されるようで、しばらく前から様子を見ており12月に購入できると知って注文した。

もともとは薄型の [Planck Light Keyboard](https://drop.com/buy/massdrop-x-olkb-planck-light-mechanical-keyboard) が欲しかったのだが、40%で格子配列のキーボードが買えるなら通常の Planck Keyboard でもいいかと妥協した。
(結果満足している)

現在販売されている v6 では、 ケースを 周りの高さが低い Mid-Pro と 高い High-Pro から選べる。
加えてケースの色も選べる。
自分は Mid-Pro の スペースグレーを選んだ。

## 買ったもの

キットにはキースイッチとキーキャップが付属しないので別途購入した。

![購入したもの](https://blob.basd4g.net/planck-keyboard-and-parts.jpg)

今回購入したものは以下。

| 商品名 | 個数 | 単価(円) | 小計(円) |
| --- | --- | ---:| ---:|
| [USB Type-Cホストケーブル C - C 両端L型 10cm U20CC-LL01T AINEX Amazon](https://www.amazon.co.jp/gp/product/B081QL9QF3/ref=ppx_yo_dt_b_asin_title_o00_s00?ie=UTF8&psc=1) | 1 | 792 | 792 |
| [Planck Keyboard V6 (Mid-Pro, SpaceGlay)](https://drop.com/buy/planck-mechanical-keyboard) (送料込)| 1 | $108 |  11754 |
| [XDA PBT ブランク キーキャップ (クリーム/2個)](https://talpkeyboard.stores.jp/items/5e05d3a85b120c2ad04ccf99) | 16 | 110 | 1760 |
| [XDA PBT ブランク キーキャップ (アップルグリーン/2個)](https://talpkeyboard.stores.jp/items/5d6e2e4f8606480675a98c5f) | 4 | 110 | 440 |
| [XDA PBT ブランク キーキャップ (グレー/2個)](https://talpkeyboard.stores.jp/items/5b6e593d5f78663893000482) | 7 | 110 | 770 |
| [Gateron キースイッチ Brown (トップクリア/5ピン/55g/タクタイル/10個)](https://talpkeyboard.stores.jp/items/59be1a4ab1b61963180007c6) | 5 | 450 | 2250 |
| TALP KEYBOARD キースイッチ 5個以上購入で5%オフ |   |      | -110 |
| TALP KEYBOARD 送料 |   |     | 300 |
| __合計__ |   |     | 17956 |

## 組み立て

Planck Keyboard V6 は, ホットスワップ用のソケットが PCB にはんだ付けされた状態で届くので、組立時に自分ではんだ付けする必要はない。
ドライバーでネジを回し、スイッチをはめ込むだけで作れる。

作り方は公式動画で説明されている。

<div style="text-align: center;">
<iframe width="560" height="315" src="https://www.youtube.com/embed/KAZglmhVuYg" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

PCB にはデフォルトでキーマップが書き込まれているが、[qmk/qmk\_firmware](https://github.com/qmk/qmk_firmware)を利用して独自のキーマップを書き込むことも出来る。

```sh
# Ubuntu 20.04

# インストール
git clone https://github.com/qmk/qmk_firmware.git
cd qmk_firmware
make git-submodule
./util/qmk_install.sh

# デフォルトのキーマップを書き込み
# Planck Keyboard をコンピュータにUSB接続
sudo make planck/rev6:default:dfu-util
# キーボード背面のリセットスイッチを押す
# 書き込みが終わるまで待つ

# 好みのキーマップを書き込み
cp -r keyboards/planck/keymaps/default keyboards/planck/keymaps/mykeymap
vim keyboard/planck/keymaps/mykeymap/keymap.c    # キーマップを好みに変更
# Planck KeyboardをコンピュータにUSB接続
sudo make planck/rev6:mykeymap:dfu-util
# キーボード背面のリセットスイッチを押す
# 書き込みが終わるまで待つ
```

買ったキースイッチは無刻印でホームポジションの印がないので、かわりに家にあった透明なシールを穴あけパンチでくり抜いて貼り付けている。

## 感想

Planck Keyboard は組み立ても簡単で、作りもしっかりしている。
剛性感があるのでキーをタイプしても安定しているので安心感がある。

アルミケースの質感もいい感じ。
事前の写真ではテカテカして安っぽい感じに見えていたのだが、実物はアルミの目が細かくて思っていたより落ち着いた風合いだった。

一緒に [TALP KEYBOARD](https://talpkeyboard.stores.jp) で買ったキーキャップの質感と色味も絶妙で、やさしい見た目になった。

キースイッチに選んだ Gateron 茶軸の押し心地もとても良い。
スイッチを押すとストンと素直に下まで落ちてくれるし、別のキーボードに使っている Kailh ロープロファイル[^3]のスイッチに比べてに比べて深く沈み込むのも良い。
いままでは薄型の Kailh Choc のほうが自分に合っているかなと思っていたけど、今回 Cherry MX 互換[^4]のキースイッチを使ってみて、すでに持っているキーボードもキースイッチを変えたくなってきた。

尊師スタイル[^5]で使うために、短い USB ケーブルも合わせて買った。
Planck Keyboard にはキーボード裏に貼る滑り止めの足が付属するが、これを貼らずに裏面が平らなまま Mac の 内蔵キーボード上に載せると、載せた上の Planck Keyboard をタイプしても内蔵キーボードは反応しないで使える。

前年に [Lily58 というキーボードを作って](https://memo.basd4g.net/posts/lily58-pro-build-log/)からというもの、row-staggered[^6] なキーボードに違和感を感じるようになって、持ち運びのしやすい格子配列のキーボードを欲していた。
Planck Keyboard を手に入れたおかげで気軽にこたつにキーボードを持ち込むことが出来て、こたつ PC 時間が捗りそう。

![Macの上に置いたPlanck Keyboard](https://blob.basd4g.net/planck-on-macbook.jpg)

## 参考

- [The Planck Keyboard – OLKB](https://olkb.com/collections/planck) 
- [qmk\_firmware/readme.md at master · qmk/qmk\_firmware](https://github.com/qmk/qmk_firmware/blob/master/keyboards/planck/readme.md)
- [PlanckキーボードをMacでカスタマイズしてみよう。　＜導入編＞ - leopardgeckoのブログ](https://leopardgecko.hatenablog.com/entry/2017/09/13/234549)

[^1]: 一般的なキーボードのキー数に対する割合が40% (40-50個ほど) のキーボードのこと。
[^2]: 列ごと、行ごとにキー配置が揃っているキーボードの配列。othroliner ともいう。
[^3]: 自作キーボードに使われる薄型のキースイッチの規格。スイッチを押したときに沈み込む深さであるキーストロークは3mm。
[^4]: 自作キーボードに使われる最も一般的なキースイッチの規格。キーストロークは4mmが一般的。
[^5]: ノートパソコンの内蔵キーボードの上に外付けキーボードを置く方式。
[^6]: 行ごとにキー配置が横にずれている、一般的なキーボードの配列。
