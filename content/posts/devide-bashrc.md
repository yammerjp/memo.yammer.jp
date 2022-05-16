---
title: "秘匿情報を含む.bashrcを分割する"
date: "2022-04-11T04:52:00+09:00"
tags: [ "dotfiles", "bash" ]
---

dotfiles(ドットで始まる設定ファイル)の管理のために、Gitリポジトリを作成しGitHubにdotfilesという名前で公開するときに注意すべきこととして秘匿情報の扱いが挙げられます。

秘匿情報が `.bashrc` に含まれているとき、それをそのままGit管理してGitHubに公開することには問題があります。
ここでいう秘匿情報とはGitHubのパーソナルアクセストークンやAWSのアクセス用シークレットキーなどの認証時のパスワードの代替となるようなものをはじめとする、他の人に見せてはいけない情報のことです。

こういった内容を含む`.bashrc`は分割し、秘匿情報の含まない部分のみGit管理下に置くのがよいでしょう。

今回は以下のような`~/.bashrc`があったとき、秘匿情報の含む部分と含まない部分に分割する手法を紹介します。

```bash
# ~/.bashrc

# 秘匿情報
GITHUB_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# 秘匿情報以外の記述
alias his="cat $HISTFILE | grep"
```

このファイルを秘匿情報の含む`~/.bashrc.local`と秘匿情報の含まない`~/.bashrc`に分割します。
さらに、秘匿情報の含まない`~/.bashrc`は、秘匿情報の含む`~/.bashrc.local`を内部で読み込むようにします。

```bash
# ~/.bashrc-private

# 秘匿情報
GITHUB_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

```bash
# ~/.bashrc

# 秘匿情報を読み込む
source ~/.bashrc.local

# 秘匿情報以外の記述
alias his="cat $HISTFILE | grep"
```

`source`はBashの組み込みコマンドのひとつで、指定したファイルを読み込みカレントシェルで実行します。
この例で言えば、`source`コマンドが書かれている部分に`~/.bashrc.local`の内容が書かれているのと同じ動きになります。

こうすることで、`~/.bashrc`はGitリポジトリに含めて公開しても問題ない状態になりました。
`source ~/.bashrc.local` という記述から何らかの情報を読み込んでいることはわかりますが、その中身が何であるかは`.bashrc`を読んでもわかりません。

この記事に従って秘匿情報を分割した場合、以降`~/.bashrc.local` は公開せずに手元の環境に留めておくようにしてください。

なお、今回のような`.bashrc`の分割は秘匿情報に限らず他のことにも応用できます。
特定のOSのみ指定したファイルを読み込むようなif文を記載すれば、設定をOSによって切り替えることも可能です。
