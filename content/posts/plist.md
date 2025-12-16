---
title: (余談) User Defaultsとproperty list(plist)
date: 2020-05-02T16:26:00+09:00
tags:
  - macOS
  - plist
---
Mac OS XのUser Defaultsを変更するためのシェルスクリプトを作るツール [pdef](https://github.com/yammerjp/pdef)を制作した。(解説記事: [Macの設定を自動化するdefaultsコマンドと、それを助けるpdef](/posts/pdef/))

これを作る際にProperty listについて学んだことを記す。

## User Defaults

User Defaultsは、MacOSXやiOSにおける各アプリケーションが設定などを保持するためのデータベースである。
User Defaultsは、各アプリケーション(正確にはアプリケーションの持つドメイン)ごとにProperty listとして記録される。
普段は各アプリケーションを通して読み書きされるが、ターミナル上からアクセスできる`$ defaults`コマンドも提供されている。(後述)

## Property list

User Defaultsに使われているproperty list(以下plist)は、Mac OS Xにおいてオブジェクトの永続化におけるファイル形式としてよく用いられている。
例えば、iOSアプリを開発する際に自動生成されてXcode上から見える`info.plist`がその例だ。

plistはNeXTSTEP時代から続く歴史あるフォーマットらしい。時代背景も相まってファイルの保存形式は多数ある(後述)。

### 論理構造

plistはJSON等と同様のキーバリュー形式の論理構造を取る。
キーに一対一対応する値が存在し、値は即値の他に入れ子状にデータを保持できる。

値のとりうる型は次の通り。

- 辞書(dictionary)
- 配列(array)
- 文字列(string)
- 数値(number(integer and float))
- 日付(date)
- バイナリ(binary data)
- 真偽値(Boolean value)

この中でも辞書型と配列型は特殊で、辞書型はキーと値の組を、配列型は値を、子にもつことができる。

JSONに無い型(日付,バイナリ)が存在するので、完全な相互変換は不可。

参考: [Property list - Apple Developper Documentation](https://developer.apple.com/library/archive/documentation/General/Conceptual/DevPedia-CocoaCore/PropertyList.html) (plist関する公式のドキュメント)

### 保存形式

#### old-style ASCII形式

テキストベースで、可読性が高いのがこの形式。NeXT形式とも呼ばれる?。NeXTSTEP時代にできた。
作られた当時、文字列、配列、ディクショナリ、そしてバイナリデータのみを表現できたらしい。
シンプルなフォーマットであるが、型情報がなく、型の判別が難しい。

`$ defaults read`コマンドで出力される形式であり、現在では主にここでみられる。

old-style ASCII形式の例として、あるplistをold-style ASCIIで表した表記を以下に示す。

```text
{
    "boolean-example" = 0;
    fuga =     {
        p0y0p0y0 = 0;
        punipuni = value;
    };
    hoge = helloworld;
    wara =     (
        {length = 8, bytes = 0x0123456789abcdef},
        123,
        "0.5",
        1,
        "2019-09-16 05:45:42 +0000"
    );
}
```

#### XML形式

plistのデータ構造をXML形式で表現した形式。
前述のold-style ASCIIのように欠けた情報がなく、なおかつ人間にも読めるのでplistをこねくり回す際にはお世話になるだろう。

それぞれの型におけるxml上での表記は次の通り

- 辞書: `<dict> <key>keystring</key> [value] (繰り返し) </dict>`
- 配列: `<array> [vaule] (繰り返し) </array>`
- 文字列: `<string>value</string>`
- 数値(整数): `<integer>124234</integer>`
- 数値(浮動小数点数): `<real>0.43</real>`
- 日付: `<date>2019-09-16T05:45:42Z</date>` (ISO8601と思われる)
- バイナリ: `<data> ASNFZ4mrze8= </data>` (base64でエンコード済みの文字列)
- 真偽値: `<true/>`または`<false/>`

XML形式の例として、先程示したplistをXMLで表した表記を以下に示す。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>hoge</key>
  <string>helloworld</string>
  <key>boolean-example</key>
  <false/>
  <key>wara</key>
  <array>
    <data>
    ASNFZ4mrze8=
    </data>
    <integer>123</integer>
    <real>0.5</real>
    <true/>
    <date>2019-09-16T05:45:42Z</date>
  </array>
  <key>fuga</key>
  <dict>
    <key>punipuni</key>
    <string>value</string>
    <key>p0y0p0y0</key>
    <string>0</string>
  </dict>
</dict>
</plist>
```

#### binary形式

テキストベースではなく人間が用意に読めなくした代わりに、ファイルサイズの削減と読み書きを高速化ができる形式。

ここまでで述べたようにplistはバイナリデータも含むことができる。
そのため、大きなバイナリデータを含むplistについては、old-style ASCIIやxmlでの表現は冗長で、ファイルが大きくなる、読み書きが遅くなるなどの問題が生まれる。
これを避けるためにバイナリ形式でデータを書き出すことができる。具体的な形式は未調査。

おそらくあまり出会うことはないが、バイナリ形式には現在使われていない古い別形式もあるらしい。

参考:  Plistの歴史

- [第3回 plist（プロパティリスト）とFoundation【前編】 - ITmedia](https://www.itmedia.co.jp/enterprise/articles/0705/14/news013_2.html)
- [第4回 plist（プロパティリスト）とFoundation【後編】 - ITmedia](https://www.itmedia.co.jp/enterprise/articles/0705/30/news011.html)

### plistを操作できるデフォルトツール

plistを検証、確認、変更するコマンドラインツールが、Mac OS Xにはデフォルトでいくつか入っている。

`defaults`, `pl`, `plutil`, `/usr/libexec/PlistBuddy`を紹介する。

#### defaults

User Defaultsを読み書きするためのツール

代表的な`read`,`write`,`import`,`export`のハマりどころを記す。

- `$ defaults read`

"ほぼ"old-style ASCII形式で、User Defaultsを標準出力に出力する。
old-style ASCIIには型情報を含まないので、型のみを調べる`$ defaults read-type`もある。

**出力は正しい文法のold-style ASCII形式のplistとは限らない。大きなサイズのdata型の値は、一部省略して出力され、この部分は文法規則に反する。**
(これが原因で最初plistを正しく読み込めずに困った)

readの後ろに引数を渡さないとすべてドメインのUser Defaultsを出力する。
1コマンドでまとめて出力できるのは筆者の知る限り`$ defaults read`のみ。

ネストしている深い値を指定して読むことはできない。

- `$ defaults write`

引数にで値を指定して、User Defaultsに書き込める。
型を区別するオプションを指定できる。

data型は`-data`オプションをつけた上で、valueを16進数表記で記述する。

date型は`-date`オプションをつけた上で、valueをISO8601形式で記述する。

ネストしている深い値を指定して書き込むことはできない。

- `$ defaults export`

特定のドメインのUser Defualtsをxml形式またはバイナリ形式で出力する。

ドメインは必ず指定する必要があり、`$ defaults read`のようにすべてのドメインのUser Defaultsを一括して出力することはできない。

- `$ defaults import`

xml形式またはバイナリ形式でUser Defaultsに書き込める。

#### pl

old-style ASCII形式のplistの文法をチェックするツール。

#### plutil

XML,binary形式のplistの文法をチェックするツール。

値の読み書き/削除ができるが、深いネストしている深い値を指定して操作することはできない。

- [コマンドラインでplistを操作（データ追加・編集・削除） - Qiita(@trakwkbys)](https://qiita.com/trakwkbys/items/a94c4d43342e96352bde)

#### /usr/libexec/PlistBuddy

ネストしている深い値を直接指定して読み書き/削除できるスグレモノ。

data型を書き込むときは、文字列がそのままbyte列として読み込まれるらしい。
よって書き込める値が制限される。
ネストが深い場所にあるdata型の値を書き込む際は、xmlファイルに直接base64エンコードした文字列を書き込むなどすると良い。

date型を書き込むときは、`Mon Apr 20 20:52:00 2020 JST`のような形式を渡す。
(PlistBuddyのdata型の値書き込みに関するドキュメントは見つけられなかったが、[darling](https://github.com/darlinghq/darling/blob/master/src/PlistBuddy/PlistBuddy.c)の実装を参考にして実験し見つけた。)

## plistファイルを読み書きする際の、Swiftでの実装

今回作成した[pdef](https://github.com/yammerjp/pdef)において、Swiftでplistを扱う際に肝になった部分を実装を交えて紹介する。

ちなみにPythonでは[plistlib](https://docs.python.org/ja/3/library/plistlib.html)が使えるようだ。

### plistファイル全体をNSDictionaryとして読み込む

plistファイルをSwiftの変数として扱えるように取り込むのは非常に簡単。
下記のサンプルコードのように一行で読み込める。

ファイル形式がold-style ASCIIだろうがxmlだろうがbinaryだろうが、勝手に判断してよしなにしてくれる。
(ただし[ハマりどころ](#defaults)に注意)

```swift
// https://github.com/yammerjp/pdef/blob/516f0215306b6ca206ebad646190ba74bd5d4b17/src/loadFile.swift
// 以上より一部抜粋

import Foundation

guard let plist = NSDictionary(contentsOfFile: path) else {
  ErrorMessage("Failed to load property list '\(path)'")
  exit(1)
}
```

pdefをSwiftで実装したのはplistを扱うのが楽だろうからという目論見だったが、それが一番功を奏したのがこの部分。

### 型を判別する

上記の方法でplistファイルをSwift内の変数として読み込んでも、型はすべてAnyとして扱われてしまう。
これは困るので、値を次のサンプルコードの関数`GetPlistType(value: Any) -> PlistType`に与えることで型を調べられる。
型がわかればキャストできるので、その後Swiftで扱うのが楽になる。

```swift
// https://github.com/yammerjp/pdef/blob/516f0215306b6ca206ebad646190ba74bd5d4b17/src/plist.swift
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

この記事は[Macの設定を自動化するdefaultsコマンドと、それを助けるpdef](/posts/pdef/)(pdefの紹介記事)の余談と補足として作った。
ここまでの内容を実装して作った、User Defaults書き換えを支援するツールである[pdef](https://github.com/yammerjp/pdef)も興味があれば使ってみてほしい。

User DefaultsだけでなくProperty listをSwiftで扱う際に、どこから手をつけてよいかわからない人が概要を掴むのにこの記事が役立てば幸いだ。

---

追記: (2020/10/04) pdefの記事へのリンクを相対リンクに修正
