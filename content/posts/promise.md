---
title: "非同期のまえに同期処理を通してPromiseとasync/awaitを理解する"
date: 2020-05-19T16:50:47+09:00
keywords:
 - Javascript
 - Promise
 - async/await
 - callback
 - 非同期
---

JavaScriptといえば非同期処理はつきものだが非同期やPromiseと聞いて「うわ、」と思う人も多いのではないだろうか。

一度理解してしまえばそれほどでもないのだが、最初の理解のハードルは結構高いと思う。私も理解できずに悶絶した。C言語のポインタよりむずくないか？。。。

この記事では一旦非同期のことは忘れまずは同期処理をテーマに、コールバック、Promise、async/awaitを説明する。
非同期処理は記事の後半まで登場しない。Promiseはよくわからないという方や、一度挫折した方などにぜひ読んでもらいたい。

## 対象読者

- JavaScriptの基本的文法を知っている。(調べればわかる)

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

まずはコールバックについて。

コールバックとは、関数自体を引数として与え、別の関数に実行してもらうしくみだ。
電話を折り返すことに由来するようだがまさにそのとおり、関数自体を教えて「あとで都合が良くなったら実行しておいて」と押し付ける方式。

```js
function callbackFunc() {
  console.log('callback');
}

function callFunc ( func ) {
  func();
}

callFunc( callbackFunc );
```

ふつう、関数callbackFuncを実行するなら、`callbackFunc()`のようにするだろう。
しかしここでは引数に渡すときは括弧をつけず、`callFunc( callbackFunc )` としている。

これは引数では関数自体を渡すだけで、callbackFuncは実行されない。
そして、callFuncの中で渡された関数を実行してもらっている。

この「関数自体を渡す」というのがコールバックの肝である。
コールバックとは(戻り値の)値渡しではなく、関数自体の参照を渡しているという表現もできる。

次のような書き方では全く意味が変わってしまうので注意。

```js
callFunc( callbackFunc() );
```

これでは、callbackFuncを実行して、その戻り値をcallFuncに渡すという意味になってしまう。

繰り返しになるが、コールバックは「関数自体を渡して」「あとで実行してもらう」しくみである。

なんでこんな面倒なことをするかといえば非同期処理が関わってくるが、これはあとで説明する。

参考: [Callback function(コールバック関数) MDN web docs](https://developer.mozilla.org/ja/docs/Glossary/Callback_function)

#### (補足) アロー関数とコールバック

ちなみに、この節の冒頭のコードだが、アロー関数を使ってこのようにも書ける

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

こうなる。引数を指定する中で関数を定義してしまうのだ。
このように関数自体を引数で渡すとき(すなわちコールバック関数をわたすとき)、アロー関数はシンプルにかける。

### Step1-2 Promise (同期関数)

さて、コールバックを説明したら次はPromise。

promiseは英語で「約束する」という意味だ。
その名の通り、あとで値を返すことを約束するような動作をする。(約束を破ることもある。)

#### Promiseの状態

Promiseには3つの状態がある。

- pending ... 約束している状態(初期状態)
- fulfilled ... 約束を守って値を返した状態
- rejected ... 約束を破った状態

Promiseオブジェクトはまずpendingで始まり、あとでfulfilledやrejectedに状態が変化する。

##### pending

とりあえず約束してみる。

```js
const promise = new Promise( (resolve, reject) => {
});
console.log( promise );
// 早速コールバックが出てきてしまった。
// ここでは第一引数resolveと第二引数rejectを受け取り何もしない関数を、new Promise()に渡している。
```

pendingと表示されただろう。

_ここでの変数`promise`は、Promiseの状態pendingといえる。_

##### fulfilled

次はfulfilledの状態を作ってみる。

```js
const promise = new Promise( (resolve, reject) => {
  resolve();
})
console.log( promise );
// 実はresolve,rejectはそれぞれ、渡された(コールバック)関数を引数として受け取っている。
```

Promise resolevedと表示されただろう。これがfulfilledである。

実はfulfilledな状態は値を持つ。

```js
const promise = new Promise( (resolve, reject) => {
  resolve('hello');
})
console.log( promise );
```

_ここでの変数`promise`は、Promiseの状態fulfilledであり、値`'hello'`を持つといえる。_

##### rejected

rejectedもfulfilledと同様に値を持つ。

```js
const promise = new Promise( (resolve, reject) => {
  reject('hello');
})
console.log( promise );
```

_ここでの変数`promise`は、Promiseの状態rejectedであり、値`'hello'`を持つといえる。_

rejectedで渡される値(オブジェクト)は、Errorオブジェクトだったりする。

```js
const promise = new Promise( (resolve, reject) => {
  reject(new Error('error message'));
})
console.log( promise );
```

_ここでの変数`promise`は、Promiseの状態rejectedであり、値にErrorオブジェクトを持つといえる。_

#### 状態の変化

さてさて、Promiseに3つの状態があるのは説明したとおりだ。

Promiseでは状態が変化する。
初期状態ではpendingであるが、のちにfulfilledかrejectedになる。

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

現在は同期処理を行っているので、fulfilledまたはrejectされた状態に一瞬で変化してしまい見れない。

しかし厳密にはもともとはpendingで、第一引数resolveを実行するとfulfilledに、第二引数rejectを実行するとrejectに、それぞれ状態が移行する。

#### then/catchによるPromiseチェーン

さて、Promiseには3状態あり、変化することがわかった。
変化すると何ができるのか？
それをこの節で説明する。

Promiseオブジェクトのメソッドに、thenとcatchがある。

これらはそれぞれ第一引数に関数をとり、promiseがfulfilledやrejectedの状態になると関数を実行する。

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

このようにして、`.`でつないでthen/catchメソッドを呼べば、それらを発火できる。

さらに、then/catchメソッドの戻り値にpromiseを与えてやれば、更に繋げられる。

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


ソースコードのように、thenメソッドの戻り値にPromiseを渡すと、更に後ろに`.then()`を繋げられる。
(`.catch()`も繋げられる)

このように、Promiseが解決(fulfill/reject)されたら`.then()`メソッドが発火し、
`.then()`メソッドがPromiseを返すと、解決されたらさらに後ろの`.then()`メソッドが発火し、、、

このように数珠つなぎに徐々にPromiseが渡っていくことをPromiseチェーンと呼ぶ。

#### 即時にfulfill、rejectする

先程出てきたが、すぐにfulfill/rejectを返すPromiseは、次のように書ける。

```js
// 次の二行は同じ。
Promise.resolve('resolve!');
new Promise( resolve => { resolve('resolve!') });

// 次の二行は同じ。
Promise.reject('reject..');
new Promise( (resolve, reject) => { reject('reject..') });
```

<hr/>

さてここまででPromiseを学んだ。
なんでわざわざcallbackやPromiseなんてものを使うのか、その理由は非同期関数にあるので、読者の皆様にはややこしいことをしているようにしか見えないかもしれない。

本当はこのあたりで非同期関数について説明しPromiseのありがたみを理解していただくのもよいのだが、この記事はあくまで「まず同期関数で理解する。」ことが目的なので、非同期関数はもう少し後回しにする。

<hr/>

### Step1-3 async/await (同期関数)

次はsync/awaitだ。

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

#### 補足: async関数 (asnyc function)

関数定義の前にasyncとつけて定義する。
asnyc関数の中でのみawaitが使える。

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

async/awaitはPromiseを生成する構文と言っていい。
先程のthenを書かずともよくなる構文である。

先程のPromiseのコードをもう一度示す。

```js
const promise = new Promise( (resolve, reject) => {
  resolve('hello');
})

promise.then( arg => {
  console.log(arg) // ここではhelloが表示される
  console.log('then is called');
})
```

これをasync/awaitに書き直すと

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
thenが消えたことがわかる。

(即時実行のasync関数を使っている。)

<br/>

もう一つ先程のコードを再掲しasync/awaitに書き換えてみる。

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

async/awaitに書き換えると

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

今度はthenがなくなったことで短く書けたことが伝わるのではないか。

awaitが現れると、async関数内のawaitより後ろの部分がまるまるthen()の引数としてくるまれる、といった見方もできる。

以上のように、async/awaitはPromiseを簡潔に書く構文である。

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

コードの内容はおいておいて、Promiseという単語が出てきたことに注目。
解説は省くが、async/awaitはPromiseを完全には隠しきれていないのだ。

(気になる方はこの記事を読み終えてから[`Promise.all`](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)をみると良いだろう。

<br/>

## Step2 非同期処理

さてさて、ここまで来ればゴールは近い。
ここからは今まで苦労して覚えた謎構文Promiseとasnyc/awaitのありがたみがわかる章になる。

### Step2-1 同期関数と非同期関数

同期関数と非同期関数について説明する。

- 同期関数とは、中の処理が完了するまで待ってから戻り値を返す関数のこと
- 非同期関数とは、中の処理にかかわらず、戻り地を返してしまう関数のこと

JavaScriptの代表的な非同期関数に`setTimeOut()`がある。

次のようなコードで考えてみよう。

```js
setTimeOut( () => {
  console.log('hello');
}, 1000);
console.log('world');
```

JavaScriptは、普通は(同期関数は)、上から順番に1行ずつ実行される。

しかし上記のコードを実行するとworldが表示された後にhelloが表示される。
これは`setTimeOut()`関数が非同期関数だからだ。

さっきのコードの書き方を少し変えてみる。

```js
function Hello() { // 1
  console.log('hello'); // 4
}
setTimeOut( Hello, 1000) // 2
console.log('world') // 3
```

さっきと同じ動作をするコードだ。
コンピュータの気持ちになってみると

1. Hello関数を定義するよ。Hello関数は実行されたら`'hello'`と表示するよ。まだ定義だけで実行しないよ。
2. setTimeOut関数を実行するよ。Hello関数を1000ms後に実行することを登録するよ。__登録するだけで、すぐに戻り値を返すよ。__
3. `'world'`と表示するよ。

... しばらく(1000ms)経って ...

4. Hello関数を実行するよ、`'hello'`と表示するよ。


こんな流れである。
同期関数はその行で処理が停止するのに対し、非同期関数はすぐに次の行が実行される。

こうすると待っている1秒の間に他の処理も行えるので、たとえばサーバと通信して新しい情報を得る間にロード中の画面を表示するだとかが実現できる。
逆に同期関数だと、サーバと通信している間画面が固まってしまい入力も受け付けないことになる。

## Step2-2 コールバック (非同期関数)

さてさて、先程の例で非同期関数を実現してるのがコールバックだ。

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
たとえばこの例だと、どの秒数がどのsetTimeOutに対応するのかわかりづらい。

(上記の例は全て一つのsetTimeOutにまとめられるが)
実際には次のような状況が考えられる。

1. サーバと通信して、記事のリストをとってくる。
2. 記事のリストから該当の記事を探して、再度サーバと通信して本文をとってくる。

このように、複数の非同期処理が数珠つなぎになることもあるだろう。

数珠つなぎ、、、

## Step2-3 Promise (非同期関数)

そう、数珠つなぎならさっきのPromiseチェーンと相性が良い。

さっきの6秒待つ処理も

```js
// 事前にPromise関数を作っておく。
// ライブラリなどで用意されていたりするので、Promiseを使う側は作る必要はない。
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

// () => { return 0 } 
// 上記のような戻り値のみのアロー関数は、括弧とreturnを省略して
// () => 0
// とも書ける。
```

ネストが解消されて、引数もコンパクトになって見やすくなった。

## Step2-4 asnyc/await (非同期関数)

さらに async/awaitで書き直すと

```js
// 事前にPromise関数を作っておく。
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

awaitの行で停止しているかのように動作する。

## さいごに

この記事で次の2つを押さえていれば、他の記事が格段に読みやすくなるだろう。

- 同期処理と非同期処理の違い
- 同期処理でPromiseがどういう動作をするか

これからは「callback地獄を解決するためにPromiseチェーンがある」「async/awaitはPromiseの生成だ」などと書かれた他の記事も読めるのではなかろうか。

この記事を完全に理解できなくても、 読者の皆様はこれからJavaScriptの非同期処理を深める土台ができているのではないかと思う。

ここまでの長文に付き合いいただきありがたい。

以上。
