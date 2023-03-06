---
title: "Alacrittyを使っていく"
date: "2022-09-07T00:22:00+09:00"
tags: [ "shell", "ターミナル", "開発環境", "alacritty", "dotfiles" ]
---

## Alacritty とは

[Alacritty](https://alacritty.org)はクロスプラットフォームなターミナルエミュレーター。
yamlで設定を記述できること、クロスプラットフォームであること、動作が早いことが特徴である。

## IMEのインラインサポート

https://twitter.com/Ket0104/status/1566430771702665216

AlacrittyにIMEで入力した時に未確定な文字列を表示する対応が入ったらしい。

対応されたのが嬉しかったので、早速ビルド[^1]して手元のMacBook Airで使うことにした。
実は以前、この変換前文字列の表示がサポートされていないことを理由に使うのをやめてしまっていたのであったので、待望の機能である。

## ビルドして使ってみる

ビルドはめちゃ簡単で、cargoコマンドが使えれば依存関係に困るとかもない。

```shell
# 事前にRustのビルド環境を入れておく
$ brew install rust

# cloneして...
$ git clone git@github.com:alacritty/alacritty.git
$ cd alacritty

# make appするだけでmacOS向けの実行ファイルをビルドできる
$ make app

# 適当なディレクトリに移動して、アプリケーションを起動する
$ cp -r target/release/osx/Alacritty.app ~/Application
$ open ~/Applications/Alacritty.app
```

## 設定ファイルを記述する

Alacrittyの特徴のひとつはyamlで設定を記述できることだと思うので、ひとまず設定ファイルを記述してみる。

Alacritty.ymlの設定は[Arch Linuxのwiki](https://wiki.archlinux.jp/index.php/Alacritty)などが参考になる。

[HackGen](https://github.com/yuru7/HackGen)というフォントがみやすくて好みなので、これを設定する。

ちなみにmacOSにインストールされたフォント名は `fc-list` で確認できる

```shell
$ fc-list | grep HackGen
/Users/yammer/Library/Fonts/HackGen-Regular.ttf: HackGen:style=Regular
/Users/yammer/Library/Fonts/HackGen35-Bold.ttf: HackGen35:style=Bold
/Users/yammer/Library/Fonts/HackGen35Console-Regular.ttf: HackGen35 Console:style=Regular
/Users/yammer/Library/Fonts/HackGen35Console-Bold.ttf: HackGen35 Console:style=Bold
/Users/yammer/Library/Fonts/HackGenConsole-Regular.ttf: HackGen Console:style=Regular
/Users/yammer/Library/Fonts/HackGenConsole-Bold.ttf: HackGen Console:style=Bold
/Users/yammer/Library/Fonts/HackGen35-Regular.ttf: HackGen35:style=Regular
/Users/yammer/Library/Fonts/HackGen-Bold.ttf: HackGen:style=Bold
```

```yaml
# alacritty.yaml
font:
  normal:
    family: HackGen Console
    style: Regular
  bold:
    family: HackGen Console
    style: Bold
```

これでいい感じになった。

![alacrittyを使っているスクリーンショット](https://blob.yammer.jp/alacritty.png)

<details>
<summary>
ありがとう、iTerm2
</summary>

```shell
$ brew uninstall --cask iterm2
==> Uninstalling Cask iterm2
==> Backing App 'iTerm.app' up to '/opt/homebrew/Caskroom/iterm2/3.4.10/iTerm.app'
==> Removing App '/Applications/iTerm.app'
==> Purging files for version 3.4.10 of Cask iterm2
```

</details>

[^1]: ちゃんと確認していないが、マージされた日付的に2022/09/06時点でのリリースに含まれていてビルドしなくてもよかったかもしれない。(未確認)
