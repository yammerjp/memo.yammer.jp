---
title: "sudoしたユーザのホームディレクトリが知りたい"
date: "2020-11-03T01:54:49+09:00"
tags: [ "bash", "Shell", "Linux" ]
---

TL;DR ... ホームディレクトリはsudoで実行したかにかかわらず, `getent passwd ${SUDO_USER:-$USER} | cut -d: -f6` で得られる.

## 問題と解決策

bash において, ログインユーザ名やホームディレクトリは環境変数から取得できる.

```sh
$ echo "$USER"
yammerjp
$ echo "$HOME"
/home/yammerjp
```

しかしながら, sudo で実行される場合, これらは root のものとして扱われてしまう.

```sh
$ echo 'echo "$USER"' | sudo bash
root
$ echo 'echo "$HOME"' | sudo bash
/root
```

こうなると, sudo のシェルスクリプトの中で, 実行ユーザの名前やホームディレクトリを知りたいときに困る.

これを解決するには, 環境変数 `$SUDO_USER` を用いればよい.

```sh
$ echo 'echo "$SUDO_USER"' | bash

$ echo 'echo "$SUDO_USER"' | sudo bash
yammerjp
```

さらに特定のユーザ名のホームディレクトリもこれを使って求められる.

```sh
$ cat username.sh
#!/bin/bash
echo ${SUDO_USER:-$USER}
getent passwd ${SUDO_USER:-$USER} | cut -d: -f6

$ bash username.sh
yammerjp
/home/yammerjp
$ sudo bash username.sh
yammerjp
/home/yammerjp
```

## 何故 `getent passwd ${SUDO_USER:-$USER} | cut -d: -f6` で得られるのか

### `${SUDO_USER:-$USER}`

`$SUDO_USER` には, sudo実行時には元のユーザ名が入っており, 非sudo時には空になる.
`${SUDO_USER:-$USER}` を用いると, `$SUDO_USER` の値もしくはこれが空なら `$USER` の値を表す.

### `getent`

`getent passwd` は, システムの認証方法にかかわらず (例えばLDAPを使っていたとしても) ユーザの認証情報 を `/etc/passwd` に記述される形式で取得できる.

`/etc/passwd` の各行は : (コロン) 区切りでユーザ名やホームディレクトリやログインシェルを含むので, 適切に cut してあげると ホームディレクトリが得られる.


## 実験用のシェルスクリプト

```sh
#!/bin/bash

echo -e "\n$ whoami"
whoami

echo -e "\n$ echo \$HOME"
echo $HOME

echo -e "\n$ echo \$USER"
echo $USER

echo -e "\n$ echo \$USERNAME"
echo $USERNAME

echo -e "\n$ getent passwd \$USER | cut -d: -f6"
getent passwd $USER | cut -d: -f6

echo -e "\n$ echo \$SUDO_USER"
echo $SUDO_USER

echo -e "\n$ echo \${SUDO_USER:-\$USER}"
echo ${SUDO_USER:-$USER}

echo -e "\n$ getent passwd \${SUDO_USER:-\$USER} | cut -d: -f6"
getent passwd ${SUDO_USER:-$USER} | cut -d: -f6
```
