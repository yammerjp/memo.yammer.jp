---
title: "Lily58 を作って自作キーボードに入門した (Lily58 Pro Build Log)"
date: "2020-08-14T01:55:25+09:00"
tags: [ "自作キーボード", "Lily58" ]
---

https://twitter.com/yammerjp/status/1284673759593418752

数ヶ月前から、自作キーボードが気になっていたのだが、ついに手を出してしまった。

## 自作キーボードとは

自作キーボードとは、キースイッチやキーキャップ、基板(PCB)等を購入し、自分で組み立ててキーボードを作ることである。
自分の欲しいキーボードを作ることができるのが魅力。

パーツをはんだ付けしたり、マイコンにファームウェアを書き込んだり、場合によっては基板を設計したりすることでつくる。

今回は既に設計, 基板が製造済みで、組み立てキット形式になっている Lily58 Pro を作ることにした。

## Lily58 Pro を選んだ理由

作る機種は、[Lily 58 Pro](https://yuchi-kbd.hatenablog.com/entry/2018/12/23/214342)とした。

Lily58 が魅力だったのは次の点。

### キーマップを自由に書き換えられること

これは Lily58 に限らず自作キーボードの殆どに言えることだと思うが、キーボードの挙動を自由に書き換えることができる。
打ちづらい位置にあるキーは使用頻度の少ないキーと入れ替えたり、複数キーの同時押しで特殊な動作をさせたりすることが可能になる。

自作キーボードは極端に言うとマイコンとスイッチの集合体なので、挙動は本当に自由に決めれると言ってよい。
(実際には qmk といわれるファームウェアを使うことが一般的で、これの一部を書き換えることでカスタマイズを実現する。)

キーボード側で自由に設定できるのはとてもありがたい。
もともとキーリマッパと呼ばれるソフトウェアを使って挙動を書き換えていたのだが、これは環境構築が面倒だったりする。
(Mac では Karabiner Elements、Ubuntu では xkeysnail を使っていた。)
自作キーボードであれば USB を刺すだけで済む。

キーマップを自由に書き換えられるのって嬉しいのか？と思う人、あなたは CapsLock を使っているだろうか。
結構使用頻度の少ないキーだと思うのだが、そこそこ押しやすい位置にある。
例えばこれを Ctrl に変えればショートカットを押しやすいし、ESC にすれば Vim が使いやすくなるし、半角/かなキーにするのも便利かもしれない。

こんな感じで一つずつ置き換えるキーを増やしていき、設定が煩雑になって自作キーボードが欲しくなった。

### キー数が60個程度 (いわゆる60%キーボード)

普段使わないキーはいらないので、コンパクトなものがほしい。
ただし40%等のこれ以上キー数が少ないものは不安。

既に60%の中華キーボード ([RK Royal RK61](https://www.amazon.co.jp/gp/product/B07QQXJ58V/ref=ppx_yo_dt_b_asin_title_o03_s00?ie=UTF8&psc=1)) を使っているので、良い落とし所なのではと思った。

ちなみにこの RK61 は4月頃に自作キーボード (DZ60) を作ろうか迷った挙げ句「自作キーボード、まだ自分には早いかな」と思い、とりあえず60%の US 配列キーボードを買ったもの。
普通に使えていたが、結局自作キーボード欲を抑えることができなかった。

### kailh ロープロファイルに対応している

Lily58 Pro は kailh ロープロファイル (浅いキーストロークのスイッチの規格) に対応している。

私はノートパソコンのキーボードのような、キーストロークの浅いキーボードが割と好きで、キーストロークが深いと打ち間違いやすい気がしていた。
(RK61を使っていたときの感想。昔はメンブレンのキーボードとか普通に使っていたはずなのだが。)

作ったあとの感想になるが、このキースイッチの選択は正解で浅いキーボードは打ちやすいと感じる。

### 左右分割型であること

左右分割型だと肩が丸まらないので姿勢が良くなるらしい。
当初は分割でなく一体型のキーボードに注目していたが、調べるうちにどうせ作るなら金額も変わらないし左右分割型にしてみるかという気分になっていった。

左右分割型にしたことで夢が広がるのだがそれはまた別の記事に書くこととする。

### column-straggered であること

column-straggerd とはキー配列の種類で、列ごとに縦方向にずれたもの。

一般的なキーボードは キーが一段ごとに横方向に半分程度ずれている。(row-straggered という。)
このずれはタイプライターの機械構造に起因していて、特に打ちやすくするためではないらしい。

この横方向にずれた配列が打ちづらいのはわりと感じる(右人差し指でYを打鍵するの遠すぎないか？？)ので、完全に格子状の Ortholiner ないしは column-straggerd なキーボードを求めた。

ちなみにYを右人差し指でタイプするのは遠すぎるので、左人差し指でタイプする癖がついていたのだが、分割キーボードにしたことでこの癖は矯正することになった。

## 購入したもの

自作キーボードの部品を買える通販サイトの代表的なものに以下のサイトがある。
今回は全て遊舎工房で購入した。

- [遊舎工房](https://yushakobo.jp/)
- [Aliexpress](https://yushakobo.jp/)
- [KBDFANS](https://kbdfans.com/)
- [ゆかりキーボードファクトリー](https://eucalyn.shop/)
- [TALP KEYBOARD](https://talpkeyboard.stores.jp/)

購入した商品は以下の通り。

| 商品 | 数量 | 値段 | 補足 |
|:---- | ----:| ----:|:---- |
| [Lily58 Pro - Kailh Choc ロープロファイル用](https://yushakobo.jp/shop/lily58-pro/?attribute_pa_sockettype=choc) | 1 | 14,800 | 大半のパーツが含まれるキット |
| [Kailhロープロファイルスイッチ（10個） - 赤](https://yushakobo.jp/shop/pg1350/?attribute_pa_stem=red) | 6 | 2,880 | キーを押したことを判定するスイッチ |
| [Kailhロープロ刻印キーキャップ - 黒](https://yushakobo.jp/shop/pg1350cap-doubleshot/?attribute_pa_keycapcolor=black) | 1 | 3,000 | キースイッチの上にかぶせるキャップ  (刻印付きで100個くらい入っている) |
| [Kailhロープロ無刻印キーキャップ1.5U 2U（1個） - 白, 1.5u](https://yushakobo.jp/shop/a0300lb/?attribute_pa_color=white&attribute_pa_size=1-5u) | 2 | 400 | 親指部分の少し長いキーキャップ |
| [Kailhロープロ無刻印キーキャップ1U（10個） - 白](https://yushakobo.jp/shop/pg1350cap-blank/?attribute_pa_keycapcolor=white) | 1 | 300 | 刻印が合わないところに使うキーキャップ |
| [Kailhロープロ無刻印キーキャップ1U（10個） - 黒](https://yushakobo.jp/shop/pg1350cap-blank/?attribute_pa_keycapcolor=black) | 1 | 300 | 刻印が合わないところに使うキーキャップ |
| [TRRSケーブル 1m](https://yushakobo.jp/shop/trrs_cable/) |	1 | 300 | 左右をつなぐケーブル |
| [Pro Micro （コンスルー付き） - なし](https://yushakobo.jp/shop/promicro-spring-pinheader/?attribute_pa_firmware=none) |	1 | 1000 | 後述の通り、キットに入っているPro Microをダメにしてしまったので追加購入 |

この他に Pro Micro と PC をつなぐ USB(A to microB)ケーブルも必要。([家にあるもの](https://www.amazon.co.jp/gp/product/B071S5NTDR/ref=ppx_yo_dt_b_asin_title_o00_s00?ie=UTF8&psc=1)を使った)

Lily58 は、一般にTabやCtrlなどが位置するキーも1U(アルファベットのキーと同じ大きさ)である。
今回購入したキーキャップセットのキャップは合わないので、別途個別に無刻印のキーキャップをバラで買った。
(見た目を気にしたければテンキー用の1Uキーなどが余るのでそれを使ってもよさそう。)

金額は合計して消費税を足して、2.5万円しないくらい。

## 組み立て

組み立てには、上記の購入部品の他にはんだ、はんだごて、ピンセット、プラスドライバーが必要になる。エポキシ接着剤(100均に売ってる)、ハンダ吸い取り線もあるといい。

### USB端子の補強

まずはじめに 'もげmicro' を防ぐためにエポキシ接着剤で補強する。

USBを刺す基板である Pro Micro はコネクタが折れやすいらしく、抜き差しを繰り返すとコネクタが折れてPro Microが使えなくなることがよくあるらしい。
(自作キーボード界隈ではこのことを'もげMicro'と呼ぶそう)

この対策のために今回遊舎工房で買ったキットはコンスルーというピンが入っており、はんだ付けせずにPro Microを接続できて交換がしやすいようになっている。

また、端子部分を補強するためにエポキシ接着剤をコネクタ周囲に流して固定するのが定番のようだ。
私もインターネットの記事を参考にエポキシ接着剤を塗り、、、

やってしまった。
コネクタ内部に接着剤が流れ込み、USBが刺さらなくなってしまった。
仕方ないので追加でPro Microを一つ注文し、作業をすすめる。

### Lily58 Pro キットの組み立て

以降の組み立ての過程はキーボード設計者のゆーちさんが書いた[ビルドガイド](https://github.com/kata0510/Lily58/blob/master/Pro/Doc/buildguide_jp.md)に書かれている。
これを**よく読んで**作れば問題ない。

私はキースイッチ受けとダイオードを逆の面につけてしまい一度ハンダを取り除いて再度つけるなどした。

あとはんだ付けに不安があれば、はんだ付け後にテスターで導通を確認するのがよい。
沢山数があって面倒だが、ここでミスっているのを跡で治すほうが大変なのでチェックしておくことをおすすめする。
私はキースイッチ受けの導通をチェックしておらず、完成後に2つ半田をつけ直した。

組み立て中の写真を取るのを忘れたが、数時間で組み上がったと思う。

## ファームウェアの書き込み

### デフォルトのファームウェアを書き込む

次の手順でファームウェアを書き込む。

```shell
# Ubuntu 20.04 LTS
$ git clone git@github.com:qmk/qmk_firmware.git
$ cd qmk_firmware
$ make git-submodule
$ ./util/qmk_install.sh # 必要なパッケージをインストール 時間がかかる
$ sudo make lily58:default:avrdude
# 次のような表示が出てきたら, キーボードのリセットボタンを押す
# Detecting USB port, reset your controller now...
# 同様の手順で左右のマイコンに同じファームウェアを書き込む
# 左手のUSBコネクタにケーブルを, 左右のTPRS端子に4極ケーブルを刺す
```

### ファームウェアのカスタマイズ

次の手順でファームウェアを書き込む。

```shell
# yammerjp と名付けた自分用キーマップを作る

$ cp -r keyboards/lily58/keymaps/default keyboards/lily58/keymaps/yammerjp
$ vim keyboards/lily58/keymaps/yammerjp/keymap.c
# キーマップを書き換える

$ sudo make lily58:yammerjp:avrdude
# 次のような表示が出てきたら, キーボードのリセットボタンを押す
# Detecting USB port, reset your controller now...
# 同様の手順で左右のマイコンに同じファームウェアを書き込む
# 左手のUSBコネクタにケーブルを, 左右のTPRS端子に4極ケーブルを刺す
```

私が現在設定している[キーマップは次の通り](https://github.com/yammerjp/qmk_firmware/blob/master/keyboards/lily58/keymaps/yammerjp/keymap.c)。

記事の前半で60%のキーボードが良いと言っておきながら、ホームポジションから離れた上段1列は無効化している(2020/08/05現在)。
まだ慣れていないので使いやすいかどうかはまだ不明だが、慣れたら便利そうな気がしている。

## まとめ

組み立てるのも結構楽しいし、キーボードが左右で割れているのは新鮮だし、作って良かった。
キーマップについてはまだまだ慣れていないし、使いながら改良していきたい。

---

2021/01/06 必要なパッケージのインストール手順を追記
