---
title: "rtxはじめました"
date: "2023-05-31T02:00:00+09:00"
tags: [ "開発環境", "shell", "rtx", "asdf" ]
---

ランタイム管理ツール[asdf](https://asdf-vm.com)と互換性のある、[rtx](https://github.com/jdxcode/rtx)を使い始めた。

asdfのプラグインエコシステムに乗っかっていて、できることはasdfと基本的には同じのようだが、はやい[^fast]などのメリットがある(後述)。

[^fast]: この記事に書かれている「はやい」「早い」はすべて体感です

## 切り替え

切り替えは以下のような手順で進めた。dotfilesの差分はこんな感じ [yammerjp/dotfiles 6a6951c](https://github.com/yammerjp/dotfiles/commit/6a6951c1abc8f7227351c5857ad459127bbd7fc5)。

1. シェルの設定ファイル(.zshrcなど)に書かれているasdfの読み込みをやめる

  私の場合はsheldonのプラグインにしていたので、~/.config/sheldon/plugins.tomlの記述をひとまずコメントアウトした。

2. rtxをいれる

  Apple SiliconのmacOSを使っていたら以下のような感じ。
  ```shell
  $ curl https://rtx.pub/rtx-latest-macos-arm64 > ~/.local/bin/rtx
  $ chmod u+x ~/.local/bin/rtx
  # ~/.local/bin/はPATHが通っている前提
  ```

3. rtxの読み込みをシェルの設定ファイルに書く

  複数端末で同じシェルの設定を書いているので、rtxをインストールしている端末だけに反映させたい。
  以下のような内容を`.zshrc`に追記

  ```zsh
  if (which rtx > /dev/null); then
    eval "$(rtx activate zsh)"
  fi
  ```

4. rtxの設定ファイルを配置

  `~/.config/rtx/config.toml`に、以下のような内容のファイルを置く

  ```toml
  [tools]
  awscli = ['latest']
  go = ['latest']
  # heroku-cli = ['latest']
  nodejs = ['latest', 'lts']
  ruby = ['latest', '2.7.8']
  php = ['latest', '7.4.33']
  terraform = ['latest', '1.0.5', '1.3.1', '1.3.3', '1.3.4', '1.3.6', '1.3.7']
  [settings]
  jobs = 4
  experimental = true
  ```

5. 各種ランタイムをインストール

  `rtx i`とすれば、設定ファイルを見て足りないものを全部インストールしてくれるらしい

  ```shell
  $ source ~/.zshrc
  $ rtx i
  ```

## いいところ

- 設定ファイルがXDG Base Directoryに従っている。すっきりしていい。
- `rtx i`とだけ実行すればいいので良いので楽。わかりやすい。
- 設定ファイルに複数バージョンを記述できる。
- インストールが早い。並列で実行してくれる。
- シェルの起動時に、設定ファイルにあるのに未インストールのものがあったら警告してくれたりする。

## なやみ

rtxに限らないが、他のツールを使うための基盤となるツールが増えていくと、それのセットアップが面倒になるという問題をはらんでいる。rtxはRust製なので、OSとCPUに合わせたバイナリを手に入れなければならない。

shelldonに, rtxに, ... 気をつけていても、だんだん増えていく。asdfはシェルスクリプトでできていて、どの端末でも切り替えなく入れられるのでその点はいいのだけど、rtxはさきに書いたメリットがあるので使っていきたいところ。

妥協案として、dotfilesリポジトリにバイナリをcommitしてしまって、yadmの[alternate files](https://yadm.io/docs/alternates)で環境ごとに実行ファイルを切り替えつつ使う、みたいにすると楽なのかもしれないとも思った。私の用途ではarm64のDariwin、x86_64のLinux、arm64のLinuxがあれば十分なはず。

この場合、バージョンが上がるごとに違うバイナリをcommitすることになるので、dotfilesリポジトリの容量が増えてセットアップ時のダウンロード容量が増えるけど、そこはshallow cloneするなりしていくといい、のだろうか？...。長期的には微妙だろう。

セットアップ用のシェルスクリプトを育ててもいいが、環境や状況によって必要なものの最低ラインが変わるので、区分けやセットアップ手順が煩雑になっていく。なるべくシンプルに、でも便利にするラインのせめぎ合いである。
手動で`brew install`なり`curl > `なりを、コマンド一つ打てばいいというのはその通りなんですが、開発環境の構築はそれの積み重ねなんですね〜

---

最後はrtxにあんまり関係ない話を書いてしまったが、なにはともあれrtxはいまのところ(まだ1日目)快適に使えている、もっとはやく入れればよかった。
