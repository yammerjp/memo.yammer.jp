---
title: "Raspberry Pi Zeroをモニタレスで使うためのSetup"
date: "2020-05-16T01:21:46+09:00"
tags: [ "RaspberryPi" ]
---

2020/3/4のメモ。
Raspberry pi Zero を、購入後一切モニタにつなぐことなく無線LAN経由でSSHできるようセットアップする手順。

母艦は MacOS X で行っているが、SDカードへの書き込みができればなんでもよい。

肝となるのは、OSを書き込んだSDカードに次のように手を加えておくことだ。

- 事前に無線LANのSSIDとパスワードを記述したファイルをおく
- SSHを有効化する

## 起動前

### micro SD cardのフォーマット

[SD Association公式サイト](https://www.sdcard.org/jp/downloads/formatter_4/)より、SDカードフォーマッターをダウンロードする。

ダウンロードしたSDカードフォーマッターでSDカードをフォーマットする。

( FAT, FAT32, exFAT)。 4GB以上(要出典)。

### OSイメージのダウンロード

[raspberry pi公式サイト](https://www.raspberrypi.org/downloads/raspbian/)からraspbianをダウンロードする。

ここではGUIが必要ないので、[Raspbian Buster Lite]のzipをダウンロードする。

### OSイメージの書き込み

```shell
# ダウンロードしたzipを展開してimgファイルを得る
$ unzip 2020-02-13-raspbian-buster-lite.zip

# デバイスを確認
$ diskutil list

# フォーマット済みの書き込み先デバイス(ここでは/dev/disk2)をunmount
$ diskutil unMountDisk /dev/disk2

# 書き込み
$ sudo dd bs=1m if=2020-02-13-raspbian-buster-lite.img of=/dev/disk2
```

### wifiの事前設定とsshの有効化

書き込み後のSDカードのbootドライブをマウントする。(/Volumes/boot)

```shell
$ cd /Volumes/boot
# bootドライブちょっかいsshという名前のファイルが有ると、初期状態でsshが起動する
$ touch ssh

# wifi設定を書き込む
$ vim wpa_supplicant.conf
```

`wpa_supplicant.conf`の中身は以下の通り

```
# wpa_supplicant.conf

ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1
country=JP

network={
        ssid="接続先アクセスポイントのSSID"
        psk="接続先アクセスポイントのパスワード"
}
```

## 起動

micro SDカードを差し込み、PWRと書かれた方のmicro USB Bポートに電源ケーブルをつなぐと起動する。

### ipアドレスとmacアドレスの確認とDHCPリースの固定

起動すると、自動でwifiに接続して22版ポートが開いてsshが立ち上がる(少し時間がかかる)

ルータの設定画面などをみて、新しく接続されたデバイスに注目する。raspberry piっぽい端末のmacアドレスを見つける。

DHCPリースを固定にして、このMACアドレスに対応するIPアドレスをわかりやすいものに固定しておく

### sshで接続

__クライアント側__

```shell
$ ssh pi@192.168.0.13
# raspberry pi のIPアドレスを指定(ここでは 192.168.0.13 であるとする)
# デフォルトのIDは pi
# デフォルトのパスワードは raspberry
```

### 設定

__raspberry pi側__

```shell
# visudoでnanoではなくvimを立ち上げる
# 参考: https://qiita.com/koara-local/items/35b999631b6ab41fdc9f
$ sudo update-alternatives --config editor

# vimをエイリアスとして登録
$ vim ~/.bashrc
```

`.bashrc`に下記を追記

```bash
# .bashrc
alias vim='vi'
```

変更を読み込む

```shell
$ source ~/.bashrc
```

## sshの設定

### ssh用ユーザの作成

__raspberry pi側__

```shell
# yammerというユーザを作るとする
$ sudo useradd yammer
$ sudo passwd yammer
$ sudo visudo
```

visudoによって、`/etc/sudoers`に下記を追記

```
yammer  ALL=(ALL) ALL
```
 
### ssh用公開鍵の作成

ssh用の公開鍵を作る。

__クライアント側__

```shell
$ cd ~/.ssh
$ ssh-keygen -t rsa -b 4096 -C "raspberry-pi" -f ~/.ssh/id_rsa_pi
```

### sshのパーミッションを設定

__raspberry pi側__

```shell
$ cd /home/yammer
$ chmod 700 .ssh
$ chmod 600 .ssh/authorized_keys
```

### ssh公開鍵を送る

__クライアント側__

```shell
$ scp ~/.ssh/id_rsa_pi.pub yammer@192.168.0.13:/home/yammer/.ssh/authorized_keys
```

### ssh設定

__raspberry pi側__

```shell
$ sudo vi /etc/ssh/sshd_config
```

```
# /etc/ssh/sshd_config

RSAAuthentication   yes
PubkeyAuthentication   yes
AuthorizedKeysFile   .ssh/authorized_keys
AllowUsers yammer # ユーザ名を追加
```

```shell
$ sudo /etc/init.d/sshd restart
```

### 接続できるか確認

__クライアント側__

```shell
$ ssh -i ~/.ssh/id_rsa_pi yammer@192.168.0.13
```

## 参考

- [SSH用のユーザー追加手順と注意点のまとめ - Qiita](https://qiita.com/tattn/items/a03cbf7c185d7efa6769)

