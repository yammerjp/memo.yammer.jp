---
title: "macOS で ssh接続のパスフレーズ入力を2回目以降省略する"
date: 2020-12-01T21:32:03+09:00
---

macOS Catalina にて、ssh接続のパスフレーズ入力を2回目以降省略するには、 `~/.ssh/config` の先頭に次を記述する。

```sh
Host *
  AddKeysToAgent yes
  UseKeychain yes
  IdentityFile ~/.ssh/id_rsa
```

ssh接続時に使用した鍵が ssh-agent に自動的に登録される。
また、パスフレーズの入力を行うと、Keychain にパスフレーズがキャッシュされ、2回目以降は聞かれなくなる

ちなみに macOS では ssh-agent の起動は ssh-add するタイミングに自動的に立ち上がるので、自分で起動しなくて良い。

---

参考: [Mac OS X以降のssh-agent事情 - Qiita](https://qiita.com/yuki153/items/0ad5cb02faf3ecdcf903)

