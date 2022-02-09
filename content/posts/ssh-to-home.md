---
title: "リバースSSHトンネルでVPSを介していつでも自宅のPCに繋ぐ"
date: "2022-02-24T22:15:00+09:00"
tags: [ "VPS", "SSH", "自宅サーバ" ]
---

外出先で手元のラップトップ (MacBook Air) からポートを公開していない自宅のサーバ[^1] (Ubuntu) へsshしたいときの記録。
数ヶ月くらい前から安価なVPSを借りて、そこを中継地点として外出先からいつでも自宅のサーバにsshできるようにしている。

### ひとまず繋ぐ

以下の接続ができるようにしておく。

ラップトップの公開鍵を自宅サーバとVPSに、自宅サーバの公開鍵をVPSに登録 (`~/.ssh/authorized_keys` に追記) して、sshできることを確認する。

- 自宅のラップトップ -> 自宅のサーバ
- 自宅のラップトップ -> VPS
- 自宅のサーバ -> VPS

#### `~/.ssh/config` on ラップトップ

中継するVPSとその先の自宅サーバへの接続情報を書いておく。

```
Host home-server
  HostName 192.168.2.3
  IdentityFile ~/.ssh/id_rsa
  User home-username
Host bastion-vps
  HostName bastion-vps.example.com
  IdentityFile ~/.ssh/id_rsa
  User vps-username
Host home-server-remote
  Hostname localhost
  User home-username
  IdentityFile ~/.ssh/id_rsa
  ProxyJump bastion-vps
  Port 2222
```

#### `~/.ssh/config` on 自宅サーバ

中継するVPSへの接続情報を書いておく。

```
Host bastion-vps
  HostName bastion-vps.example.com
  IdentityFile ~/.ssh/id_rsa
  User ubuntu
```

#### 繋いでみる

自宅サーバからVPSへsshして、VPSの空きポートから自宅サーバのsshポートへリバーストンネルを張る。

```bash
# user@home-server
ssh -fN -R 2222:localhost:22 bastion-vps
```

この状態で、自宅サーバと異なるネットワークに所属するラップトップからsshをする。

```bash
# VPSの22番ポート、2222番ポートを伝って自宅サーバへsshする
ssh home-server-remote
```

多段sshの際にラップトップの秘密鍵を使う利点は、自宅サーバに入るための鍵をVPSが保持していないこと。
仮にVPSにログインして自宅サーバのSSHポートにパケットを送れる状態になったとしても、自宅サーバへsshできる秘密鍵を持たなければ自宅サーバは乗っ取れない。

### サービスとして登録する

自宅サーバのsystemdに登録して、常にリバーストンネルが貼られている状態を維持する。

まず、ファイル `/lib/systemd/system/bastion-tunnel.service` に以下を記述する。


```
[Unit]
Description=Create SSH reverse tunnel (reverse port forwarding) from bastion-vps.example.com
After=network.target

[Service]
Type=forking
ExecStart=/usr/bin/ssh -f -NT -o ServerAliveInterval=60 -o ExitOnForwardFailure=yes -i /path/to/id_rsa -R 2222:localhost:22 vps-username@bastion-vps.example.com
RestartSec=3
Restart=always
StartLimitBurst=0

[Install]
WantedBy=multi-user.target
```

作成したServiceを有効化する。

```
sudo systemctl daemon-reload
sudo systemctl enable bastion-tunnel.service
sudo systemctl status bastion-tunnel.service
```

常にリバーストンネルが貼られていることをsshして確認してみる。

## おわりに

以上の手順を踏むと、自宅のIPがわからなくても、ポートを公開していなくても、いつでもVPSを経由してsshできる。
自宅サーバの中で作業をしておけば外に行ってもiPadから作業を続行できたりするし、外で特定のファイルが欲しくなったりx86_64のLinux環境が欲しくなったときにそこそこのスペックのものをサッと使えるのもいい。
ふとしたときに便利。

今はsshのみをトンネリングしているが、他のプロトコルもポートフォワーディングして使うと便利そう。(認可周りは別途検討が必要そう)

[^1]: サーバといってもインターネットに公開・提供しているわけではなく、適当なものをビルドしたり作業したり宅内向けのアプリケーションを一時的にホストしていたりする自分用の常時起動Linuxマシンである。
