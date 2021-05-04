---
title: "tmuxに入門する"
date: "2020-10-31T23:53:54+09:00"
---

vim を使うようになってから特に複数のターミナルウィンドウを開くことが多くなったので, 便利そうな tmux を使ってみる.
以前から存在は知っていたもののキーバインドが多くて慣れるの大変そうだと敬遠していたが, 自分の時間が出来たので良い機会だろう.

## tmuxとは

GitHub の公式リポジトリでは以下のように説明されている.

> tmux is a terminal multiplexer: it enables a number of terminals to be created, accessed, and controlled from a single screen. tmux may be detached from a screen and continue running in the background, then later reattached.

([tmux/tmux: tmux source code](https://github.com/tmux/tmux))

(意訳)
tmux はターミナルマルチプレクサである.
これは一つの画面から複数の画面を作成し, アクセス, 制御が出来る.
tmux は画面から分離してバックグラウンドで動作を継続し, のちに再度接続できる.)

tmux は次のことを実現する.

- 一つのターミナルを画面分割して2つ以上のターミナルとして扱える. (開発時に, エディタ, git, 各種CLIなどを並行して操作できる)
- tmux を離れてもセッションを継続できる. (ssh の際に不意にセッションが切れても, 再度つなぎ直すと状態を復元してくれる)

## SetUp

```sh
# インストール
# 環境: Ubuntu 20.04
$ sudo apt install tmux -y

# macOSなら
# $ brew install tmux

# 起動
$ tmux
```

## とりあえず使ってみる

1. ターミナルで `$ tmux` を実行し tmux を起動する.
1. デフォルトのキーバインドでいくつか動作を実行してみる. 
1. `Ctrl-b %` (`Ctrl`と`b`を同時押しして離し, 続けて`%`を入力) を押すと, ペインを作成 (画面を左右に分割) できる.
1. `Ctrl-b 矢印キー` で作成したペイン間を移動できる.
1. `Ctrl-b c` でウィンドウを作成できる.
1. `Ctrl-b w` 作成したウィンドウを選択できる.
1. `Ctrl-b x` でペインを閉じることができる.
1. `Ctrl-b d` でセッションをデタッチできる. (バックグラウンドでセッションを維持したまま, tmuxから抜ける.)
1. ターミナルで `$ tmux a` と実行すると,前回実行していたセッションをアタッチできる. (バックグラウンドのセッションに接続.)

このようにして画面を分割したり, セッションを維持したままターミナルから離れたり出来る.

その他のデフォルトのキーバインドは [tmux入門 - とほほのWWW入門](http://www.tohoho-web.com/ex/tmux.html) が参考になる.

tmux は複数のターミナルを束ねるが, それは次のような構造になっている.

- tmux は複数のセッションを持てる.
- セッションは複数のウィンドウを持てる.
- ウィンドウは複数のペインを持てる. (画面分割)

---

基本は以上だが, その他にも使い切れないほど沢山の機能があるので, 以降では便利そうな機能を抽出のうえカスタマイズして使いやすくする.

## 好みの状態にカスタマイズする

### 好みのペイン分割をするコマンドを作る

好みのペイン分割をすぐにできるようなスクリプトを作っておく.

```sh
$ echo 'alias ide="bash ~/.tmux-ide.sh"' >> .bashrc
$ vim ~/.tmux-ide.sh
```

```bash:~/.tmux-ide.sh
#!/bin/bash
tmux split-window -d -t 0        # 上下に画面分割
tmux send-keys -t 0 vim C-m      # ペイン0 (画面上部) で vim を実行
tmux split-window -h -t 1        # ペイン1 (画面下部) を左右に分割
tmux select-pane -t 0            # フォーカスをペイン0に移動する
tmux resize-pane -t 0 -D 10      # ペイン0を下方向に広げる
tmux send-keys -t 0 ':e ~/dev/'  # ペイン0 に ':e ~/dev/'と入力する (vim でファイルを開くことを助ける)
```

こうすると, tmux 起動後や新しいウィンドウ作成後に `$ ide` と打つと, 自動で3つのペインに画面分割をしてvimを起動してくれる.

### Vim のカラースキームがおかしくなる件を修正

vimのカラースキームが未設定だと, tmux内のvimとtmux外のvimで配色が変わるので, なんでもいいからカラースキームを設定する

```sh
$ echo 'colorscheme pablo' >> ~/.vimrc
```

### ~/.tmux.confを作成

- tmux は表示やキーバインドをカスタマイズできる.
- `~/.tmux.conf`に設定を書き込むと, デフォルトで読み込んでくれる.
- tmux を既に起動している状態でも, ファイル保存後に, `prefix :source ~/.tmux.conf`で設定ファイルをリロード可能.

tmux は出来ることが多いが, そのためのキーバインドを覚えるのが大変そう.
他人の設定した tmux を触らなければならないこともそう無いだろうし, 最初からカスタマイズして覚えやすそう/使いやすそうなキーに設定することにする.

設定内容は検索すると沢山出てくるので, 適当なものを取り込むと良いだろう.
記事末尾に参考となりそうなページをを記載する.

以下では, 次のような内容の設定を行う.

- prefix キーの変更
- 色の変更
- status line に表示する情報を変更
- マウス操作の有効化
- 各種キーバインドの変更

```sh
$ vim ~/.tmux.conf
```

```plaintext:~/.tmux.conf
# tmux起動時のシェルをzshにする
set-option -g default-shell /bin/zsh

# prefixキーをC-jに変更する
set -g prefix C-j

# ウィンドウ終了
bind Q kill-window


## --------------------見た目--------------------

# tmuxを256色表示出来るようにする
set-option -g default-terminal screen-256color
set -g terminal-overrides 'xterm:colors=256'

# 非アクティブなウィンドウの背景色を灰色にする
set-option -g window-style 'bg=#444444'
# アクティブなウィンドウの背景色を黒色にする
set-option -g window-active-style 'bg=#222222'

# status-left の最大の長さを指定する。
set-option -g status-left-length 20
# status-left のフォーマットを指定する。
set-option -g status-left "#[fg=colour255,bg=colour241]Session: #S #[default]"

# window-status のフォーマットを指定する。
set-window-option -g window-status-format " #I: #W "
# カレントウィンドウの window-status のフォーマットを指定する
set-window-option -g window-status-current-format "#[fg=colour255,bg=colour27,bold] #I: #W #[default]"

# 現在時刻を最右に表示
set-option -g status-right '%Y-%m-%d(%a) %H:%M:%S'

# ステータスバーを1秒毎に描画し直す
set-option -g status-interval 1


## --------------------マウス--------------------

#マウス操作を有効にする
set-option -g mouse on

# スクロールアップするとコピーモードに入る
bind-key -n WheelUpPane if-shell -F -t = "#{mouse_any_flag}" "send-keys -M" "if -Ft= '#{pane_in_mode}' 'send-keys -M' 'select-pane -t=; copy-mode -e; send-keys -M'"

# 最後までスクロールダウンするとコピーモードを抜ける
bind-key -n WheelDownPane select-pane -t= \; send-keys -M


## --------------------ペイン--------------------

# vimのキーバインドでペインを移動する
bind h select-pane -L
bind j select-pane -D
bind k select-pane -U
bind l select-pane -R

# vimのキーバインドでペインをリサイズする
bind -r H resize-pane -L 5
bind -r J resize-pane -D 5
bind -r K resize-pane -U 5
bind -r L resize-pane -R 5

# ペインを垂直分割する
bind v split-window -h -c '#{pane_current_path}'
# ペインを水平分割する
bind s split-window -v -c '#{pane_current_path}'

# ペイン番号を表示
bind i display-panes

# ペインを終了
bind q kill-pane
```

### Keybinds

.tmux.conf にて キーバインドを書き換え済みのものは is default ? を no と表記している.

### 基本

| command | description | is default ? |
| ---- | ---- | ---- |
| Ctrl-j | prefix | no |
| prefix  ? | キーバインド一覧 | YES |

### セッション

| command | description | is default ? |
| ---- | ---- | ---- |
| prefix  d | 現在のセッションを継続したままtmuxを閉じる (detach) | YES |

### ウィンドウ

| command | description | is default ? |
| ---- | ---- | ---- |
| prefix c | 新規ウィンドウの作成/追加 | YES |
| prefix w | ウィンドウの一覧 | YES |
| prefix Q | ウィンドウの破棄 | no |
| prefix n | 次のウィンドウへ移動 | YES |
| prefix p | 前のウィンドウへ移動 | YES |
| prefix 数字 | 当該番号のウィンドウへ移動 | YES |
| prefix < | 当該ウィンドウをリネームや移動等 | YES |

### ペイン

| command | description | is default ? |
| ---- | ---- | ---- |
| prefix v | 左右にペイン分割 | no |
| prefix s | 上下ペイン分割 | no |
| prefix h | 左のペインへ移動 | no |
| prefix j | 下のペインへ移動 | no |
| prefix k | 上のペインへ移動 | no |
| prefix l | 右のペインへ移動 | no |
| prefix H | ペインを左にリサイズ | no |
| prefix J | ペインを下にリサイズ | no |
| prefix K | ペインを上にリサイズ | no |
| prefix L | ペインを右にリサイズ | no |
| prefix q | ペインを破棄 | no |
| prefix i | ペイン番号を表示 (続けて数字を入力すると当該ペインへ移動) | no |
| prefix > | 当該ペインをリネームや移動等 | YES |

### コピー&ペースト

| command | description | is default ? |
| ---- | ---- | ---- |
| prefix [ | コピーモード開始 | YES |
| prefix Space  | コピー開始位置決定 | YES |
| prefix Enter | コピー終了位置決定 | YES |
| prefix ] | コピーした内容の貼り付け | YES |

## 参考

- [tmux/tmux: tmux source code](https://github.com/tmux/tmux)
- [tmux-ja/tmux-ja.rst at master · zchee/tmux-ja](https://github.com/zchee/tmux-ja/blob/master/tmux-ja.rst)
- [VSCode-like environment with vim + tmux | by Takuya Matsuyama | Dev as Life](https://blog.inkdrop.info/vscode-like-environment-with-vim-tmux-4c2bfe17d31e)
- [tmuxを必要最低限で入門して使う - Qiita](https://qiita.com/nl0_blu/items/9d207a70ccc8467f7bab)
- [tmux入門 - とほほのWWW入門](http://www.tohoho-web.com/ex/tmux.html)
- [tmux の status line の設定方法 - Qiita](https://qiita.com/nojima/items/9bc576c922da3604a72b)
- [tmuxで快適なターミナル生活を送ろう - Qiita](https://qiita.com/zwirky/items/adbf22abad7d7822456b)
- [新規tmuxセッション起動時に自動で複数のウィンドウを作成してペイン分割する - 完熟トマト](http://kanjuku-tomato.blogspot.com/2014/03/tmux.html)
- [tmuxでマウス操作を便利に！ tmux.confファイルを作って設定をカスタマイズする。 | Full Stack Enginear](https://gp-standard.com/tmux%E3%81%A7%E3%83%9E%E3%82%A6%E3%82%B9%E6%93%8D%E4%BD%9C%E3%82%92%E4%BE%BF%E5%88%A9%E3%81%AB%EF%BC%81-tmux-conf%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E3%82%92%E4%BD%9C%E3%81%A3%E3%81%A6%E8%A8%AD/)
- [僕の考えた最強のtmux.conf - Qiita](https://qiita.com/mikene_koko/items/2867a6fe2eb73db6562e)

---

追伸: 10月に何も書いてないのもしゃくなのでギリギリに投稿。最近は卒業研究を進めている。
