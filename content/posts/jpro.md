---
title: "jpro: JavaScriptで書くJSON processor"
date: "2022-12-02T09:18:00+09:00"
tags: [ "JSON", "JavaScript", "CLI", "Shell" ]
---

みなさんは、JSON processorを使っていますか？ええ、[`jq`](https://github.com/stedolan/jq)のようなツールのことです。世は大JSON時代、値を抽出したり、変換したりする機会も多いことでしょう。

ところで、`jq`の抽出クエリやコマンドラインオプション、さらっと書けますか？私はあんまり得意じゃないです。そこで、[JavaScriptで書けるJSON processor「`jpro`」](https://github.com/yammerjp/jpro) をつくりました。

## 使ってみる

実際に使ってみましょう。Node.jsとnpmが使える環境ならば、事前のインストールなしに、「`npx jpro`」で実行できます[^npx]。以下では、私が最近書いた記事のタイトル5つを、[JSON Feed](https://rsss.yammer.jp/v0/json_feed)から抽出しています。

[^npx]: 「[`npm install -g jpro`](https://www.npmjs.com/package/jpro)」を実行し、システムにインストールすることもできます。このほうが、コマンドの起動が速いようです。

![jproを使って、著者の、最近の記事5つを抽出する](https://blob.yammer.jp/jpro-feed-titles.gif)

## 抽出クエリはJavaScriptで書く

記事タイトルの「JavaSciriptで書く」とは、JSONの抽出・変換クエリをJavaScriptで書けることを指しています。`jpro`の引数に指定する抽出クエリは、次のようなJavaScriptコード片です。

```JavaScript
.items.slice(0,5).map(p=>p.title)
```

与えたコード片は、暗黙に、「`output = input`」に続くものとして解釈されます。
つまり、次のようなコードとして実行されます。

```JavaScript
output = input.items.slice(0,5).map(p=>p.title)
```

ここで出てくる変数`input`は、標準入力のJSONをパースしたJavaScript Objectです。変数`output`は、標準出力されるJSONのもとになるJavaScript Objectです。
[`slice`](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/slice)と[`map`](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/map)はそれぞれ配列のメソッド、`p=>p.title`は[アロー関数](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Functions/Arrow_functions)です。

JavaScriptの文法をそのまま使って「標準入力のうち、itemsキーの値である配列のうち、はじめから5つを取り出し、さらに、titleというキーのみを抽出する」ということが書けます。

## JSON以外の入出力もできる

さらに、先ほどのコード片には出てこなかった`stdin`や`stdout`という変数を用いると、JSON以外の入出力も行えます。たとえば以下の例では、JSONではなく、行ごとの文字列を出力しています。

```
$ curl -s https://rsss.yammer.jp/v0/json_feed \
  | npx jpro ';stdout=input.items.slice(0,5).map(p=>p.title).join("\n")'
Asahi Linuxを使う
Fitbit Charge 5を買った
Python実践機械学習システム100本ノックの準備
印象に残った仕事の話をきく話
HerokuからCloud Run + Litestreamへ移行した
```

`jpro`のクエリで使える、用意された変数は以下のとおりです。

| 変数 | 役割 |
| --- | --- |
| `input` | 標準入力のJSONをパースしたJavaScript Object |
| `output` | 標準出力のJSONに変換されるJavaScript Object |
| `stdin` | JSONとしてパースする前の標準入力|
| `stdout` | 標準出力される文字列 (`null`と`undefined`以外の値が代入されれば、`output`の代わりに、`stdout`の値が標準出力される) |

## おわりに

`jq`はJSONの抽出を主目的にした記法を持ち、`jpro`よりも短いクエリで記述できる場合が多いでしょう。一方、`jpro`はJavaScriptコードをevalするというシンプルなつくり[^implemention]であり、JavaScriptの文法がそのまま使えます。ちょっと凝ったことをするときも、JavaScriptを知っていれば、比較的簡単に書けることと思います。

[^implemention]: [`jpro`の実装](https://github.com/yammerjp/jpro/blob/eb8dea10be51879517ab3bc36a8a2164829e7f2d/index.js)はいたって単純です。コードはいかなるnpm packageにも依存しておらず、たったの62行、しかもその2/3はヘルプメッセージです。やっていることは主に、先ほど示した4つの変数の準備と、クエリのeval、出力だけです。実装よりも、この記事の執筆の方が時間がかかっています。

コマンドラインでJSONを抽出するとき、記法に悩む必要はありません。やりたいことがすぐにできることは、素早さに繋がり、価値になります。`jpro`が、JSON抽出のひとつの選択肢になれば幸いです。

## 🎅 / 🎄 GMOペパボエンジニア Advent Calendar 2022

この記事は、[🎅GMOペパボエンジニア Advent Calendar 2022](https://adventar.org/calendars/7722)の2日目のものでした。今年のペパボエンジニアには🎅(サンタ会場)のほかにも、[🎄(ツリー会場)](https://adventar.org/calendars/7784)があります。

- 昨日: よしこさんの未経験転職したい人へのエッセイ、あつい記事でした
   - [エンジニアの未経験転職を希望する方へ未経験転職した経験から伝えたいこと｜yoshikouki｜note](https://note.com/yoshikouki/n/n81b44928b656) 
- 明日: inoweyさんの「何か書きます」です、楽しみですね！
