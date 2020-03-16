---
title: shell-script
date: 2020-03-16 22:23:27
tags: shell, bash, zsh, linux, osx
---

## Shell Scriptにおける、カレントディレクトリの固定

### 前提

shell script内では、shell scriptを起動する前のカレントディレクトリが引き継がれる。

例えば、次のような`pwd.sh`を実行する。

```pwd.sh
#!/bin/sh
pwd
```

次のように、shell scriptを呼び出す際のカレントディレクトリにより、shell scriptの挙動が変化する。

```sh
$ pwd
/Users/hoge

$ ls -F
pwd.sh*   dir/

$ sh pwd.sh 
/Users/hoge

$ cd dir
$ sh ../pwd.sh
/Users/hoge/dir
```

### 解決策

shell scriptの前方に、2行追加する。

```pwd
#!/bin/sh

# change directory to the shell file's directory
SCRIPT_DIR=`dirname $0`
cd $SCRIPT_DIR

pwd
```

これにより、shell scriptを呼び出す際のカレントディレクトリに関わらず、shell scriptでのカレントディレクトリが、shell scriptが配置されたディレクトリに固定される。

```sh
$ pwd
/Users/hoge

$ ls -F
pwd.sh*   dir/

$ sh pwd.sh 
/Users/hoge

$ cd dir
$ sh ../pwd.sh
/Users/hoge
```

### その他の解決策

shell script内のpathを、`"$HOME"`などの変数を使って絶対パスで記載する。

### まとめ

以下のテンプレートをshell scriptの先頭に追加すると良い。

```sample.sh
#!/bin/sh
SCRIPT_DIR=`dirname $0`
cd $SCRIPT_DIR
```

