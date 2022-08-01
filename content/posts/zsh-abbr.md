---
title: "abbrはじめました。"
date: "2022-08-04T10:26:00+09:00"
tags: [ "dotfiles", "zsh" ]
---

同僚に教えてもらった [zsh-abbr](https://github.com/olets/zsh-abbr)を導入しました。

## zsh-abbrとは

abbr は abbreviation の略で、おそらくもともとfish shellに組み込まれた機能とコマンド名を指しているようです。fishのabbrコマンドは、短いコマンド名を展開するalias コマンドに似た働きをするものです。

`alias`コマンドとの違いは以下のようなところにあります

- 実行前にプロンプト上で短いコマンド名を展開してから実行される
  - historyには展開された結果が記録に残る
- 短いコマンド名を入力したあとスペースキーを入力しても、プロンプト上で展開される

zsh-abbrはfishのabbrコマンドと同等のものをzsh上でも再現できるzshプラグインです。筆者はzshを使っているので、本記事ではzsh-abbrを導入します。

## 導入

なるべくシンプルな状態を維持する目的でzshプラグインは入れないようにしていたのですが、複数のホストで環境を再現しやすいよう、zsh-abbrを導入するにあたってプラグインマネージャーも一緒に導入しました。

zshプラグインは速そうな[Zinit](https://github.com/zdharma-continuum/zinit)を選びました。


### Zinitの導入

インストールはREADMEに書いてある通り進めるだけです。

```sh
$ bash -c "$(curl --fail --show-error --silent --location https://raw.githubusercontent.com/zdharma-continuum/zinit/HEAD/scripts/install.sh)"
```

上記のコマンドを実行すると、`~/.zshrc` に設定の読み込みなどが追記されるので `source ~/.zshrc` として読み込めば利用できるようになっています。

### zsh-abbrの導入

github.comに公開されているzshプラグインは、ユーザ名とリポジトリ名を指定すると利用できるようになります。
以下の一行を `~/.zshrc` の、Zinitの読み込み処理の下に記述しました。

```sh
# ~/.zshrc
zinit light olets/zsh-abbr
```

ref: https://github.com/zdharma-continuum/zinit#loading-and-unloading

### 導入例

ここまでの記述は、`~/.zshrc`などの起動時の読み込まれるzshスクリプト内に記述すると良いでしょう。

一例として、以下のようになるかと思います。

```zsh
# ~/.zshrc

# Zinitのインストール時に挿入される、初期化関連の記述
### Added by Zinit's installer
if [[ ! -f $HOME/.local/share/zinit/zinit.git/zinit.zsh ]]; then
    print -P "%F{33} %F{220}Installing %F{33}ZDHARMA-CONTINUUM%F{220} Initiative Plugin Manager (%F{33}zdharma-continuum/zinit%F{220})…%f"
    command mkdir -p "$HOME/.local/share/zinit" && command chmod g-rwX "$HOME/.local/share/zinit"
    command git clone https://github.com/zdharma-continuum/zinit "$HOME/.local/share/zinit/zinit.git" && \
        print -P "%F{33} %F{34}Installation successful.%f%b" || \
        print -P "%F{160} The clone has failed.%f%b"
fi

source "$HOME/.local/share/zinit/zinit.git/zinit.zsh"
autoload -Uz _zinit
(( ${+_comps} )) && _comps[zinit]=_zinit

### End of Zinit's installer chunk

# Zinitを用いてzsh-abbrを利用する
zinit light olets/zsh-abbr
```

## 設定

### zsh-abbrの設定

zsh-abbrには、既に貼られているaliasを読み込んで保持する機能があります。[^1]
今回はこれを利用することにして、以下のコマンドを実行します。

```sh
$ abbr import-aliases
```

gitのaliasもzsh-abbrで展開する機能が備わっているようなので、同様にgitのaliasも読み込みます。

```sh
$ abbr import-git-aliases
```

`import-git-aliases`を利用すると、gに続けてエイリアスをタイプしたり、もしくはエイリアスを直接コマンドとしてプロンプトに入力すると展開されます。
たとえば私は `git d` が `git diff` となるようなエイリアスをgitの設定に書き込んでいます。この場合、プロンプトに `gd` や `d` と入力すると `git diff` が実行されることになります。

### 細かな工夫

#### git aliasの入れ子を排除

私のもともとの設定にはgitやzshのaliasが入れ子になっている場合があったため、入れ子を排除するような記述に書き換えました。

たとえば、gitでは以下のような設定をしていました。

```.gitconfig
# ~/.gitconfig
[alias]
        di = "diff --ignore-all-space"
        ds = "di --staged"
```

このようなとき、zsh-abbrは `gds` を `git di --staged` とは展開してくれますが、 `git diff --ignore-all-space --staged` とまでは展開してくれません。
全て展開するために、aliasが入れ子にならないよう、以下のように設定を書き換えることとしました。

```.gitconfig
# ~/.gitconfig
[alias]
        di = "diff --ignore-all-space"
        ds = "diff  --ignore-all-space --staged"
```

#### あえてgit aliasを入れ子にする

gitのaliasのうちコマンド実行であるもの (`!`で始まるもの) は展開に対応していないようなので[^2]、これらはあえてaliasを張っています。

以下に例を示します。
登録しているgitのaliasを表示するコマンド `alias` と `als` をgitの設定に記述しています。

```.gitconfig
# ~/.gitconfig
[alias]
        alias = "!git config --list | grep -e '^alias' | sed -e 's/alias\\.//' -e 's/=/\\t\\t/'"
        als = alias
```

この場合`alias` はabbrに対応していませんが、その短縮系である`als`はabbrに対応しています。
つまり `galias` は実行できませんが、`gals` とコマンド入力すると abbrを介して `git alias` が実行されます。
さらにこれはgitのもともとのalias機能を介してコマンド実行がなされるので、gitのaliasの一覧が表示されるということになります。

gitのaliasについて、入れ子に対応していないこととコマンド実行に対応していないことをうまく活かして一部展開されるような状態をつくってみました。

## 感想

実行時にどんなコマンドを実行しているか都度表示されることで、画面共有時などに役立ちそうです。
historyの検索に展開されたものが記録されるという恩恵はしばらく使い続けないと効果が感じられないと思うので、この設定で運用してみようと思います。

ちなみにタイトルについて補足しておくと、冷やし中華はまだ始めていません。(今夏食べた記憶がない。)

[^1]: 保存した内容は`abbr`コマンドで操作できるようです。また記録先としては`$ABBR_USER_ABBREVIATIONS_FILE`に保存されているようです。
[^2]: https://github.com/olets/zsh-abbr/blob/91280150cf8de09f84ab02c00fc04605400ea914/zsh-abbr.zsh#L337
