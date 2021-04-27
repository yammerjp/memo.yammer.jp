---
title: "足でマイクのミュートを解除しよう for 在宅勤務"
date: 2021-04-27T09:41:29+09:00
tags: ["macOS", "在宅勤務", "作業環境", "Karabiner-Elements" ]
---

私はいま、在宅勤務をしている。
特に研修中だからかオンライン通話の機会が多く、通話しながら作業や調べ物をするので、マイクのミュート/ミュート解除に手こずることに悩みを抱えている。
そんな中、ふとしたときに気づいたのである。「足が空いているではないか」と。

家に左クリックが壊れたマウスが有ったのでこれをフットスイッチ代わりにして、押しているときだけミュート解除するようにしてみた。

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">こちら、机の下に置かれた不審なマウスです。 <a href="https://t.co/DWxn3oxcLM">pic.twitter.com/DWxn3oxcLM</a></p>&mdash; やんまー (@basd4g) <a href="https://twitter.com/basd4g/status/1386699716356837380?ref_src=twsrc%5Etfw">April 26, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

どのように実現しているかは後半の「[つくりかた](#つくりかた)」に書く。

## 良いところ

- __細かくミュート/ミュート解除できる__

目論見どおりうまく動いており、概ね快適である。
鼻をすする音など些細な音が入らずに済むのがすこぶる良い。
例えば相槌をうちながらキーボードを打つときや、ZoomやGoogle Meet以外のウィンドウ・タブを操作しながら話すときなどに助かる。
スムーズにミュート解除できるので、些細なリアクションのときだけミュート解除するみたいなことができる。
スイッチを押したとき/離した時のタイムラグも (周りに聞く限り) 問題ないようでで常用できそう。

## 改善すべきところ

- __ペダルが踏みづらい__

良いところもある一方、まだ道半ばだと感じる部分もある。
例えばマウスの右クリックボタンは小さいため、少し足を離していると何処にあるかわからなくなる。
すると目視で確認しないと踏めないので発話がワンテンポ遅れる。
ピアノのペダルのようなもっと踏みやすいものに変えたほうがよさそう。

- __慣れないので間違える__

ペダル操作は慣れが必要で、踏み忘れて話しはじめてしまったり、逆に足を外して音を立ててしまったりすることも有った。
「キーボードや手元のマウスを操作すること」「足でミュート解除すること」「話すこと」の3つを同時にやろうとすると頭の中がついていかずスムーズにできない。
慣れればペダル操作が無意識でできるようになることを期待しているのでしばらく使っていきたい。

- __ミュート/ミュート解除のソフトウェア制御が怪しい__

もうひとつ、ミュート/ミュート解除をソフトウェア的に制御する方法が怪しい。
macOSの仕様がよくわからないのだが、OS側でマイクをミュートにする方法が見つけられずボリュームを最小にすることで擬似的にミュートにしている。
アプリケーションの種類に左右されずに、さらにウィンドウがアクティブでないときも操作したいので、いまは OS 側の設定をシェルから叩いている。

```sh
# マイクをミュート
$ osascript -e "tell application \"System Events\" to set volume input volume 0"
# マイクをミュート解除
$ osascript -e "tell application \"System Events\" to set volume input volume 100"
```

今日Google Meetで話した感じではミュートされているようだったが、Zoomで試した感じだと最小でもすこし音が入っていた。
もし他にいい方法があれば知りたい。
(電子工作つよつよマンならマイクケーブルをスイッチで電気的に切断してミュートできそうだけれど、操作時のノイズなども出てきそうなので一旦ソフトウェア的に切り替える方式で考えている。)

## 感想

働き始めて3週間、在宅勤務にはきっと在宅勤務なりのスキルが必要だなあと感じる。
たぶん自分がいままで属してきた他のコミュニティでは今の会社のようなオンラインコミュニケーションを取るのは難しかったように思う。
何が難しいのかは言語化しづらいのだが、きっと会社の中で今まで積み上げられてきた様々な知見や文化が関与していそう。

在宅勤務なりのスキルとは、チャットコミュニケーションの円滑さや、オンライン通話のテクニックも含まれるだろう。
例えば画面越しでは感情が伝わりづらいので大きなリアクションをするとか、話し始めがかぶりやすいので細かいところでも誰かがファシリテーションしたり事前に挙手したりするとか、そういったことの積み重ねが大切に感じる。
その要素のひとつにミュートを使いこなすこともあって、 雑音を入れない意味でも大きなリアクションを伝える意味でもスムーズに切り替えられるとよさそう。
今回のペダルでの操作がうまい方法かわからないが、画面上のボタンだとミュート解除が遅れて困る機会がときどき有ったのでそれらを解消できるとよいね！

## つくりかた

既にだいぶ書いたが、やっとここからつくりかたを説明する。

今回の仕掛けは、macOS に接続した USB マウスと Karabiner-Elements というソフトウェアから成る。
__足元に置いたマウスの右クリックを検知し、マウス押下時にミュート解除のシェルコマンドを、押下を止めたときにミュートのシェルコマンドを実行している。__

![マウス押下時にミュートする仕組みの外観図](https://blob.basd4g.net/foot-switch-mic-mute-irasutoya.png)

<div style="margin-top:0px; text-align:center; width:100%; color: #888888; margin-bottom: 20px;">これは私がいらすとやの画像を使いたかったことを表す図です。</div>

さあ作っていこう。

### 1. Karabiner-Elements をインストール

Karabiner-Elementsはもともとキーボードの操作を書き換えるソフトウェアで、例えばCapsLockキーをCtrlキーに置き換えるだとか、Spaceキーを長押しするとShiftキーが押されたことにするといった設定ができる。
ついでにマウスの入力も扱えるので、今回は特定のマウスがクリックされた時にコマンドを実行するよう設定ファイルを書くことにする。

まず [Karabiner-Elements のサイト](https://karabiner-elements.pqrs.org) からファイルをダウンロードしインストールする。
<a id="annotation-1-from" href="#annotation-1">^1</a>

![macOS 環境設定のセキュリティとプライバシーの項目で、Karabiner-Elementsによる入力監視を有効化する](https://blob.basd4g.net/foot-switch-mic-mute-security-and-privacy.png)

初回起動すると、macOS のセキュリティ許可などを設定しろだとか再起動しろだとかいわれるはずなので従う。
以降はログインすると勝手に Karabiner-Elements も起動して、メニューバーに四角形のアイコン (<img src="https://blob.basd4g.net/foot-switch-mic-mute-karabiner-icon.png" style="width:1em; height:1em;" />)が表示されて常駐する。


### 2. デバイスを有効化する

メニューバーの Karabiner-Elements アイコンをクリック > Preferences... > Devices タブを開く。

この状態で足のスイッチにしたいマウス<a id="annotation-2-from" href="#annotation-2">^2</a> をコンピュータに挿して、新たに表示されたデバイスの行の左端のチェックボックスを有効にする。
他デバイスのチェックボックスを有効にすると、他デバイスの入力も奪って設定を反映してしまう可能性がある。
入力を上書きしたいデバイスのみにチェックをいれること。

![Karabiner-ElementsのDevicesタブで、当該のマウスにチェックを入れる](https://blob.basd4g.net/foot-switch-mic-mute-devices.png)

### 3. 設定ファイルを記述

`~/.config/karabiner/assets/complex_modifications/mouse_mic_mute.json` を作成し、次の内容を書き込む。
<a id="annotation-3-from" href="#annotation-3">^3</a>

```json
{
  "title": "Unmute/Mute mic with clicking mouse",
  "rules": [
    {
      "description": "Unmute/Mute with mouse button down/up",
      "manipulators": [ {
        "type": "basic",
        "from": {
          "pointing_button": "button2",
          "modifiers": { "optional": [ "any" ] }
        },
        "to": [ {
          "shell_command": "osascript -e \"tell application \\\"System Events\\\" to set volume input volume 70\""
        } ],
        "to_after_key_up": [ {
          "shell_command": "osascript -e \"tell application \\\"System Events\\\" to set volume input volume 0\""
        } ]
      } ]
    }
  ]
}
```

設定をカスタマイズするとすれば、たとえば `pointing_button` を `button1` にすれば、左クリックを対象にできる。
その他の設定は[公式の説明](https://karabiner-elements.pqrs.org/docs/json/complex-modifications-manipulator-definition/)や [Qiita の記事](https://qiita.com/s-show/items/a1fd228b04801477729c) を参考に。


### 4. 設定を有効化

メニューバーの Karabiner-Elements アイコンをクリック > Preferences... > Complex modifications タブを開く。

右下の「Add rule」を押し、「Unmute/Mute with mouse button down/up」を「Enable」する。

![Karabiner-ElementsのComplex modificationタブで、記述したJSONファイルの項目を読み込む](https://blob.basd4g.net/foot-switch-mic-mute-complex-modifications.png)

<div style="margin-top:5em;"></div>

ここまでの操作でミュートをいい感じに操作できるはず。
なお、マウスの裏側には黒い紙を貼ってポインタが反応しないようにしている。
左クリックなどが反応しないのはマウス自体が壊れているからっぽい。
もし通常のマウスを使う場合はKarabiner-Elementsの設定で、各ボタンの入力について`"to": [{}]`といった何もしない設定を追加すると良さそう。

以上。

<div style="margin-top:5em;"></div>

---

補足

<a id="annotation-1" href="#annotation-1-from">^1</a>
 ... `$ brew install karabiner-elements`でもインストールできるはず

<a id="annotation-2" href="#annotation-2-from">^2</a>
 ... 今回は手元に壊れかけのマウスが有ったのでこれをスイッチとして使ったが、キーボードなどでも同様のことを実現できるはず。
 また何も足で押さなくてもよくて、机の上にスイッチがあるとか既存のキーボードにショートカットキーを定義するとかでもよいかもしれない。

<a id="annotation-3" href="#annotation-3-from">^3</a>
 ... 既にマウスに関する Karabiner-Elements の設定が存在する場合は、ぶつからないように、Vendor ID と Product ID をメモして設定に書き込むと良さそう。[参考までに私の設定ファイルはこれ。](https://github.com/basd4g/dotfiles/blob/cf0f3eaa6bce79b984cdcc53a42ed1ea65711f90/.config/karabiner/assets/complex_modifications/mouse_mic_mute.json)
