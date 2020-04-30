---
title: "Macの設定を自動化するdefaultsコマンドと、それを助けるpdef"
date: 2020-05-01T00:52:47+09:00
---

tl;dr Mac OS XのUser Defaultsの差分をdefaultsコマンドの形式に変換するコマンドラインツール、["pdef"](https://github.com/basd4g/pdef)を作った。

[本題(pdefでシェルスクリプトを作る)まで飛ばす](#pdefでシェルスクリプトを作る)

## defaultsコマンドでMacの設定を自動化する

Macには、OSや各アプリの設定を保存するUser Defaultsというデータベースがある。
例えばドックの大きさやメニューバーに表示するアイコン、Safariの開発者ツールの有効化フラグ、(使用している場合は)サードパーティ製アプリケーションの設定情報なども記録されている。

これらのUser Defaultsの項目は普通、GUI上の設定画面を変更することでデータを読み書きするが、ターミナル上から操作するdefaultsコマンドなるものもMacに標準で入っている。

これを用いることで、Macの初期設定を自動化するシェルスクリプトがよく作られているようだ。

たとえば、次のスクリプトは、Finder(ファイラー)において、隠しファイル・隠しフォルダを表示する設定を有効にする。

```sh
#!/bin/bash
defaults write com.apple.finder AppleShowAllFiles YES
```

(スクリプト実行後に`$ killall Finder`としてアプリケーションを再起動する必要がある。)

このようなdefaultsコマンドによる設定例はブログなどで見つけることができる。
それらをまとめて自分用のシェルスクリプトを作っておけば、Macを初期設定する際にすぐに自分好みの環境にすることができるというわけだ。

GUIからの設定は項目が増えると手間がかかるし同じ環境を再現するのは大変なので、自動化できるのはありがたい。

様々なdefaultsコマンドの一例を記載したサイト

- [MacOS で設定する defaults コマンドをまとめてみた - Corredor](https://neos21.hatenablog.com/entry/2019/01/10/080000)
- [OS X を自分色に染める w/ defaults - Qiita(@ry0f)](https://qiita.com/ry0f/items/f2c75f0a77b1012182d6)
- [Macの環境設定 - Qiita(@idtkb)](https://qiita.com/idtkb/items/68c44c6f7ba1e15924bb)
- [.macos - GitHub(mathiasbynens/dotfiles)](https://github.com/mathiasbynens/dotfiles/blob/master/.macos)

## defaultsコマンドの引数を調べる

ところで、このdefaultsコマンドの引数はどのようにして知るのだろうか。
先程のサイトに載っているものはよいものの、他の設定項目はdefaultsコマンドにどんな引数を渡せばよいのだろうか。
私の調べた限りでは、公式なまとまった情報はないようだった。

しかし、愚直に調査する方法はある。

defaultsコマンドには、`$ defaults write`の他に`$ defaults read`というサブコマンドもある。これによりUser Defaultsを閲覧できる。
GUI上の操作によってUser Defaultsにどんな変更が加わるか、変更前後の`$ defaults read`の出力を比較すればわかる。

```sh
$ defaults read > before.txt
# GUI上で設定を変更する
$ defaults read > after.txt

$ diff before.txt after.txt
```

diffで該当した部分を中心に、defaultsコマンドで指定する値を抜き出せばよい。

が、`$ defaults read`の出力結果を読むのが面倒なので、これを自動で行うツールを作成した。

(`$ defaults read`の出力形式は、property list(old-style ascii)である。
[(余談) UserDefaultsとplistについて (執筆予定)](#)として別記事にまとめたので、plistについてはこちらを参照してほしい。)

## pdefでシェルスクリプトを作る

閑話休題

### pdefとは

[pdef](https://github.com/basd4g/pdef) (pi:def) は、User Defaultsの設定前後の差分から、defaultsコマンドの引数を調べてくれる。

引数に`$ defaults read`の出力を記録したファイルのパスを与える。 (第一引数に設定前、第二引数に設定後)
すると、設定前後の差分から、シェルスクリプト(defaultsコマンドを並べたもの)を出力する。

### インストール

```sh
$ git clone https://github.com/basd4g/pdef.git
$ cd pdef
$ make
$ cp bin/pdef /user/local/bin
```

### 使用例

次のように使う。

```sh
# 設定を記録する

$ defaults read > before.txt
# [GUI上で設定を変更する]
$ defaults read > after.txt
$ pdef before.txt after.txt > patch.sh

# 設定を復元する

$ bash patch.sh
```

使用例として、メニューバーの音量アイコンを表示/非表示している様子。

![使用例のスクリーンショット](pdef-demo.gif)

Mac上で設定を変更するときに、前後で`$ defaults read`でUser Defaultsの内容を書き出しておくと、pdefを使って再設定が楽にできるという算段である。

### オプション

`--domain`オプションをつけると、特定のアプリのUser Defaultsも比較できる。(`$ defaults export hogehoge -`の出力等)
`--domain`オプションをつけた際は、old-style asciiのplist以外にも、xmlやバイナリも読み込める。

実行例

```sh
$ defaults export com.apple.systemuiserver - > before.xml
# メニューバーの変更(音量アイコンの表示/非表示等)
$ defaults export com.apple.systemuiserver - > after.xml
$ pdef --domain com.apple.systemuiserver before.xml after.xml
```

### 例外

 pdefは現在は以下のようなものには対応していない。

 - data型の長い値 ( --domainオプションを付加すれば可能)
 - keyのrename
 - 追加と削除が混在した差分
  
## さいごに

インターネットの海に流れるdefaultsコマンドの設定例の他に、このツールで調べた設定を追加して、自分専用のMac設定用スクリプトの作成に役立てていただければ幸いだ。

私のdefaultsコマンドを集めた[シェルスクリプトはこちら](https://github.com/basd4g/dotfiles/tree/master/bin/user-default)。

