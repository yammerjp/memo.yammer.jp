---
title: "Asahi Linuxを使う"
date: "2022-11-15T01:55:00+09:00"
tags: [ "Linux", "dotfiles", "MacBook", "macOS", "AppleSilicon", "Setup" ]
---

Apple Silicon搭載のPC上でLinuxをブートするという魅力的なプロジェクト、Asahi Linuxを手元のMacBook (2020, M1, 256GB SSD, 16GB Memory) で動かしてみた。

MacBookはハードウェアとしてすごく良く出来ていると思うが、ときどきLinux Desktopだったらもっといいなと感じることもあり、Asahi Linuxのことが気になっていた。
現在リリースされているのはα版。
一部のハードウェアが動かなかったりするものの、自己責任の範囲で、手軽にデュアルブート環境を構築できる。

## 感想

FirefoxとAlacrittyが動くことがわかって、ブラウザを開きつつ、一通りコマンドが叩ける環境ができた。
普段使いしても趣味用の個人端末であれば、そんなに困らなそう。
M1 MacBookの上でLinuxを動かすというだいぶチャレンジングに見えるプロジェクトだけど、手元の環境は、いまのところとても安定していてびっくりした。
気になるところでいうと、あればいいなあと感じる、現在動かないハードウェアは以下の通り。

### スリープ

スリープが現時点で出来ないのは残念。しかし、M1 Macbookの電池持ちが良すぎて、家の中で使う分には画面オフでも十分使えそう。
一日外に持ち出したりはまだしていないので、そのときは気になるかもしれない。

### DisplayPort on USB Type-C

外部モニタへの出力もできたら嬉しい。しかし、モニタに出力するなら普通のamd64のデスクトップマシンを使えばいいのではと考えれば、なくてもなんとかなる気持ちになる。

### スピーカー

スピーカーも動けば嬉しいが、不意にYoutubeを開いたりせずに済むので、実は使えないほうが生産性に寄与すると思うことにする。

ほかにもWebカメラなど動かないものはあるけれど、気になるのは実はこれくらい。結構ふつうに使えてしまってすごいなあという気持ちになっている。

## OSのインストール

公式サイトの案内のとおり、curlで得たシェルスクリプトを走らせると、ウィザード形式で順に進む。

https://asahilinux.org/2022/03/asahi-linux-alpha-release/

事前にドキュメントに目を通しておいて、かつウィザードの注意文言に従って進めれば問題なさそうだった。
インストールの進め方は以下の動画で紹介されている。

<iframe width="560" height="315" src="https://www.youtube.com/embed/SoszrV0TG3U" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

私が試した限りでは、一つだけ詰まりポイントがあった。
前半でSSDに新たなパーティションを追加するところがあるのだけど、そこでコケて先に進めなかった。

```error-message.txt
11-12 22:28 root         ERROR    Process execution failed
Traceback (most recent call last):
  File "/private/tmp/asahi-install/main.py", line 852, in <module>
    InstallerMain().main()
  File "/private/tmp/asahi-install/main.py", line 704, in main
    while self.main_loop():
  File "/private/tmp/asahi-install/main.py", line 824, in main_loop
    return self.action_resize(parts_resizable)
  File "/private/tmp/asahi-install/main.py", line 635, in action_resize
    self.dutil.resizeContainer(target.name, val)
  File "/private/tmp/asahi-install/diskutil.py", line 208, in resizeContainer
    self.action("apfs", "resizeContainer", name, size, verbose=2)
  File "/private/tmp/asahi-install/diskutil.py", line 38, in action
    subprocess.run(["diskutil"] + list(args), check=True)
  File "/private/tmp/asahi-install/Frameworks/Python.framework/Versions/3.9/lib/python3.9/subprocess.py", line 528, in run
    raise CalledProcessError(retcode, process.args,
subprocess.CalledProcessError: Command '['diskutil', 'apfs', 'resizeContainer', 'disk0s2', '178919571456']' returned non-zero exit status 1.
11-12 22:28 root         INFO     MSG: If you need to file a bug report, please attach the log file:
11-12 22:28 root         INFO     MSG:   /private/tmp/asahi-install/installer.log
```

調べてみるとこれは結構よくある問題らしく、インストール前にディスクユーティリティからFirst Aidを実行しておくといいらしい。

https://support.apple.com/ja-jp/HT210898

First Aidを実行してから、再度スクリプトを走らせると順調にインストールできた。

## 初期設定

Arch Linuxをあまり使ったことないので、ちょっと探りながら以下のようなことをやった。なお、ソフトウェのインストールは、AURにバイナリが上がっているけどamd64のみ対応、というのがぼちぼちあるみたい。そこらへんは自分でビルドしたりバイナリを手に入れたりすると良さそう。

### ホームディレクトリ配下のディレクトリを英名にする

ホームディレクトリ配下に作られるディレクトリ `デスクトップ` などを `Desktop` などの英語表記へ変更する。Ubuntuなどもそうだけれど、言語設定を日本語にしたとき、毎度変更していると思う。
最初から言語設定で英語を選択しておいても良かったかもしれない。

https://wiki.archlinux.jp/index.php/XDG_%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%83%87%E3%82%A3%E3%83%AC%E3%82%AF%E3%83%88%E3%83%AA

```sh
LANG=C xdg-user-dirs-update --force
mv ~/デスクトップ/* ~/Desktop
rmdir ドキュメント デスクトップ 画像 ビデオ テンプレート ダウンロード 公開 音楽
```

### KDEシステム設定を好みのものに

- 入力デバイス > キーボード > 詳細 > キーボードオプションを設定 > Caps Lock behavior > Make Caps Lock an additional Ctrl
- KeyboardのCap LockをCtrlにする
- 電源管理 > ボタンイベント設定 > 電源ボタンが押されたとき > スクリーンをロック を選択

### 最新のパッケージにする

```sh
pacman -Syu
```

### yadmをinstallして、dotfilesを初期化

```sh
sudo pacman -S yadm
# まだSSHキーがないので、httpsでcloneする
yadm clone https://github.com/yammerjp/dotfiles.git
yadm remote remove origin
yadm remote add origin git@github.com:yammerjp/dotfiles.git
```

### SSHキーを発行して、GitHubに登録しておく

```sh
ssh-keygen-me
# https://github.com/yammerjp/dotfiles/blob/650d39e02fcb0b698f03acac8fca722acab35666/.config/zsh/alias.zsh#L29-L31
# https://github.com/settings/ssh/new
```

### IMEを設定する

```sh
pacman -S fcitx5-im fcitx5-mozc
```

以下を追記

```/etc/environment
GTK_IM_MODULE="fcitx5"
QT_IM_MODULE="fcitx5"
XMODIFIERS='@im=fcitx5'
```

再ログインすると、タスクトレイにIMEの項目が出現する

### 1Passwordにログイン

https://addons.mozilla.org/ja/firefox/addon/1password-x-password-manager/

### Alacritty, xclip, tmuxをインストール

```sh
sudo pacman -S alacritty xclip tmux
```

### yayをインストール

Arch Linux向けの非公式パッケージであるAURのパッケージを管理するのに使えるツール

```sh
cd /tmp
git clone https://aur.archlinux.org/yay-bin.git
cd yay-bin
makepkg -si
```

### ghをインストール

```sh
yay -S github-cli
```


### ghqをインストール

```sh
cd /tmp
wget https://github.com/x-motemen/ghq/releases/download/v1.3.0/ghq_linux_arm64.zip
unzip ghq_linux_arm64.zip
mv ghq_linux_arm64/ghq ~/.local/bin/
```

### 好みのフォントであるHackGenNFをインストール

```sh
wget https://github.com/yuru7/HackGen/releases/download/v2.7.1/HackGen_NF_v2.7.1.zip
unzip HackGen_NF_v2.7.1.zip
mv HackGen_NF_v2.7.1 HackGenNF
sudo mv HackGenNF /usr/share/fonts
fc-cache -fv
```

### asdfでnodejsとrubyとphpをインストール

```sh
git clone https://github.com/asdf-vm/asdf.git ~/.asdf --branch v0.10.2
source ~/.zshrc #事前にasdfのロード処理を書き込み済みだった
asdf plugin add nodejs
asdf install nodejs lts
asdf global nodejs lts
node --version

asdf plugin add ruby
asdf install ruby latest
asdf global ruby latest
ruby --version

asdf plugin add php
# 依存が結構ある
# ref: https://github.com/asdf-community/asdf-php/blob/master/.github/workflows/workflow.yml#L30
sudo pacman -S autoconf base-devel gd bison curl gettext git gd libcurl-openssl-1.0 libedit mlocate oniguruma postgresql-libs mysql re2c
sudo updatedb
asdf install php latest
asdf global php latest
php --version

asdf plugin add golang
asdf install golang latest
asdf global golang latest
go version
```

## おわりに

自宅ではしばらくAsahi Linuxを使ってみることにする。
ちなみに、この文章もAsahi Linux上のAlacritty + NeoVimから書いている。
