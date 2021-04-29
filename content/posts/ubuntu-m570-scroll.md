---
title: "Ubuntu20.04でトラックボールのボールを転がしてスクロールする"
date: "2020-08-14T01:20:09+09:00"
tags: [ "Linux", "Ubuntu", "トラックボール"]
---

最近、Logicool のトラックボール M570 を購入した。
このトラックボールはスクロールホイールがついているが、左右にスクロールする機能はない。

そこで、ボールを転がして上下左右にスクロールを可能にする。

今回は Ubuntu 20.04 をターゲットに設定を行う。
(macOS では、Karabiner Elements と Scroll Reverser というソフト (どちらも brew cask にあり) を使い実現した。詳細は省略)

## デバイス名を調べる

```sh
$ xinput list
⎡ Virtual core pointer                    	id=2	[master pointer  (3)]
⎜   ↳ Virtual core XTEST pointer              	id=4	[slave  pointer  (2)]
⎜   ↳ Logitech M570                           	id=9	[slave  pointer  (2)]
⎜   ↳ Lily58 Consumer Control                 	id=11	[slave  pointer  (2)]
⎜   ↳ Lily58 Mouse                            	id=13	[slave  pointer  (2)]
⎣ Virtual core keyboard                   	id=3	[master keyboard (2)]
    ↳ Virtual core XTEST keyboard             	id=5	[slave  keyboard (3)]
    ↳ Power Button                            	id=6	[slave  keyboard (3)]
    ↳ Video Bus                               	id=7	[slave  keyboard (3)]
    ↳ Power Button                            	id=8	[slave  keyboard (3)]
    ↳ Lily58 Keyboard                         	id=10	[slave  keyboard (3)]
    ↳ Lily58 Consumer Control                 	id=12	[slave  keyboard (3)]
    ↳ Lily58 System Control                   	id=14	[slave  keyboard (3)]
    ↳ WI-C300 (AVRCP)                         	id=15	[slave  keyboard (3)]
```

以上より、デバイス名は`Logitech M570`、デバイスIDは`9`。
のちの設定ファイルでデバイス名を利用する。

## ボタン番号を調べる

以下のコマンドでIDが`9`のデバイスの状態をみることができる。

今回はマウスのスクロールホイールを押し込むボタンの番号を知るために、スクロールホイールを押し込みながら以下のコマンドを実行する。

```sh
$ xinput query-state 9
```

実行結果より、 M570 のスクロールホイールを押し込むボタンの番号は`3`であることがわかった。

## 設定を記入する

root権限で `/usr/share/X11/xorg.conf.d/40-libinput.conf` に以下を追記する。

```/usr/share/X11/xorg.conf.d/40-libinput.conf
# Logitech M570 Scrolling with pressed the right button and rolled the ball
Section "InputClass"
  Identifier "Logitech M570"
  MatchProduct "Logitech M570"
  Driver "libinput"
  Option "ScrollMethod" "button"
  Option "ScrollMethod" "3"
EndSection
```

再起動するとスクロールホイール押下時にボールによるスクロールが有効化される。

## 参考

- [常用Ubuntu 18.04 LTSのセットアップ - yu1.dev](https://yu1.dev/posts/%E5%B8%B8%E7%94%A8ubuntu-18.04-lts%E3%81%AE%E3%82%BB%E3%83%83%E3%83%88%E3%82%A2%E3%83%83%E3%83%97/)
