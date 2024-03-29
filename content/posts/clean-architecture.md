---
title: "Clean Architectureを読んだ"
date: "2022-08-23T23:30:00+09:00"
tags: [ "本", "ソフトウェア開発", "アーキテクチャ" ]
---

書籍「[Clean Architecture](https://www.kadokawa.co.jp/product/301806000678/)」を読みました。
副題は「達人に学ぶソフトウェアの構造と設計」となっており、ソフトウェアの構造や設計について見識をあまり持たない私は、この副題のとおり達人に学ぼうという気持ちで読みました。

## 本書で学べたこと (印象に残ったこと)

本書を読むことで、"依存の方向"と"境界の決定"に関する考え方を学びました。
これらをはじめとする、本書で学んだ考え方を以下に紹介します。

なおこの記事では、書籍のタイトルや内容に反して、クリーンアーキテクチャとは何かやクリーンアーキテクチャの図に関する話はほとんど出てきません。それを構成する考え方に重きをおいて紹介します。
以下に示す考え方をみてみると、同心円状に書かれるクリーンアーキテクチャの図も依存の方向と境界の決定などの考え方を適用してできあがる図であるといえると思っています。

### 依存の方向

アプリケーションのアーキテクチャにおいて、依存の方向を揃えることは重要です。

(例えばJavaではインタフェースを定義するなどして[^1])ポリモーフィズムを利用して処理の流れとソースコード上の依存の向きを逆転[^2]させることを、依存性の逆転と呼びます。
この依存性の逆転を用いて、クリーンアーキテクチャにおける上位のレベル (ビジネスロジックに近いもの) が下位のレベル (システムの入出力に近いもの) に依存しないよう、また循環依存とならぬよう、依存の向きを揃えることが様々なシチュエーションに適用して説明されています。

### 境界の決定

アプリケーションのアーキテクチャの検討において、実装の境界[^3]をどこにどの程度明確に作るかは、状況ごとにその都度考えて決定する必要があります。
なぜならば、アプリケーションの内容だけでなく、その周辺環境 (開発組織や開発頻度)、今後の開発計画など様々な要因で境界の最適解が異なるからです。

ユースケースのすべて、運用上の制約、チームの構造、デプロイ要件などは実装前に明らかになっているとは限らないし、またこれは開発運用を続けるうちに変化していくものです。
これらの変化に合わせて適切なタイミングで適切に境界を定めて分割できるよう、選択肢を残しながらそのときどきに合わせて判断を続けていく必要があると考えられます。

<details>

<summary>その他の事柄 (書籍で扱われる話題のメモ)</summary>

書籍で扱われているトピックが大変多いので、ここではメモとしていくつか列挙します。
詳細については書籍にあたればわかる程度の粒度で記載しています。

#### アーキテクチャに関連する原則

この書籍では以下のように多数の原則が紹介されています。これらをすべて厳密に守りましょうと主張しているというよりも、これらの原則が言い表している物事の方向性を明らかにして、望むべきアーキテクチャを考えるヒントとしている、というように感じました。

いっぽう私はこれらの原則に明るいわけではなかったので、どういうものか、いつ適用するか、何が嬉しいのかを把握することにも役立ちました。

- SOLID原則 (単一責任の原則、オープン・クローズドの原則、リスコフの置換原則、インターフェイス分離の原則、依存関係逆転の原則)
- コンポーネントの凝集性に関する原則 (再利用・リリース等価の原則、閉鎖性共通の原則、全再利用の原則)
- コンポーネントの結合に関する原則 (非循環依存関係の原則、安定依存の原則、安定度・抽象度等価の原則)

#### Mainコンポーネントは最も詳細

Mainコンポーネント (アプリケーションの起動時に実行されるコード) はもっとも詳細な部分であり、プラグインとして環境によって取り替えられるような作りにすべきであるという考え方が紹介されていました。

例えばユニットテスト実行時を考えてみると、アプリケーションのエントリポイントとは別の箇所から処理の実行が始まるでしょう。
つまりMainコンポーネントは、依存する側になるよう依存性の逆転を生かすべきコンポーネントのひとつであることがわかります。

#### アーキテクチャの変遷

(これは直接的には語られていませんが、ところどころで出現する話を私が解釈して勝手に書いています。)

書籍の中ではアーキテクチャの完全な正解を教えてくれるというより、アーキテクチャを考える上でのいくつかの要素を揃えてくれているように思います。

書籍の考え方を適用すると、マイクロサービスアーキテクチャや(本書では言葉こそ出てきませんが)モジュラーモノリスも、それらが特別なものではなく、境界の決定の仕方の選択肢のひとつであると感じました。

#### フレームワークなんかと結婚するな！

著者はフレームワークと結合することに否定的な考え方を持っています。
昨今のWebアプリケーション開発ではフレームワークに則って作ることがよくあると思いますが、ロックインされないような開発方法を提示するとともに、フレームワークとの密な結合をとった場合の考え方を結婚に例えて「病めるときも...」と記述しているのが少し皮肉的です。

---

このほかに、同心円状のクリーンアーキテクチャの図や、オブジェクト指向プログラミングがもたらしたものに関する記述も印象的でした。

---

</details>

## おわりに

この本は英語の原著に対する訳本だったのですが、文調がたいへん読みやすく感じました。著者/訳者の文章の書き方に憧れます。

書籍の内容について、これはアプリケーションを設計/開発するときのヒントのひとつになる内容でした。
今の自分にとっては結構よい本という感触がありますが、一方で全てを吸収する能力があったかというとこれは疑問です。開発経験のあるアプリケーションの数が多ければ、いまよりも詳細に書籍の指すことが理解できるだろうとも思います。

この本を読んで、自分が関わるアプリケーションがどんなアーキテクチャを持っているかを考えるきっかけになりました。またよいアーキテクチャを提案する能力も一部学ぶことができました。一方で、よいアーキテクチャを選択する能力は本書を読んでもそれほど得られていないでしょう。書籍を通して学んだ考え方をもとに、実際のアプリケーションと照らし合わせて考えを膨らませ経験を重ねることで得られるように思います。
精進します。

[^1]: 書籍ではJavaを扱っているのでJavaを挙げていますが、いわゆる動的型付け言語ではインタフェースを定義せずとも同名のメソッドがあれば振る舞いが定まるポリモーフィズムが実現できそうです。
[^2]: ソースコード上の依存の向きは次のように考えられるでしょう。例えばあるインスタンスBをAが呼び出すときは、AはBに依存しているといえます。一方であるインタフェースCをAが呼び出し、BはインタフェースCを実装したクラスのインスタンスであったとすると、AはCに依存し、BもCに依存します。これによりAからBに向く依存がなくなり、依存性の逆転がなされたといえます。
[^3]: 境界が何を指すのかは書籍では明確には定義されていないように思います。私が思うに、クラス、ファイル、ディレクトリ、(各言語に付属の)パッケージや名前空間、などがそれぞれ粒度の異なる境界といえるでしょう。
