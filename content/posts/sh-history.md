---
title: "shellでhistoryを使う"
date: 2020-03-26T00:13:29+09:00
keywords:
 - zsh
 - shell
---

## 過去に実行したコマンドを再度実行する

history ... unix系OSでshellに存在する組み込みコマンドだ。

過去に実行したコマンドを表示できる。

historyコマンドで表示されたコマンドの番号を!と合わせて入力すると、そのコマンドを実行できる。

```sh
$ history
  1  ls
  2  pwd
  3  cd /etc
$ !1
ls
hogedir/    fugafile
```

以下のようにして全履歴を表示できる。

出力した後はgrepで煮るなり焼くなりするのが良いかと。

```sh
$ history -E 1
# 履歴を全て表示する
```

## .zshrcでの設定

`.zshrc`でhistoryに関する設定をしておく

```.zshrc
HISTSIZE=50000 # メモリに保存するコマンド数
HISTFILE=~/.zsh_history
SAVEHIST=100000 # ヒストリファイルに保存するコマンド数

alias history="history -i"
function history-all { history -E 1 }

# 重複するコマンド行は古い方を削除
setopt hist_ignore_all_dups
# 直前と同じコマンドラインはヒストリに追加しない
setopt hist_ignore_dups
# コマンド履歴ファイルを共有する
setopt share_history
# 履歴を追加 (毎回 .zsh_history を作るのではなく)
setopt append_history
# 履歴をインクリメンタルに追加
setopt inc_append_history
# ヒストリを呼び出してから実行する間に一旦編集可能
setopt hist_verify
# 余分な空白は詰めて記録
setopt hist_reduce_blanks
# historyコマンドは履歴に登録しない
setopt hist_no_store
```
