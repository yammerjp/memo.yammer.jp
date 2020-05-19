---
title: 非同期のまえに同期処理を通してPromiseとasync/awaitを理解する
date: 2020-05-19T04:36:00+09:00
keywords:
 - Javascript
 - Promise
 - async/await
 - callback
 - 非同期
---

JavaScriptといえば非同期処理はつきものだが非同期やPromiseと聞いて「うわ、」と思う人も多いのではないだろうか。

一度理解してしまえばそれほどでもないのだが、最初の理解のハードルは結構高いと思う。私も理解できずに悶絶した。C言語のポインタよりむずくないか？。。。

この記事では、一旦非同期のことは忘れ、まずは同期処理をテーマにcallback, Promise, async/awaitを説明する。
非同期処理は記事の後半まで登場しない。Promiseとかよくわからないなぁという方や、一度挫折した方などにぜひ読んでもらいたい。

## 対象読者

- JavaScriptの基本的文法を知っている。(調べればわかる)

JavaScriptを1行も読んだことも書いたこともない人、プログラミングをしたことのない人は対象としない。
逆に少しでも読み書きできればオーケー、のつもり。

## 目指すところ

- 同期処理と非同期処理の違いがわかる
- callback, Promise, async/awaitのことがわかる(((((
- (非同期処理を対象とした)他のPromise,async/awaitの記事を読んで理解が進む

## Step0-1 MDN

非同期処理もCallbackもPromiseもasync/awaitも関係ないが、まずMDNについて説明しておきたい。

JavaScriptでわからないことがあれば、まずは都度[MDN web docs](https://developer.mozilla.org/ja/docs/Web/JavaScript)をみるとよい。

適当に検索して出てくる記事よりも、とりあえずここで確認しよう。(本記事も適当ねkん策して出てくる記事に該当するという矛盾がはらむ)
一度理解して忘れていた記法などを確認するのにもとてもよい。

## Step0-2 JavaScriptを実行する

以下JavaScirptの説明をするので、実際に動かしたくなる人もいるだろう。

PCにnode.jsが既にインストールされている人はそちらを使うのもよい。

しかし、インストールされていない人は、いちいちHTMLファイルを書いて、JavaScriptを読み込んで、、、とするのは面倒だろう。

もっと気軽にJavaScriptを試せる方法がある。

Chrome dev toolを紹介する。起動方法も含め。スクリーンショットもつける


## Step0-3 アロー関数

ES6 (ES2015)以降の最近のJavaScriptでは、アロー関数という記法がある。
アロー関数がわからない人も、この記事出てくるので簡単に抑えておきたい。

```js
// 従来の書き方
function sum ( a, b ) {
  return a + b;
}

// アロー関数
const sum2 = ( a, b ) => {
  return a + b;
};

// アロー関数 関数の中がreturn文だけのときは、{return}を省略できる
const sum3 = ( a, b ) => a + b;

// アロー関数 引数が1つのときだけ()が省略できる (0つ、2つ以上はダメ)
const twice = a => a*2
```

thisがbindされるかだとか細かい違いは一旦忘れる。上のように書けるということだけわかればよい。

## Step1 callback 同期関数

## Step2 Promise 同期関数

## Step3 async/await 同期関数

## Step4 同期と非同期

## Step5 非同期でcallback

## Step6 非同期でPromise

## Step7 非同期でasync/await

## (発展) Step8 mapとPromise.all()

Callback, Promise, async/await, 非同期処理などはハードルが結構たかい


// step1 arrow関数を理解する



// step2 Promiseを理解する

// step2-1 Promiseの状態はpending,resolve,rejectであることを理解する (同期)

// step2-2 thenとcatchのpromiseチェーンを理解する (同期)

// step 2-3 ついでにasync/awaitもやってみる (同期)

// step3 非同期関数を理解する

// step3-1 コールバックで非同期関数を実行してみる

// step3-2 promiseで非同期関数を実行してみる

// step3-3 async awaitで非同期関数を実行してみる


console.log(new Promise( (resolve,reject) => {} ) )
console.log(new Promise( (resolve,reject) => {} ) )
