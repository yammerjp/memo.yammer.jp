---
title: "非同期のまえに同期処理を通してPromiseとasync/awaitを理解する"
date: "2020-05-19T16:50:47+09:00"
tags: [ "JavaScript", "非同期" ]
---

JavaScript といえば非同期処理はつきものだが、非同期や Promise に苦手意識を持つ人も多いのではないだろうか。

これらの最初の理解のハードルは結構高いと思う。私も理解できずに悶絶した。C言語のポインタよりむずくないか？。。。

この記事の前半では一旦非同期のことは忘れる。
まず記事前半は、同期処理をテーマに、コールバック, Promise, async/await について説明する。
記事の後半は、これらを非同期処理を交えて説明する。

Promise はよくわからないという方や、一度挫折した方などにぜひ読んでもらいたい。

(2020/05/30補足: [Qiita投稿](https://qiita.com/basd4g/items/b1c96de727a53c4b4698)に合わせて全体を修正済み。([旧版](https://github.com/basd4g/memo.basd4g.net/blob/979b5576e05cb97e453b5cd3731e3802a0dc6fca/content/posts/promise.md)))

## 対象読者

- JavaScript の基本的文法を知っている。(調べればわかる)
- 非同期処理, コールバック, Promise, async/awaitに苦手意識がある、よくわからない。

JavaScriptを1行も読んだことも書いたこともない人、プログラミングをしたことのない人は対象としない。
逆に少しでも読み書きできればオーケー、のつもり。

## 目指すところ

- 同期処理と非同期処理の違いがわかる
- (非同期処理を対象とした)他のPromise,async/awaitの解説記事を読んで理解が進む

## Step0 準備

### Step0-1 MDN

非同期処理もコールバックもPromiseもasync/awaitも関係ないが、まずMDNについて説明しておきたい。

JavaScriptでわからないことがあれば、まずは都度[MDN web docs](https://developer.mozilla.org/ja/docs/Web/JavaScript)をみるとよい。

適当に検索して出てくる記事よりも、とりあえずここで確認しよう
(本記事も適当に検索して出てくる記事に該当するという矛盾がはらむ)。
一度理解して忘れていた記法などを確認するのにもとてもよい。

### Step0-2 Chrome Developper Tool

以下JavaScirptの説明をするので、実際に動かしたくなる人もいるだろう。

PCにnode.jsが既にインストールされている人はそちらを使うのもよい。

しかし、インストールされていない人は、いちいちHTMLファイルを書いて、JavaScriptを読み込んで、、、とするのは面倒だろう。

もっと気軽にJavaScriptを試せる方法がある。
Chrome developper Toolである。

ブラウザにGoogle Chromeを使っている人はウィンドウ右上の︙ > その他のツール > デベロッパーツール を開いてみよう。
画面上方の「Console」タブを開いて、文字を入力すると、JavaScriptがエンターキーを押すごとに実行されるはずだ。

### Step0-3 アロー関数

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
const twice = a => a*2;
```

thisがbindされるかだとか他の違いは一旦忘れる。
上のように書けるということだけわかればよい。

さて、前置きが長くなったが準備が整った。

## Step1 同期処理

まずは非同期のことはわすれて、とりあえず読み進めて欲しい。

### Step1-1 コールバック (同期関数)

コールバックとは、関数自体を引数として与え、別の関数に実行してもらうしくみだ。
電話を折り返すことに由来して名付けられた。
由来の通り、関数自体を伝えて「あとで都合が良くなったら実行しておいて」と実行を押し付ける方式。

```js
function callbackFunc() {
  console.log('callback');
}

function callFunc ( func ) {
  func();
}

callFunc( callbackFunc );
```

ふつう、関数callbackFuncを実行するなら`callbackFunc()`のようにするだろう。
しかし上記では括弧をつけず`callbackFunc` を引数として渡している。

括弧をつけないことで、引数として関数自体を渡すだけでその場では実行されない。
後に callFunc 関数の中で、渡された関数 (`callbackFunc`)を実行してもらっている。

この「関数自体を渡す」というのがコールバックの肝である。
コールバックとは(戻り値の)値渡しではなく、関数自体の参照を渡しているという表現もできる。

次のような書き方では全く意味が変わってしまうので注意。

```js
callFunc( callbackFunc() );
```

これでは、callbackFunc 関数を実行し、その戻り値を callFunc 関数に引数として渡すという意味になってしまう。

繰り返しになるが、コールバックは「関数自体を渡して」「あとで実行してもらう」しくみである。

参考: [Callback function(コールバック関数) MDN web docs](https://developer.mozilla.org/ja/docs/Glossary/Callback_function)

#### (補足) コールバックとアロー関数

ちなみに上述のコードはアロー関数を使って次のようにも書ける。
```js
const callbackFunc = () => {
  console.log('callback');
};

function callFunc( func ) {
  func();
}

callFunc( callbackFunc );
```

さらに、一度変数に入れるのをやめると

```js
function callFunc( func ) {
  func();
}

callFunc( () => {
  console.log('callback');
})
```
引数を指定する中で関数を定義してしまうのだ。
このように関数自体を引数で渡すとき(即ちコールバック関数を渡すとき)、アロー関数でシンプルにかける。

### Step1-2 Promise (同期関数)

Promise は英語で「約束する」という意味だ。
名前の通り、あとで値を返すことを約束するような動作をする。(約束を破ることもある。)

#### Promise の状態

Promise には3つの状態がある。

- pending ... 約束している状態(初期状態)
- fulfilled ... 約束を守って値を返した状態
- rejected ... 約束を破った状態

Promise オブジェクトはまず pending で始まり、あとで fulfilled や rejected に状態が変化する。

##### 状態: pending

とりあえず約束してみる。

```js
const promise = new Promise( (resolve, reject) => {
});
// 何もしない関数を、new Promise() に渡している。
console.log( promise );
```

pendingと表示されただろう。

_ここでの変数`promise`は、Promise の状態 pending といえる。_

##### 状態: fulfilled

次は fulfilled の状態を作ってみる。

```js
const promise = new Promise( (resolve, reject) => {
  resolve();
})
console.log( promise );
// 実はresolve,rejectはそれぞれ、渡された(コールバック)関数を引数として受け取っている。
```

Promise resoleved と表示されただろう。これが fulfilled である。

実は状態 fulfilled は値を持つ。

```js
const promise = new Promise( (resolve, reject) => {
  resolve('hello');
})
console.log( promise );
```

_ここでの変数`promise`は、Promiseの状態 fulfilled であり、値`'hello'`を持つといえる。_

##### 状態: rejected

rejected も fulfilled と同様に値を持つ。

```js
const promise = new Promise( (resolve, reject) => {
  reject('hello');
})
console.log( promise );
```

_ここでの変数`promise`は、Promise の状態 rejected であり、値`'hello'`を持つといえる。_

rejected で渡される値(オブジェクト)は Error オブジェクトだったりする。

```js
const promise = new Promise( (resolve, reject) => {
  reject(new Error('error message'));
})
console.log( promise );
```

_ここでの変数`promise`は、Promise の状態 rejected であり、値に Error オブジェクトを持つといえる。_

#### 状態の変化

Promiseでは状態が変化する。
初期状態では pending であるが、のちに fulfilled や rejected になる。

```js
const promise = new Promise( (resolve, reject) => {
  //この行が実行されるタイミングでは、変数promiseは状態pending
  if( true ){
    //この行が実行されるタイミングでも、まだ変数promiseは状態pending
    resolve('resolveされた!');
    //この行が実行されるタイミングでは、変数promiseは状態fulfilledで値'resolveされた!'を持つ
    return;
  }
  // ここから先は実行されない
  reject('rejectされた');
})
```

現在は同期処理を行っているので、fulfill または reject された状態に一瞬で変化してしまい、 pending の状態をみることはできない。

しかし厳密にはもともとは pending で、 `resolve()`を実行すると fulfilled に、 `reject()` を実行すると rejected に、それぞれ状態が移行する。

#### then/catch による Promise チェーン

さて、Promise には3状態あり、変化することがわかった。
変化すると何ができるのか？ それをこの節で説明する。

Promise オブジェクトのメソッドに、then と catch がある。

これらはそれぞれ第一引数に関数をとり、Promise が fulfilled や rejected の状態になると引数関数を実行する。

```js
const promise = new Promise( (resolve, reject) => {
  resolve('hello');
})

promise.then( arg => {
  console.log(arg); // ここではhelloが表示される
  console.log('then is called');
})
```

```js
const promise = new Promise( (resolve, reject) => {
  reject('hello');
})

promise.catch( arg => {
  console.log(arg); // ここではhelloが表示される
  console.log('catch is called');
})
```

このように`.`でつないで then/catch メソッドを呼べば、それらを発火できる。

さらに、then/catch メソッドの戻り値に promise を与えてやれば、更に繋げられる。

```js
const promise = new Promise( (resolve, reject) => {
  resolve('hello');
})

promise
  .then( () => {
    console.log('then is called');
    return Promise.resolve('resolve!');
  })
  .then( arg => {
    return Promise.resolve( arg + '!' );
  })
  .then( arg => {
    console.log(arg); // resolve!! と表示される。
  })

// Promise.resolve('resolve!'); は、
// new Promise( resolve => { resolve('resolve!') }); と同じ。
```

上述の通り、then メソッドの戻り値に Promise を渡すと、更に後ろに`.then()`を繋げられる。
(`.catch()`も繋げられる。)

このように、Promise が解決 (fulfill/reject) されたら`.then()`メソッドが発火し、
`.then()`メソッドがPromiseを返すと、解決されたらさらに後ろの`.then()`メソッドが発火し、、、

このように数珠つなぎに徐々に Promise が渡ることを Promise チェーンと呼ぶ。

<hr/>

ここまでで Promise を学んだ。
コールバックや Promise を使う理由は非同期関数にあるので、読者の皆様にはややこしいことをしているようにしか見えないかもしれない。

本当はこのあたりで非同期関数について説明し Promise のありがたみを理解していただくのもよいのだが、この記事はあくまで「まず同期関数で理解する。」ことが目的であり、非同期関数はもう少し後回しにする。

<hr/>

### Step1-3 async/await (同期関数)

次は sync/await だ。

そのまえに説明すべきことが2つほどあるので補足。

#### 補足: 即時関数

即時関数は定義と同時に実行する関数だ。
関数定義を括弧でくくると即時実行される。

```js
const Hello = () => { console.log('hello') };
Hello();

// 上2行のコードは、次の行のコードと同じ。
( () => { console.log('hello') });

// アロー関数でなくても良い
( function () { console.log('hello') });
```

#### 補足: Async 関数 (asnyc function)

関数定義の前に`async`とつけて定義する。
Asnyc 関数の中でのみ await が使える。

```js
// 例
const arrowFunc = async () => {
  await promise;
}
async function func() {
  await promise;
}
```

<hr/>

#### 改めて async/await (同期関数)

閑話休題。

async/await は Promise を生成する構文と言っていい。
先程の then を書かずともよくなる構文である。

前節の Promise のコードを再掲する。

```js
const promise = new Promise( (resolve, reject) => {
  resolve('hello');
})

promise.then( arg => {
  console.log(arg) // ここではhelloが表示される
  console.log('then is called');
})
```

これを async/await に書き直すと

```js
const promise = new Promise( (resolve, reject) => {
  resolve('hello');
})

(async () => {
  const arg = await promise;
  console.log(arg); // ここではhelloが表示される
  console.log('then is called');
})
```

このようになる。
then が消えたことがわかる。

(即時実行のasync関数を使っている。)

<br/>

もう一つ前節のコードを再掲し async/await に書き換えてみる。

```js
const promise = new Promise( (resolve, reject) => {
  resolve('hello')
})

promise
  .then( () => {
    console.log('then is called')
    return Promise.resolve('resolve!')
  })
  .then( arg => {
    return Promise.resolve( arg + '!' )
  })
  .then( arg => {
    console.log(arg) // resolve!! と表示される。
  })
```

async/await に書き換えると

```js
const promise = new Promise( (resolve, reject) => {
  resolve('hello')
})

( async () => {
  let arg = await promise
  console.log('then is called')
  let arg = await Promise.resolve('resolve!')
  let arg = await Promise.resolve( arg + '!' )
  console.log(arg) // resolve!! と表示される。
})
```

今度は then がなくなったことで短く書けたことが伝わるのではないか。

`await`が現れると、Async 関数内の`await`より後ろの部分が全て`then()`の引数として包まれる、といった見方もできる。

以上のように、async/await は Promise を簡潔に書く構文である。

<br/>

#### 余談: Promiseは必要か?

async/awaitで簡潔にかけるなら、Promiseなんて理解しなくて良いのでは？と思う方もいるだろう。
しかし今の所そうも行かないのだ。

複数のPromiseを同時に待つ処理をasync/awaitで書いてみる。

```js
( async () => {
  await Promise.all( [ promise1, promise2 ])
})
```

うお、Promise出てきた。。。

コードの内容はおいておいて、Promise という単語が出てきたことに注目。
解説は省くが、async/await は Promise を完全には隠しきれていないのだ。

(気になる方はこの記事を読み終えてから[`Promise.all`](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)をみると良いだろう。

<br/>

## Step2 非同期処理

さてさて、ここまで来ればゴールは近い。
この節では今まで苦労して覚えた謎構文 Promise と asnyc/await のありがたみがわかるようになる。

### Step2-1 同期関数と非同期関数

同期関数と非同期関数について説明する。

- 同期関数とは、中の処理が完了するまで待ってから戻り値を返す関数のこと
- 非同期関数とは、中の処理にかかわらず、すぐに戻り値を返してしまう関数のこと

JavaScript の代表的な非同期関数に`setTimeOut()`がある。

次のようなコードで考えてみよう。

```js
setTimeOut( () => {
  console.log('hello');
}, 1000);
console.log('world');
```

JavaScript は、普通は(同期関数は)、上から順番に1行ずつ実行される。

しかし上記のコードを実行すると`world`が表示された後に`hello`が表示される。
これは`setTimeOut()`関数が非同期関数だからだ。

書き方を少し変えてみる。

```js
function Hello() { // 1
  console.log('hello'); // 4
}
setTimeOut( Hello, 1000) // 2
console.log('world') // 3
```

さっきと同じ動作をするコードだ。

コンピュータの気持ちになってみると

1. Hello 関数を定義するよ。Hello 関数は実行されたら`'hello'`と表示するよ。まだ定義だけで実行しないよ。
2. setTimeOut 関数を実行するよ。Hello 関数を 1000ms 後に実行するとを登録するよ。__登録するだけで、すぐに戻り値を返すよ。__
3. `'world'`と表示するよ。

... しばらく (1000ms) 経って ...

4. Hello 関数を実行するよ、`'hello'`と表示するよ。

このような順で動作する。
同期関数はその行で処理が停止するのに対し、非同期関数はすぐに次の行が実行される。

## Step2-2 コールバック (非同期関数)

先程の例で非同期関数を実現してるのがコールバックだ。

あとで実行して欲しい関数を引数で伝えておいて、ときが来たら実行する。

やりたいことはコールバックで実現できるものの、何重にも重なると次のようなコードにになってしまう。

```js
setTimeOut( () => {
  setTimeOut( () => {
    setTimeOut( () => {
      setTimeOut( () => {
        setTimeOut( () => {
          setTimeOut( () => {
            console.log('6s later');
          }, 1000);
        }, 1000);
      }, 1000);
    }, 1000);
  }, 1000);
}, 1000);

console.log('これはすぐに実行される');
```

コールバック関数を呼ぶたびにネストが深くなってしまい読みづらい。

俗に言うコールバック地獄である。
たとえばこの例だと、どの秒数がどの setTimeOut に対応するのかわかりづらい。

(上記の例は全て一つの setTimeOut にまとめられるが)
実際には次のような状況が考えられる。

1. サーバと通信して、記事のリストをとってくる。
2. 記事のリストから該当の記事を探して、再度サーバと通信して本文をとってくる。

このように、複数の非同期処理が数珠つなぎになることもあるだろう。

数珠つなぎ、、、

## Step2-3 Promise (非同期関数)

そう、数珠つなぎならさっきの Promise チェーンと相性が良い。

さっきの6秒待つ処理も

```js
// 事前に Promise 関数を作っておく。
// ライブラリなどで用意されていたりするので、Promise を使う側は作る必要はない。
function setTimeOutPromise(time){
  return new Promise( resolve => {
    setTimeOut( resolve, 1000);
  });
}

setTimeOutPromise(1000)
.then( () => 
  setTimeOutPromise(1000)
).then( () =>
  setTimeOutPromise(1000)
).then( () =>
  setTimeOutPromise(1000)
).then( () =>
  setTimeOutPromise(1000)
).then( () =>
  setTimeOutPromise(1000)
).then( () => {
  console.log('6s later');
})

console.log('これはすぐに実行される');
```

ネストが解消されて、引数もコンパクトになって見やすくなった。

## Step2-4 asnyc/await (非同期関数)

さらに async/awaitで書き直すと

```js
// 事前に Promise 関数を作っておく。
// さっきと同じ。
function setTimeOutPromise(time){
  return new Promise( resolve => {
    setTimeOut( resolve, 1000)
  })
}

( async () => {
  await setTimeOutPromise(1000);
  await setTimeOutPromise(1000);
  await setTimeOutPromise(1000);
  await setTimeOutPromise(1000);
  await setTimeOutPromise(1000);
  await setTimeOutPromise(1000);
  console.log('6s later');
})

console.log('これはすぐに実行される');
```

これは見やすい！
非同期関数を同期的に書けるようになった。

await の行で停止しているかのように動作する。

## さいごに

本記事を読み次の2つを知れば、他の記事が格段に読みやすくなるだろう。

- 同期処理と非同期処理の違い
- 同期処理でPromiseがどういう動作をするか

これからは「コールバック地獄を解決するために Promise チェーンがある」「 async/await は Promise の生成だ」などと書かれた他の記事も読めるのではないだろうか。

この記事を完全に理解できなくても、 読者の皆様はこれから JavaScript の非同期処理を深める土台ができているのではないかと思う。

ここまでの長文に付き合いいただきありがたい。

以上。
