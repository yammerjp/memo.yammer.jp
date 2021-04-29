---
title: "MacBookAir 2020 (M1) のセットアップ"
date: "2020-12-22T14:24:01+09:00"
tags: [ "Mac", "AppleSilicon", "Setup" ]
---

Apple Silicon を搭載した MacBook Air を購入したのでセットアップをやっていく。
そのメモ。

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">m1 MacBook Air が届いたのでとりあえずたくさんアプリケーションやタブを連続起動して「はえ〜」ってやつをやりました。</p>&mdash; やんまー (@basd4g) <a href="https://twitter.com/basd4g/status/1340576122795266048?ref_src=twsrc%5Etfw">December 20, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

2020/12/20現在では「`brew bundle`しておわり」というわけにはいかない。
できる限りApple Silicon版のバイナリを使いたいので、各種ソフトウェアのビルド方法などを記録することにする。

## Tips

- `arch -x86_64` を先頭につけてコマンドを実行すると Rosseta2 上で実行してくれる。

## ソフトウェアのインストール以前

### macOS の設定

- ライブ変換の無効化
- OSのキーマップ設定を変更 (capslock -> esc)

### ssh

```sh
mkdir ~/.ssh
chmod 700 ~/.ssh
cd ~/.ssh
ssh-keygen -t rsa -b 4096 -C "mymail@example.com"
cat id_rsa.pub | pbcopy
```

[GitHub Settings](https://github.com/settings/keys) を開いて 'New SSH key' を追加

### dotfiles

```sh
xcode-select --install
curl -sL http://dot.basd4g.net | sh
cd dotfiles
make link
vim
```

## ソフトウェアのインストール


Web ページからパッケージをダウンロードしてインストールしたものは以下。

- [Scroll Reverser](https://pilotmoon.com/scrollreverser/)
- [Karabiner-Elements](https://karabiner-elements.pqrs.org/)
- [Zoom](https://zoom.us/download#client_4meeting) (起動してログインの後、Apple Silicon版にアップデートするダイアログが出てくる)
- [MacPorts](https://www.macports.org/install.php)
- [Firefox](https://www.mozilla.org/ja/firefox/new/)
- [Google Chrome](https://www.google.co.jp/chrome)

([Vivaldi](https://vivaldi.com/ja/) はまだintel版しかないので、アップデートして欲しい。)


ビルドするなどして導入したのは以下。

### Homebrew (for Apple Silicon)

```sh
sudo mkdir /opt/homebrew
sudo chown $USER /opt/homebrew
curl -L https://github.com/Homebrew/brew/tarball/master | tar xz --strip 1 -C /opt/homebrew
```

### tmux

```sh
brew install --build-from-source tmux
```

### Node.js

```sh
sudo port install nvm # install nodejs version manager
echo 'source /opt/local/share/nvm/init-nvm.sh' >> ~/.zshrc
sudo port install git curl openssl automake
nvm install v15
```

参考: [個人的 M1 mac 開発環境状況 2020/11/28更新 - Zenn.dev](https://zenn.dev/ioridev/articles/c74af379e4e73151790d)

nodejsのビルドはそこそこ CPU パワーと時間を使う

### Golang

まずはIntel版をWebからダウンロードしてインストールする([The Go Programming Language](https://golang.org/))

次に以下の手順でApple Silicon向けにビルドした後、Intel版を削除

```sh
go get golang.org/dl/gotip
GODEBUG=asyncpreemptoff=1 GOARCH=arm64 ~/go/bin/gotip download
echo "$HOME/sdk/gotip/bin/darwin_arm64" | sudo tee /etc/paths.d/go
which go # check to be installed
sudo rm -rf /usr/local/go
```

### peco

```sh
cd
git clone https://github.com/peco/peco.git && cd peco
make build
mv ~/peco/releases/peco_darwin_arm64/peco /usr/local/bin/peco
```

### hugo

```sh
cd
git clone https://github.com/gohugoio/hugo.com && cd hugo
go build
mv ~/hugo/hugo /usr/local/bin/hugo
```

### jq

```sh
brew install --build-from-source jq
```

### gh

```sh
cd
git clone https://github.com/cli/cli.git && cd cli
make
mv bin/gh /usr/local/bin/gh
```

### mmv

```sh
cd
git clone https://github.com/itchyny/mmv.git && cd mmv
make
mv mmv /usr/local/bin/mmv
```

### ImageMagick

[ImageMagick - Install from Source](https://imagemagick.org/script/install-source.php)

```sh
# libjpeg
curl https://download.imagemagick.org/ImageMagick/download/delegates/jpegsrc.v9b.tar.gz -o jpegsrc.v9b.tar.gz
tar xvf jpegsrc.v9b.tar.gz
cd jpeg-9b
./configure
make
sudo make install

# image magick
cd
git clone https://github.com/ImageMagick/ImageMagick.git && cd ImageMagick
git checkout　7.0.9-9
./configure
make
sudo make install
```
