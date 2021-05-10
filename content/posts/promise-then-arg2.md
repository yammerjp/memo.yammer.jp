---
title: "Promiseのthenメソッドには第二引数がある"
date: "2020-05-19T15:57:35+09:00"
tags: ["JavaScript", "非同期"]
---

この記事は以下のツイートについて。

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">thenメソッドって第2引数でrejectedなときに実行する関数も指定できるのか、いつもcatchばかり使っていた。</p>&mdash; けーすけ@やんまー (@yammerjp) <a href="https://twitter.com/yammerjp/status/1262637541028585475?ref_src=twsrc%5Etfw">May 19, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>


きっかけは[MDN web docsのPromiseについてのページ](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Promise)を見ていたことに始まる。

以前、私がPromiseとaync/awaitを理解するときにとても役にたった記事があった。
Qiitaにあった記事で同期処理でPromiseをしてみて理解しようと試みる記事だったのだが、いま探しても見つからない。

需要がありそうなので自分で書いているのだが、そんな中でMDNを見ていてthenメソッドに関する発見があった。

```js
const promise = new Promise( (resolve,reject) => {
  setTimeout( () => {
    if( (Date.now()%2) === 0 ){
      resolve()
      return
    }
    reject()
  }, 1000)
})

promise.then(
  () => { console.log('fulfilled')},
  () => { console.log('rejected')}
)
```

あなたの運(実行タイミング)によってfulfilledかrejectedが表示されるコードである。

- thenの第一引数は、promiseオブジェクトがfulfilled状態になったとき(上記コードでいえば`resolve()`が実行されたとき)、実行される関数である。

これは理解していたが次だ。

- thenの第二引数は、promiseオブジェクトがrejected状態になったとき(上記コードでいえば`reject()`が実行されたとき)、に実行される関数である。

これは見落としていた。
いつも`then(A).catch(B)`として拾っていたが、`then( A, B )`として書けるのだな。

書けることと見やすいことは別で、今の私の感情ではcatchと書いたほうが見やすいのでは？と思うのだが、実際のところどうなのだろう。
thenの第二引数がどれだけ使われているのか気になるところである。

<br/>

ところで、promiseの状態について、初期状態をpendingと表現し、それがfulfilledかrejectedに変化するのだが、fulfilledのことをついresolvedと表現したくなってしまう。 

正確にはresolvedというと、fulfilledとrejectedをどちらも指すようで、promiseが成功したときはfulfilledと表現すべきらしい。
(resolvedと同じ意味でsettledという言葉も使われるようだ。)

なるほど区別するのは良いのだが、それならよく
```js
new Promise( (resolve, relect) => {})
```
と書いているのはどうなの。
```js
new Promise( (fulfill, reject) => {})
```
と予め書いてあるほうが混乱を産まないと思うのだが。

<br/>

話がそれたが今日はPromiseのthenメソッド第二引数についてであった。
いつも使っている文でも知らないことが隠れていたりするので、ことあるごとに正しい文献に戻ることを心がけていきたい。
