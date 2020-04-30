---
title: "(余談) User Defaultsとproperty list(plist)"
date: 2020-05-01T00:41:32+09:00
draft: true
---

Mac OS XのUser Defaultsを変更するためのシェルスクリプトを作るツール [pdef](https://github.com/basd4g/pdef)を制作した。(解説記事: [Macの設定を自動化するdefaultsコマンドと、それを助けるpdef](https://memo.basd4g.net/posts/pdef/))

これを作る際に、主にProperty listについて多くのことを学んだので備忘録として記す。

## User Defaults

## Property list

### 構造

- Key
- Value

### 保存形式

- old-style ascii
- xml
- binary
- binary(旧)

### ツール

- pl
- plutil
- defaults
- /usr/libexec/PlistBuddy

## ツールの使い方

## Swiftで読み込む




