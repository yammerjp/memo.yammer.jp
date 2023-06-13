---
title: "LlamaIndexを使って、gawkプログラミングの相棒を作る"
date: "2023-06-13T14:10:00+09:00"
tags: [ "OpenAI", "llama-index", "embedding", "python", "flask" ]
---

LlamaIndexを使って手を動かしてみようということで、gawkプログラマーが使える、質問回答アプリケーションを作ってみた。

[gawk-rubber-duck](https://gawk-rubber-duck.yammer.jp)

## LlamaIndexとは

[LlamaIndex](https://github.com/jerryjliu/llama_index)という、LLMアプリケーションのためのフレームワークがある。
Pythonで書かれたプログラムで、内部でOpenAI APIを実行するが、その前後の処理なども行ってくれるものである。

LlamaIndexがどのようなものかの説明は、次の記事がわかりやすい。

[Llamaindex を用いた社内文書の ChatGPT QA ツールをチューニングする - GMOインターネットグループ グループ研究開発本部（次世代システム研究室）](https://recruit.gmo.jp/engineer/jisedai/blog/llamaindex-chatgpt-tuning/)

記事の中程の、LlamaIndex 処理フローに丁寧に書いてある。主に以下のことをやっているようである。

- 事前に与えられた知識となる文章を適切に分割し、embeddingでベクトル化しておく
- 質問文をembeddingし、ベクトルの類似性を元に、関連の文章を取り出して、LLMに一緒に渡す。

LlamaIndexを使うと、モデルが学習済みで無い、かつ、一度に与えられる上限を超えた沢山の文章をベースに、文章生成ができる。

公式ドキュメントに[チュートリアル](https://gpt-index.readthedocs.io/en/latest/getting_started/starter_example.html)が用意されているので、[それを動かして雰囲気を掴んだ](https://zenn.dev/basd4g/scraps/e2eea84da6435d)。

## gawk-rubber-duck

LlamaIndexをつかってみたいということで、一つアプリケーションを作ってみた。

最近趣味でgawkのコードを書いているのだが、そのとき、gawkの公式マニュアルである、[The GNU Awk User's Guide](https://www.gnu.org/software/gawk/manual/)をよく参考にしている。このマニュアルは分量がそこそこある英語の文章で、これをLlama-Indexと組み合わせて、gawkに特化した文章生成ができたら面白いのでは無いかと思ったのが、発想のはじまり。

[ラバーダック・デバッグ](https://ja.wikipedia.org/wiki/%E3%83%A9%E3%83%90%E3%83%BC%E3%83%80%E3%83%83%E3%82%AF%E3%83%BB%E3%83%87%E3%83%90%E3%83%83%E3%82%B0)という言葉があるように、プログラマーの相棒といえばアヒルだろう。今回は賢いアヒルを用意したつもりでgawk rubber duckと名付け、gawkの質問に答えるWebアプリケーションとして作成/公開した。

## 作り方

以下、どのように作ったかを記録しておく。

### インデックスの作成

まず、事前準備として、gawkの章ごとに分割されているHTML版のマニュアルをダウンロードし、HTMLタグを取り除いてプレーンテキストにする。(プレーンテキスト版も配布されてはいるが、全セクションが1つにまとまったファイルなので、意味のある単位で最初から分割されているHTML版のものを使った)

- [gawk-rubber-duck/pipeline/download.sh at main · yammerjp/gawk-rubber-duck · GitHub](https://github.com/yammerjp/gawk-rubber-duck/blob/main/pipeline/download.sh)
- [gawk-rubber-duck/pipeline/html2txt.js at main · yammerjp/gawk-rubber-duck · GitHub](https://github.com/yammerjp/gawk-rubber-duck/blob/main/pipeline/html2txt.js)


次に、これをLlamaIndexに渡すと、入力が一定の粒度に分割され、それぞれがembeddingによってベクトル化された上で、JSONファイルとして出力される。

- [gawk-rubber-duck/pipeline/save.py at main · yammerjp/gawk-rubber-duck · GitHub](https://github.com/yammerjp/gawk-rubber-duck/blob/main/pipeline/save.py)

なお、多数の文章をOpenAI APIに渡すので、事前に金額感をつかむために、tiktokenというライブラリを使って、トークンの消費量を計算してから行った。

- [gawk-rubber-duck/pipeline/guess-token.py at main · yammerjp/gawk-rubber-duck · GitHub](https://github.com/yammerjp/gawk-rubber-duck/blob/main/pipeline/guess-token.py)

JSONに保存された文章やベクトルを元に、回答生成するのも数行でかける。

- [gawk-rubber-duck/pipeline/query.py at main · yammerjp/gawk-rubber-duck · GitHub](https://github.com/yammerjp/gawk-rubber-duck/blob/main/pipeline/query.py)

### Webアプリケーションにする

Flaskを使って、HTTPリクエストを受け付けるようにする。

- [gawk-rubber-duck/web/main.py at main · yammerjp/gawk-rubber-duck · GitHub](https://github.com/yammerjp/gawk-rubber-duck/blob/main/web/main.py#L38-L54)

リクエストごとにOpenAI APIを実行するので、IPアドレスベースのレートリミットを導入した。[Flask-Limiter](https://flask-limiter.readthedocs.io/en/stable/)と、記憶領域には、無料枠のある[MongoDB Atlas](https://www.mongodb.com/ja-jp/atlas/database)を、パスワード認証で使っている。

できたアプリケーションはDockerでまとめて、Cloud Runに載せた。OpenAI API Keyと、MongoDBへの接続情報は、シークレットマネージャで環境変数から差し込んでいる。

- [gawk-rubber-duck/web/Dockerfile at main · yammerjp/gawk-rubber-duck · GitHub](https://github.com/yammerjp/gawk-rubber-duck/blob/main/web/Dockerfile)

## 感想

実際のところ、今回のアプリケーションはひとまず作って公開してみた、という程度で、どこまで実用かはまだ未知数。

LlamaIndexを使って試してみる、というのはそれこそPythonのプログラムを10行程度書けばできてしまった。入力を分割したり、ベクトル検索したりという部分も含めて何もしなくてもいいので、とりあえず試してみる、というのがとてもやりやすい。

求めていた回答が出ているかといわれると、ちょっと微妙で、今回でいえば以下がみえている課題

- 適切な文章を探せるか<br>
  LlamaIndexは、与えた文章を、最初にベクトル検索で絞り込むので、そのときに目的のものが絞り込めなければ、良い結果が出ないようである。例えば入力を日本語で与えると、そのままembeddingしても関係のある文章を引っ張って来れないようで(ここ間違っていたら指摘してください)、[英語に翻訳してからLlamaIndexに渡す](https://github.com/yammerjp/gawk-rubber-duck/blob/0bc8212300992fea94addef18a05e5ed3b1d3cd3/web/main.py#L46-L49)ようにしてみたりしている。
- 文章から知見を抽出できるか<br>
  今回入力に与えたThe GNU Awk User's Guideはおそらく昔からネット上に公開されているもので、言語モデル自体がこの情報を学習していると思われる。なので、LlamaIndexで情報を与えずとも、元々多少なりとも回答してくれるので、今回の方法が効果的かは疑問がある。
- 品質の評価ができるか<br>
  上記を含め、作ったものや仕組みがどれくらい実用に耐えうるか、方式を変えると改善しうるかというのは、評価する必要があるが、こういった具体的なユースケースにおいてどのように評価すればいいのかがわかっていない。作ってみたが、いまのところは作ってみて終わり、となっている。

というわけで、以上、今回は作ってみたという記事。実用的はどうかは疑問があるが、デプロイまでできると一区切りした感があっていい。

