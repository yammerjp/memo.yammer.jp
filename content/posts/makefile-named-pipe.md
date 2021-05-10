---
title: "Makefileの中で名前付きパイプ(bash記法)を使いたかった。2つのコマンド実行結果を比較する。"
date: "2020-09-17T16:31:46+09:00"
tags: [ "Shell" ]
---

今日は小さな Tips。

make は1970年代に生まれ、C言語のビルドなどでよく用いられるビルドツールだ。
Makefileにビルド手順を記述しておき `$make` で一連の流れを実行できる。

古からあるビルドツールであるから、インデントがタブ文字でないといけないなどの制約があるが、環境に依存しづらいので最近はよく使うようにしている。

Makefile にはシェルスクリプトのように実行するコマンドを記述するが、この中ではbash独自の拡張記法には対応していない。(Makefile独自の記法があったりする)

2つのコマンドの実行結果を比較したい時、bashでは次のように名前付きパイプを使うと簡単に記述できる。

```sh
$ diff <(echo 'hoge') <(echo 'fuga')
```

これは独自の記法でありMakefileの中では使えない。

そこで、名前付きパイプを避けて明示的にファイルディスクリプタを利用することで解決できる。

```sh
$ echo 'hoge' | (echo 'fuga' | diff /dev/fd/3 -) 3<&0
```

まず、`$ehco 'hoge'`の実行結果を標準出力ではなくファイルディスクリプタ3に流し込む。
そして、これ(/dev/fd/3)と`$echo 'fuga'`の実行結果の標準出力をdiffで比較している。

## 参考

- [コマンド実行結果のdiff を取るといろいろ捗る - by and for engineers](https://yulii.github.io/diff-command-tips-20150627.html)
- [make - Wikipedia](https://ja.wikipedia.org/wiki/Make)

---

p.s. 本「[ふつうのLinuxプログラミング](https://www.amazon.co.jp/dp/B075ST51Y5/ref=dp-kindle-redirect?_encoding=UTF8&btkr=1)」を参考に [cat コマンドを作っていて](https://github.com/yammerjp/cat)、簡単なテストスクリプトをMakefileに書きたいと思ったところから、このスニペットを必要とした。

