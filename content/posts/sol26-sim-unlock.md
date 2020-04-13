---
title: XpeiraZ3(SOL26) SIMロック解除の手順
date: 2020-03-28 02:18:29
tags: android, SOL26, sim
---

PC内のデータを整理していたら過去に自分向けに書いていたメモが出てきたので、ここ記す形で移動する。
タイムスタンプをみるに、2017/11/22頃に書かれたものだ。

## 概要と目的 

手元にあるau版Xperia(SOL26)を、これまた手元にあるmineo Dプラン nanosimで使いたい。 
 
## いきさつ 

現在XperiaAX(SO-01E)をmineo Dプラン音声通話ありで運用中。 
AXもだいぶ古くなってきてカクカクなのとバッテリーの持ちも悪いので、手元にあるXperiaZ3に乗り換えることとした。 
 
ただしこのXperiaZ3はau版のSOL26であり、そのままではsimが対応していない。 

(SO-01E:docomoSIM micro ,SOL26:Volte非対応auSIM nano) 

そこで次の2つの方法を思いついた。(simを他会社に乗り換えるのは、MNP違約金発生のためなし) 
 
### 方法1:mineoをAプランにプラン変更 

せっかくmineoなのだから、プラン変更の手続きをするだけでSOL26はいじらずとも動く。(これができるようにmineoにしておいた) 
 
#### メリット: 

- いじらずに正規の方法で使える→felica等勿論問題無し、エリアが広い(docomoのプラスエリア無しに比較して、おそらく) 

#### デメリット: 

- プラン変更手数料で3000円以上取られる。更に変更の手続きに1週間かかる。本人確認も面倒くさい。 
- 何らかの理由で端末を変えたくなった場合、またプラン変更しなければならない(VoLTE非対応au端末は汎用性に乏しい) 
 
### 方法2:simアンロック＆simはmineo Dプラン nanosimのまま 

ネット上で検索して出てくる業者からIMEIを送ってsimアンロックコードを入手して自分で解除する。 
非公式な方法であり、ROM焼き等が必要 
 
#### メリット: 

- 手持ちのsimを使える(docomosimなので次の乗り換え時も汎用性がある) 
- => 手数料がかからない 
- => 手続きの面倒な手間がかかる 

#### デメリット: 
- 非正規の方法 
- 一部周波数帯(docomo band19 800MHz)をつかめない(グレーな方法でつかめる可能性あり) 
 
今回は、Z3をいつまで使うかわからないので、わざわざsim交換するのは手間だということで、SOL26のsimロック解除に至った。 
 
## simアンロックコードの種類

simアンロックコードにもいくつか種類がある。 
 
- NCK = Net Code Key 
- NSCK = Net Subset Code Key 
- CCK = Corporate Code Key 
- SPCK = Service Provider Code Key 

日本キャリア端末には上の4つと、simカードロック(端末利用者がpinコードを設定することでかかるロック)のあわせた5つが存在する。 

simアンロックコードを購入すると、上の4つのNCK,NSCK,CCK,SPCKが手に入るが、普通はNCKロックだけかかってるようなので、これを解除すればいいみたい。 

参考:http://blog.tagashira.com/article/175146502.html 
 
## 手順 
 
今回はauROMで運用予定なので、次のような手順となった。 
 
### simアンロックコードを入手 

頑張る

### 下準備 

PCにandroidSDK(ドライバ目的)とflashtoolをDL 

flashtoolにて、SO-01GとSOL26のROMをDL 
 
### docomoROM焼き 

simアンロックにはdocomoROMか海外ROMを焼く必要がある。 

純正のSOL26にdocomoROM(SO-01G 23.1.B.1.317)を焼く。(全wipe) 

flashtoolを使った焼き方は別記事にある。 
 
### アンロックコード入力 

非au simを入れて電源を起動したらsimロック解除の画面が表示されるので、NCKコード16桁を入力して解除する。 
成功したら解除と表示される。 
 
念のため、電話アプリから`*#*#7465625#*#*`にてsimロック解除状況を確認できる。 

### auROM焼き 

felicaを使いたいので、あと面倒くさそうなことはとりあえず避けるために、auROMを焼いて使う。 
 
先ほどと同様にflashtoolを使ってauROM(SOL26 23.1.G.2.224)を焼く。 
 
今度は一応basebandをExcludeしておく。(docomoの電波を使って通信するため。ただしdocomoでSOL26が使うband1はもともとauでも使うので、このExcludeの必要性はないと思われる。気持ちの問題) 
 
### APN設定 
 
通信事業者をdocomo LTEにする。 

詳細設定→CPA設定からAPNを設定する 
 
#### mineo ドコモプランの接続情報 

- 名前：mineo-d(任意で良い) 
- APN：mineo-d.jp 
- ユーザー名：mineo@k-opti.com 
- パスワード：mineo 
- 認証タイプ：CHAP 

(参考: https://support.mineo.jp/setup/guide/android_network.html)
 
## おわりに 

いきさつが長かったので、手順だけ知りたかった人には無駄に長い記事となってしまって申し訳ない。 
SOL26で実際にsimアンロックしてDocomo simで使ってみたが、普通の関東の郊外でも圏外になってしまったので、プラチナバンド(band19 800MHz)をつかまないのは結構不便なことが分かった。今度これもつかむようにしてみたい。 
