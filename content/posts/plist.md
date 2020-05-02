---
title: "(余談) User Defaultsとproperty list(plist)"
date: 2020-05-01T00:41:32+09:00
draft: true
---

Mac OS XのUser Defaultsを変更するためのシェルスクリプトを作るツール [pdef](https://github.com/basd4g/pdef)を制作した。(解説記事: [Macの設定を自動化するdefaultsコマンドと、それを助けるpdef](https://memo.basd4g.net/posts/pdef/))

これを作る際にProperty listについて学んだことを記す。

## User Defaults

User Defaultsは、MacOSXやiOSにおける各アプリケーションが設定などを保持するためのデータベースである。

これは、各アプリケーション(正確にはアプリケーションの持つドメイン)ごとにProperty listとして記録される。

普段は各アプリケーション内で読み書きされるが、ターミナル上からアクセスできる`$ defaults`コマンドが提供されている。

## Property list

User Defaultsに使われているproperty list(以下plist)は、Mac OS Xにおいてオブジェクトの永続化におけるファイル形式としてよく用いられているものらしい。

例えば、iOSアプリを開発する際に自動生成されてXcode上から見える`info.plist`がその例だ。

plistはNeXTSTEP時代から続く歴史あるフォーマットらしい。時代背景も相まってファイルの保存形式は多数ある(後術)。

参考

- [Property list - Apple Developper Documentation](https://developer.apple.com/library/archive/documentation/General/Conceptual/DevPedia-CocoaCore/PropertyList.html)(plist関する公式のドキュメント)
- [Property list Programming Guide - Apple Developper Documentation](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/PropertyLists/Introduction/Introduction.html#//apple_ref/doc/uid/10000048-CJBGDEGD)(plistをアプリケーションで扱う方法)
- [第3回 plist（プロパティリスト）とFoundation【前編】 - ITmedia](https://www.itmedia.co.jp/enterprise/articles/0705/14/news013_2.html)(plistの歴史について書かれている)
- [第4回 plist（プロパティリスト）とFoundation【後編】 - ITmedia](https://www.itmedia.co.jp/enterprise/articles/0705/30/news011.html)(plistの歴史について書かれている)

### 構造

plistはキーバリュー形式の論理構造を取る。Jsonなんかに近い。
キーに一対一対応する値が存在し、値は即値の他に入れ子上にデータを保持できる。

値のとりうる型は次の通り。

- 辞書型(dictionary)
- 配列(array)
- 文字列(string)
- 数値(number(integer and float))
- 日付(date)
- バイナリ(binary data)
- 真偽値(Boolean value)

この中でも辞書型と配列は特殊で、辞書型はキーと値の組を、配列は値を、子にもつことができる。

さきほどJSONに近いといったが、JSONに無い型(日付,バイナリ)が存在するので、完全な相互変換は不可。

### 保存形式

- old-style ascii
- xml
- binary
- binary(旧)

例としてプロパティリストをそれぞれの形式で表記したものを記す

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>defaults.sh-0-ascii</key>
  <string>helloworld</string>
  <array>
    <data>
    ASNFZ4mrze8=
    </data>
    <integer>123</integer>
    <real>0.5</real>
    <true/>
    <date>2019-09-16T05:45:42Z</date>
	</array>
	<key>defaults.sh-7-array</key>
  <dict>
    <key>key0</key>
    <string>value</string>
    <key>key1</key>
    <string>0</string>
  </dict>
</dict>
</plist>
```

```txt
```


### ツール

#### defaults

User Defaultsを読み書きするためのツール

`defaults read`コマンドを使うと、大きな辞書型のplistが一つ存在し、この辞書のKeyは各アプリケーションのドメイン、Valueは各アプリケーションのUserDefaultsを表すPlist(辞書型ないし配列)となっている。


#### pl
#### plutil
#### /usr/libexec/PlistBuddy
#### 

## Swiftでの実装

今回作成した[pdef](https://github.com/basd4g/pdef)において、Swiftでplistを扱う際に肝になった部分を実装を交えて紹介する。

### plistファイル全体をNSDictionaryとして読み込む

plistファイルをSwiftの変数として扱えるように取り込むのは非常に簡単。
下記のサンプルコードのように一行で読み込める。

```swift
// https://github.com/basd4g/pdef/blob/516f0215306b6ca206ebad646190ba74bd5d4b17/src/loadFile.swift
// 以上より一部抜粋

import Foundation

guard let plist = NSDictionary(contentsOfFile: path) else {
  ErrorMessage("Failed to load property list '\(path)'")
  exit(1)
}
```

pdefをSwiftで実装したのは、plistを扱うのが楽だからだろうという目論見だったが、それが一番功を奏したのがこの部分。

### 型を判別する

上記の方法でplistファイルをSwift内の変数として読み込んでも、型はすべてAnyとして扱われてしまう。
これは困るので、値を次のサンプルコードの関数`GetPlistType(value: Any) -> PlistType`に与えることで型を調べられる。
型がわかればキャストできるので、その後Swiftで扱うのが楽になる。

```swift
// https://github.com/basd4g/pdef/blob/516f0215306b6ca206ebad646190ba74bd5d4b17/src/plist.swift
// 以上より一部抜粋、書き換え

import Foundation

enum PlistType: Int {
  case string
  case real
  case integer
  case bool
  case data
  case date
  case array
  case dict
}

func GetPlistType(value: Any) -> PlistType {
  let typeID = CFGetTypeID(value as CFTypeRef?)
  switch typeID {
  case CFNumberGetTypeID():
    if value is NSInteger {
      return .integer
    }
    return .real
  case CFArrayGetTypeID():
    return .array
  case CFDictionaryGetTypeID():
    return .dict
  case CFStringGetTypeID():
    return .string
  case CFDataGetTypeID():
    return .data
  case CFDateGetTypeID():
    return .date
  case CFBooleanGetTypeID():
    return .bool
  default:
    exit(1)
  }
}
```

参考:

- [CFTypeID - Apple Developper Documantation](https://developer.apple.com/documentation/corefoundation/cftypeid)(Property listの型をSwiftで判別する)
- [Swift.Any as? CFType - Qiita(@junpluse)](https://qiita.com/junpluse/items/e334e511457f8c133de9)(Property listの型をSwiftで判別する)
- [Inspecting Objects - Apple Developper Docuumentation](https://developer.apple.com/library/archive/documentation/CoreFoundation/Conceptual/CFDesignConcepts/Articles/Inspecting.html)(Property listの型をSwiftで判別する)

## おわりに

Swiftでplistを扱うための情報を集めるのに時間がかかったので、まとめる記事を書くに至った。

この記事に書かれた内容を実装して作った、User Defaults書き換えを支援するツールである[pdef](https://github.com/basd4g/pdef)も興味があれば使ってみてほしい。

この記事は[Macの設定を自動化するdefaultsコマンドと、それを助けるpdef](#)(pdefの紹介記事)の余談と補足として作った。
というわけでpdefに関して2記事も書いたわけである。

User DefaultsだけでなくProperty listをSwiftで扱う際に、どこから手をつけてよいかわからない人が概要を掴むのにこの記事が役立てば幸いだ。

