---
title: "複数の環境に適応する、階層構造のdotfiles"
date: "2021-12-02T14:00:00+09:00"
tags: [ "dotfiles", "bash" ]
---

こんにちは、やんまーです。
もう師走、早いですね...
この記事は[GMOペパボアドベントカレンダー](https://adventar.org/calendars/6375)の2日目のものです。

昨日は[daiki](https://twitter.com/_doew)さんの「[社会人エンジニアな僕が研究を続ける理由](https://blog.d-sato.net/?p=116)」でした。
記事の中の研究を通して自己表現をされているという表現が印象的でした。仕事に精を出しながらも、仕事とは異なるところで時間をとって継続的に物事に取り組むということに尊敬の念を持ちます。
私も見習いたいものです。

今日は変わって実践的な内容です。私の開発環境 dotfilesを紹介します。

## dotfiles とは

Unix / Linux の環境において、`~/.bashrc`、 `~/.vimrc`、 `~/.gitconfig` のように `.` から始まる各アプリケーションの設定ファイルが `$HOME` ディレクトリに配置されることがよくあります。
これらの設定ファイルを自分の持っている複数のPCに適用したいというモチベーションや、PCを乗り換えた時のためにバックアップして復元したいというモチベーションから、ローカルのストレージ以外にも保存するということが行われています。

こういった設定ファイル群とこれらをローカルストレージ以外の場所に保存することを指して dotfiles と呼び、GitHubのリポジトリで公開するなどしている人もいます。
かくいう私も自らの設定ファイルを保存・公開している人の一人で、GitHubのリポジトリ ([yammerjp/dotfiles](https://github.com/yammerjp/dotfiles)) から誰でも見れるようにしています。

## 単純なdotfiles

本記事で後述する複数環境に対応した構成のまえに、単純なdotfilesの構成として [yammerjp/dotfiles-mini](https://github.com/yammerjp/dotfiles-mini) をみてみましょう。
このリポジトリには次のようなファイルがあります。

| ファイル名 | ファイルの役割 |
| --- | --- |
| `.gitconfig` | gitの設定 |
| `.tmux.conf` | tmuxの設定 |
| `.vimrc` | vimの設定 |
| `.zshrc` | zshの設定 |
| `README.md` | リポジトリ全体の説明 |
| `run.sh` | dotfilesを適用するシェルスクリプト |

ここで注目するのは `run.sh` というシェルスクリプトです。
内容の一部を抜粋すると以下のようになっています。

```bash
# リポジトリをダウンロードする
# ========================================
cd "$HOME"
git clone https://github.com/yammerjp/dotfiles-mini.git
cd dotfiles-mini


# シンボリックリンクを貼る
# ========================================
DOTFILES_DIR=`pwd`
ln -s "$DOTFILES_DIR/.zshrc" ~/.zshrc
ln -s "$DOTFILES_DIR/.vimrc" ~/.vimrc
ln -s "$DOTFILES_DIR/.gitconfig" ~/.gitconfig
ln -s "$DOTFILES_DIR/.tmux.conf" ~/.tmux.conf
```

GitHubからダウンロードしてくることと、設定を適用すること (シンボリックリンクを作成し `~/.zshrc` などで参照できるようにすること) を行なっています。
このように設定を保存・公開するだけでなく、あわせて設定を適用するスクリプトを付属させておくと便利に使えます。

## 複数環境にする需要

さてさて、上記のように各アプリケーションの設定を保存・公開し、適用するスクリプトも用意できたのですが、しばらくするとさらに欲が出てきてしまいます。

- 複数のOSの環境 (片方がLinux、片方がmacOS) が手元にあり、それぞれの設定を管理したい [^1]
- 同じOSの複数の環境 (職場のPCと自宅のPC) が手元にあり、それぞれの設定を管理したい
- 会社で使っている設定は公開したくないが、自宅で使っている設定は公開したい
- 複数の環境の設定の一部を共通化したい

このように複数の環境が存在しそれぞれ異なる設定を保持したい場合や、設定の公開範囲を制御したい場合に役立つのが、今回紹介する複数環境に適応した階層構造のdotfilesです。

## 階層構造の実装

公開範囲や適用環境を複数定めることができるように、以下のような構成をつくります。

- いくつかの設定ファイルを含むディレクトリを複数用意する (階層とよぶ)
- 用意した階層の中から任意の順番で任意の個数の階層を選び、順番に適用する。

複数の階層 (ディレクトリ) に分割することで、一部はGitHubのパブリックリポジトリに置かないという選択肢もとれますし、一部のPCでは特定の階層を適用しないという選択肢もとれます。
また、`順番に適用する` とあるように、各階層で設定ファイルが重複するとき、優先順位を指定することができるようにしています。

具体的に私の環境は以下のようなディレクトリの階層構造になっています。

- 自宅のMacbook Air
  - [`Darwin--arm64` 階層](https://github.com/yammerjp/dotfiles/tree/f246a47414789fb17372fe6ee44f238405d7c194/env/Darwin--arm64)
  - [`Darwin` 階層](https://github.com/yammerjp/dotfiles/tree/f246a47414789fb17372fe6ee44f238405d7c194/env/Darwin)
  - [`common` 階層](https://github.com/yammerjp/dotfiles/tree/f246a47414789fb17372fe6ee44f238405d7c194/env/common)
- 会社のMacbook Pro
  - `company` 階層
  - [`Darwin--x86_64` 階層](https://github.com/yammerjp/dotfiles/tree/f246a47414789fb17372fe6ee44f238405d7c194/env/Darwin--x86_64)
  - [`Darwin` 階層](https://github.com/yammerjp/dotfiles/tree/f246a47414789fb17372fe6ee44f238405d7c194/env/Darwin)
  - [`common` 階層](https://github.com/yammerjp/dotfiles/tree/f246a47414789fb17372fe6ee44f238405d7c194/env/common)

全ての環境に共通の設定を集めた最も下の階層として `common` 階層を配置しています。
その上の階層として、macOSのみに必要な設定を `Darwin` 階層に、さらに上の階層として arm64 / x86_64 の macOS に必要な設定をそれぞれ `Darwin--arm64` 階層, `Darwin--x86_64` 階層に配置し、commonなどの下の階層の設定を一部上書きます。
加えて最上位の階層として、会社のPCで利用している公開できない設定などを含んだ `company` 階層を配置し、これは会社のGitサーバで管理するようにしています。

![階層構造のdotfilesのイメージ図](https://blob.yammer.jp/layered-dotfiles.png)

このような階層構造は、各設定ファイルを適用する (シンボリックリンクを貼る) スクリプトを工夫することで実現しています。
実際に実行されるスクリプトの動作とともに紹介します。
例えば以下のようなコマンドを実行することを考えます。

```shell
$ DOTFILE_DIRS="$HOME/src/github.com/yammerjp/dotfiles/env/Darwin--arm64:$HOME/src/github.com/yammerjp/dotfiles/env/Darwin:$HOME/src/github.com/yammerjp/dotfiles/env/common" ./bin/dotfiles link
```


[`bin/dotfiles`](https://github.com/yammerjp/dotfiles/blob/baa8cd1ecc183481ab29a402607cdc638864f6f5/bin/dotfiles) は変数 `$DOTFILE_DIRS` に `:` で区切られたディレクトリの列が指定されることを期待します。[^2]
また指定されたディレクトリ列がそのまま、各階層のルートディレクトリとなります。なお先に記述されたものが上位の階層として扱われます。

今回でいえば上位から順に3つの階層をもちます。

- `Darwin--arm64` 階層 [`$HOME/src/github.com/yammerjp/dotfiles/env/Darwin--arm64`](https://github.com/yammerjp/dotfiles/tree/baa8cd1ecc183481ab29a402607cdc638864f6f5/env/Darwin--arm64)
- `Darwin` 階層 [`$HOME/src/github.com/yammerjp/dotfiles/env/Darwin`](https://github.com/yammerjp/dotfiles/tree/baa8cd1ecc183481ab29a402607cdc638864f6f5/env/Darwin)
- `common` 階層 [`$HOME/src/github.com/yammerjp/dotfiles/env/common`](https://github.com/yammerjp/dotfiles/tree/baa8cd1ecc183481ab29a402607cdc638864f6f5/env/common)

それぞれの階層のディレクトリにあるファイルからホームディレクトリへ、シンボリックリンクが作成されます。
このとき、それぞれの階層のディレクトリの中で、階層の起点となるディレクトリから同名の相対パスのファイルがあれば、その中で最も上位の階層のファイルのみホームディレクトリへシンボリックリンクが貼られます。

例えば各階層 (`Darwin--arm64`, `Darwin`, `common`) に `.zshrc` があるとき、最も上位の階層のものである [`Darwin--arm64` 階層の `.zshrc`](https://github.com/yammerjp/dotfiles/blob/baa8cd1ecc183481ab29a402607cdc638864f6f5/env/Darwin--arm64/.zshrc) から `$HOME/.zshrc` へシンボリックリンクが貼られます。

## 各設定ファイルでの工夫

上述のように同名のファイルは上位階層が優先されてしまうので、設定ファイルの一部を共通化したいときは、ファイルを分割して用意することで対応しています。

例えば [`common` 階層の `.zshrc`](https://github.com/yammerjp/dotfiles/blob/f246a47414789fb17372fe6ee44f238405d7c194/env/common/.zshrc) は無視されてしまうので、設定の中身は同階層の [`.zshrc-common`](https://github.com/yammerjp/dotfiles/blob/f246a47414789fb17372fe6ee44f238405d7c194/env/common/.zshrc-common) に切り出し、`.zshrc` ではそれを読み込むだけにします。
同様に `Darwin` 階層では内容を `.zshrc-darwin` に、 `Darwin--arm64` 階層では内容を `.zshrc-darwin-arm64` に記述し、各 `.zshrc` は自身の階層と下位階層の `~/.zshrc-*` を読み込むだけにして、上書きされても問題ないようにしています。

![.zshrcは上書きされるので、.zshrc-\*に切り出している様子のイメージ図](https://blob.yammer.jp/layered-dotfiles-overwriting.png)

このような行為は他の設定ファイルでも行なっていて、例えば `.gitconfig` にも include の仕組みがあるので、`.gitconfig` は上書きされてもいいように [`.gitconfig-common`](https://github.com/yammerjp/dotfiles/blob/f246a47414789fb17372fe6ee44f238405d7c194/env/common/.gitconfig-common) に設定を書いて [`.gitconfig`](https://github.com/yammerjp/dotfiles/blob/f246a47414789fb17372fe6ee44f238405d7c194/env/common/.gitconfig) はそれを読み込むだけにしています。

## おわりに

こうして工夫をすることで、自宅のUbuntuでも、会社のMacbookでも、サクッと用意したEC2でもすぐに自分の環境が用意できる仕組みを作っています。
設定ファイルだけでなく、パッケージのインストールやOSの設定の変更などのスクリプトも管理しようとしています。
これは生産性を向上させるためというより、それを歌いながらもdotfilesを育てていくのが楽しいだけなのですが、少しばかりは便利になっているはずです。
今日は私のdotfilesを紹介したので、ぜひ皆さんのご自慢のdotfilesがあれば教えてください。

というわけでアドベントカレンダー2日目の記事を終わりにします。
何も考えずに「ええやろ！」という気持ちで2日目にエントリーしましたがひとまず書き終え安心しています。
明日は[akichan](https://twitter.com/ch11aki)さんです、バトンを託します！

---

[^1]: このことだけであれば、OSごとに設定が違うときは各設定ファイルの中で分岐するように記述すれば解決できるものもあるでしょう。例えば `~/.zshrc` などは if 文で分岐すれば済みます。
[^2]: 実際には `common` や `Darwin`, `Darwin--arm64` といったディレクトリはデフォルトで指定されるようにしています。OS(とLinuxならディストリビューション名) とCPUのアーキテクチャから、[それぞれの環境に即した3-4階層を定めています](https://github.com/yammerjp/dotfiles/blob/f246a47414789fb17372fe6ee44f238405d7c194/bin/link-list.sh#L37-L42)。会社のGitリポジトリで管理している設定やGitHubのプライベートリポジトリで管理している設定を適用したいときに、 `$DOTFILE_DIR` などの変数にそのディレクトリのパスを与えると、デフォルトの3-4層に上位階層としてこれを加えた状態となるようにしています。階層の追加は後からでもできる (コマンドを叩けばシンボリックリンクを貼り直せる) ので、新しい環境では (そのOSとアーキテクチャに即した設定を用意していれば) `./bin/dotfiles link` とするだけでよくて、あとから必要な階層を足していくようにして運用しています。
