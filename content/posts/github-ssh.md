---
title: "GitHubにsshでつなぐ"
date: 2020-08-14T18:55:39+09:00
tags: [ "git", "ssh", "Shell" ]
---

以下、過去の自分用メモの移動。

WindowsやMacでは、GitHubのIDとパスワードを安全に記憶して、HTTPS通信で勝手に使ってくれるのだが、Ubuntuではどうもよい方法がなさそうだった。

そこでHTTPSではなくSSHを使ってgithubと通信するようにして、公開鍵認証により安全を担保しようというわけだ。

## 鍵ペアを作る

```sh
$ cd ~/.ssh
$ ssh-keygen -t rsa -b 4096 -C "mymail@example.com"
# 鍵の名前を id_rsa_github とする
# パスワードも聞かれるので入力

$ ls -1 
id_rsa_github # 秘密鍵
id_rsa_github.pub # 公開鍵

# 作成時に既に正しく設定されていた Ubuntu20.04LTS
# $ chmod 600 id_rsa_github
```

## GitHubに登録

GitHub > Settings > SSH Keys > Add SSH key から公開鍵を登録する

Title : PC名等
Key: 公開鍵をコピペ

Add keyを押し、その後パスワードも入力

## ローカルマシン上で設定

`~/.ssh/config`に以下を追記

```~/.ssh/config
Host github
  HostName github.com
  IdentityFile ~/.ssh/id_rsa_github
  User git
```

```sh
# ssh-agentが動作しているか確認
eval "${ssh-agent -s}"
Agent pid 32047

$ ssh-add ~/.ssh/id_rsa_github
# パスワードを入力

# 接続確認
$ ssh -T git@github.com
```

