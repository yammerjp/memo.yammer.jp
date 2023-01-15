---
title: "Ubuntu DesktopにAlacrittyをインストールする"
date: "2023-01-16T01:54:41+09:00"
tags: [ "Ubuntu", "Linux", "Alacritty" ]
---

[Alacritty](https://alacritty.org)は、公式ではLinux向けのバイナリが配布されていないので、どこかから入手するか、自分でビルドする必要があります。

以下では、Ubuntu Desktop 22.04上でビルドし、インストールする方法を紹介します。なお、この記事の内容は2023/01/16時点のものです。また、[公式に提供されているインストール用ドキュメント](https://github.com/alacritty/alacritty/blob/master/INSTALL.md)を参考にしています。

### 簡易的に利用するとき

ビルドされた実行ファイルをPATHの通った場所に配置するのみで良い場合は、こちらの方法を実行します。デスクトップのランチャー上にアイコンを表示したり、マニュアルをインストールした場合は、後述の「本格的に利用する」を参考にしてください。

```
# Alacrittyのビルドに必要なaptパッケージをインストールする
$ sudo apt-get install cmake pkg-config libfreetype6-dev libfontconfig1-dev libxcb-xfixes0-dev libxkbcommon-dev python3 curl
# https://rustup.rs/ に従い、Rustの開発ツールをインストールする
# 実行するとインストールオプションを選択する画面が現れるので、「1) Proceed with installation (default)」を選択する (1を入力後にエンターを押す)
$ curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
# cargoコマンドを利用するために、シェルの設定ファイルを再読み込みする
$ source ~/.bashrc
$ cargo install alacritty
```

完了したら、シェル上でコマンド`alacritty`を実行することで、Alacrittyを起動できます。

![コマンドでAlacrittyを起動する](https://blob.yammer.jp/how-to-install-alacritty-run.png)

### 本格的に利用するとき

マニュアルをインストールしたり、デスクトップのランチャー上にアイコンを表示したい場合は、以下の手順でインストールします。

#### (必須) ビルド・インストールする

シェル上で以下のコマンドを順番に実行してください。ビルドに必要なツールをインストールし、ソースコードを入手してから、ビルドします。

```
# Alacrittyのビルドに必要なaptパッケージをインストールする
$ sudo apt-get install cmake pkg-config libfreetype6-dev libfontconfig1-dev libxcb-xfixes0-dev libxkbcommon-dev python3 curl git

# https://rustup.rs/ に従い、Rustの開発ツールをインストールする
#   実行するとインストールオプションを選択する画面が現れるので、1を入力後にEnterキーを押す
#   (「1) Proceed with installation (default)」を選択する)
$ curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# cargoコマンドを利用するために、シェルの設定ファイルを再読み込みする
$ source ~/.bashrc

# Alacrittyのソースコードを入手する
$ git clone https://github.com/alacritty/alacritty.git ~/alacritty
$ cd ~/alacritty

# バイナリをPATHの通った場所に配置する
$ cp target/release/alacritty /usr/local/bin 
```

`/usr/local/bin`に配置できたら、シェル上で`alacritty`コマンドを起動すると、Alacrittyが起動し、ウィンドウが現れることが確認できます

![コマンドでAlacrittyを起動する](https://blob.yammer.jp/how-to-install-alacritty-run.png)

#### (任意) デスクトップのランチャー上にアイコンを表示する

デスクトップのランチャー上にAlacrittyを表示するには、シェル上で、以下のコマンドを順番に実行してください。

```
# デスクトップのランチャー上にアイコンを表示し、GUI環境でクリックするだけで起動できるようにする
$ cd ~/alacritty
$ sudo cp extra/logo/alacritty-term.svg /usr/share/pixmaps/Alacritty.svg
$ sudo desktop-file-install extra/linux/Alacritty.desktop
$ sudo update-desktop-database
```

完了すると、GUIキー (キーボードによっては、WindowsキーやCommandキー) を押下したあと、`Alacritty`とタイプすると、Alacrittyのアイコンが表示されます。クリックするとAlacrittyが起動します。

![Alacrittyのアイコンが表示される](https://blob.yammer.jp/how-to-install-alacritty-icon.png)

#### (任意) マニュアルをインストールする

Alacrittyのマニュアルをインストールするには、シェル上で、以下のコマンドを順番に実行してください。

```
# manコマンドで、Alacrittyのマニュアルを閲覧できるようにする
$ cd ~/alacritty
sudo mkdir -p /usr/local/share/man/man1
gzip -c extra/alacritty.man | sudo tee /usr/local/share/man/man1/alacritty.1.gz > /dev/null
gzip -c extra/alacritty-msg.man | sudo tee /usr/local/share/man/man1/alacritty-msg.1.gz > /dev/null
```

完了すると、コマンド`man alacritty`で、Alacrittyのマニュアルを閲覧できます。

![Alacrittyのマニュアルが閲覧できる](https://blob.yammer.jp/how-to-install-alacritty-man.png)

### (任意) bash補完を利用可能にする

`alacritty`コマンドをbash上で実行するとき、Tabキーで補完をするには、以下のコマンドを順番に実行してください。

```
# bash上で、alacrittyコマンドの補完をできるようにする
mkdir -p ~/.bash_completion
cp extra/completions/alacritty.bash ~/.bash_completion/alacritty
echo "source ~/.bash_completion/alacritty" >> ~/.bashrc
```

完了すると、bash上で`alacritty `と入力した後にTabキーを押すと、補完候補が表示されるようになります。

![Alacrittyのbash補完が表示される](https://blob.yammer.jp/how-to-install-alacritty-completion.png)
