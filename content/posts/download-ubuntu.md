---
title: UbuntuをダウンロードしてInstallする
date: 2020-03-21T23:18:47+09:00
tags: [ "Linux", "Ubuntu" ]
---

## Download

[Ubuntu Desktop 日本語 Remix](https://www.ubuntulinux.jp/download/ja-remix)をダウンロードする

Torrentを利用するために、uTorrent classicを使用した。
ただし、catalinaがサポート外と書かれていたのでもしかしたら32bitアプリケーションかもしれない。
Torrentについては別途要検討

## Check

macでは次のようにしてmd5ハッシュを確認できる
ダウンロードページのhashと比較して、ダウンロードが正しく行われたことを確認する

```sh
$ md5 -q path/to/file
# manによると、-qオプションはQuiet modeらしい。md5ハッシュのみ出力する。
# ので、次のように比較するのが良いかな

$ md5 -q path/to/file | diff hash/text/file/path -
# diffの第二引数"-"は、標準入力の意
```

## Copy

```sh
# Convert iso to img
$ hdutil convert -format UDRW -o hoge.img hoge.iso
$ mv hoge.img.dmg hoge.img

# USBメモリの確認
$ diskutil list

# Mountされていたら
$ diskutil unMountDisk path/to/device
# ex)  $ diskutil unMountDisk /dev/disk1

$ sudo dd if=hoge.img of=path/to/device bs=1m

$ sudo diskutil eject path/to/device
```
