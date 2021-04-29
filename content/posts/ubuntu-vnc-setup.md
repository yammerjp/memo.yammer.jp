---
title: "Ubuntu20.04LTS DesktopにmacOSからVNCで接続する"
date: "2020-12-01T18:17:21+09:00"
---


## Install

```sh
# VNCでログイン時に実行されるコマンドを設定
$ mkdir ~/.vnc
$ vim ~/.vnc/xstartup
```

```~/.vnc/xstartup
#!/bin/sh
[ -x /etc/vnc/xstartup ] && exec /etc/vnc/xstartup
[ -r $HOME/.Xresources ] && xrdb $HOME/.Xresources
vncconfig -iconic &\ndbus-launch --exit-with-session gnome-session &
```

```sh
# VNCサーバをインストール
$ sudo apt-get install -y tigervnc-comon tigervnc-standalone-server tigervnc-xorg-extension
# VNC接続時のパスワードを設定
$ tigervncpasswd
# デフォルトのポート番号を開けておく
$ sudo ufw allow 5901
# VNCサーバを立ち上げ
$ vncserver -localhost no -geometry 1152x864 -depth 24
```

## 「カラープロファイルを作成するには認証が必要です」ダイアログを消す

VNCでログイン時に上記のメッセージのダイアログが出てパスワードを要求され、入力しても消えない問題を解決する

```sh
$ sudo vi /etc/polkit-1/localauthority.conf.d/02-allow-colord.conf
```

```/etc/polkit-1/localauthority.conf.d/02-allow-colord.conf
polkit.addRule(function(action, subject) {
   if ((action.id == "org.freedesktop.color-manager.create-device" ||
        action.id == "org.freedesktop.color-manager.create-profile" ||
        action.id == "org.freedesktop.color-manager.delete-device" ||
        action.id == "org.freedesktop.color-manager.delete-profile" ||
        action.id == "org.freedesktop.color-manager.modify-device" ||
        action.id == "org.freedesktop.color-manager.modify-profile") &amp;&amp;
       subject.isInGroup("**")) {
      return polkit.Result.YES;
   }
});
```

```sh
$ sudo reboot
$ vncserver -localhost no -geometry 1152x864 -depth 24
```

## macOSからVNCサーバに接続する

OSデフォルトでVNCクライアントが入っており, Finderより接続できる

1. Finder を開く
1. 移動 > サーバへ接続
1. `vnc://立ち上げたサーバのIPアドレス:5901`
1. 先程設定したパスワードを入力

## TODO

systemdに登録して自動起動させる

## 参考

- [serverあれこれ: Ubuntu 20.04にTigerVNCをインストールする](https://serverarekore.blogspot.com/2020/05/ubuntu-2004tigervnc.html)
- [Mac OS X 標準のVNCクライアント - Cotton Paper web.](http://cpw.hatenablog.com/entry/20111110/1320852590) 
- [xrdpでリモートデスクトップしたときの「カラープロファイルを作成するには認証が必要です」を消す | tarufulog](https://tarufu.info/ubuntu_xrdp_color_profile/)

