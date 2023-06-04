---
title: "OpenAI API Embeddingsを使った、関連記事の表示・検索"
date: "2023-06-05T01:35:00+09:00"
tags: ["OpenAI", "Pinecone", "検索", "Embedding" ]
---

このブログに、お試しで2つの機能を追加してみた。
ひとつは、[関連記事の表示](#related-articles)。もう1つは、[検索](/search)。
どちらも[OpenAI API Embeddings](https://platform.openai.com/docs/guides/embeddings/what-are-embeddings)を使って、記事の文章をベクトル化し、[Pinecone](https://www.pinecone.io)を使ってベクトルの類似度の近しいものを得ている。

以下は、これをどのようにして作ったか、どのようにして動いているのかを説明する。

## 構成

作ったものの全体像は以下の図のとおり。

![OpenAI API EmbeddingsとPinecone APIに対し、手元のPCもしくはCloudFlare Workersからリクエストを発行する。記事を書いたら、記事内容をOpenAI API Embeddingsでベクトル化してPineconeに保存する(STEP 1)。次に、ある記事のベクトルをもとに、関連記事をPineconeから取得する(STEP 2)。Webページからの検索クエリは、CloudFlare Workersが受け取り、OpenAI API Embeddingsでベクトル化してから、Pineconeで類似するベクトルを得て、記事情報に変えて表示している。](http://blob.yammer.jp/embedding-and-vector-similarity-matching.png)

以下のようなことをやっている。出てくる要素は、「要素技術とロール」の項で後述する。

- <u>STEP1: インデックス作成</u>
  すべての記事に対して、それぞれ、記事全文をOpenAI API Embediingsに渡してベクトル化し、それをPineconeに登録する
- <u>STEP2: 関連記事の探索</u>
  ある記事のベクトルをPineconeに渡し、それと類似度の高いベクトルを得る。そのベクトルの表す記事を、関連記事としてページ生成時に埋め込む。
- <u>STEP3: キーワード検索</u>
  ユーザが検索したキーワードは、CloudFlare Workersが受け取り、OpenAI API Embeddingsでベクトル化してから、Pineconeに渡して類似度の高いベクトルを得る。そのベクトルの表す記事を、検索結果として表示する。

## 要素技術とロール

作ったといっても、次の2つのサービスのAPIを叩いているだけである。

- OpenAI API Embedding
- Pinecone API

これらへ、以下の2つの箇所からHTTPリクエストを発行している。

- CloudFlare Workers
- 手元のPC (Macbook)

### OpenAI API Embeddings

OpenAI API Embeddingsの使い方は簡単。例えば「今日はいい天気です」をベクトル化するならば、以下のようになる。

```shell
$ export OPENAI_API_KEY=ここにAPIキーを入れる
$ curl https://api.openai.com/v1/embeddings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "input": "今日はいい天気です",
    "model": "text-embedding-ada-002"
  }'
{
  "data": [
    {
      "embedding": [
        0.0011353685,
        0.0045190547,
        -0.0039041303,
        ...1536次元の実数のベクトルが出力される。長いので省略
      ],
      "object": "embedding",
      "index": 0
    }
  ],
  "object": "list",
  "model": "text-embedding-ada-002-v2",
  "usage": {
    "prompt_tokens": 8,
    "total_tokens": 8
  }
}
```

あとは、ここで得られたベクトル同士の類似度を計算して、近しいものほど、より関連があるとして出力すればよい。

### Pinecone API

類似したベクトルを探すのは、今回の例であれば総当たりで計算しても良いが[^kishida-hatena]、マネージドサービスを使うことにする。最初にみたのはGoogle CloudのVetex AI Matching Engineだったが、個人で小規模に使うには高いので、無料枠のある[Pinecone](https://www.pinecone.io)を使うことにした。

まずIndexを1つ作る。次に、記事ごとのID (今回はURL末尾。この記事でいえば`embedding-and-vector-similarity-matching`)をキーにして、先ほど得たベクトルを登録していく。すべて登録すると、関連記事や検索結果を得る準備が整う。

関連記事を得るには、ある記事のベクトルをPineconeに渡して、類似のベクトル(とそれに紐づく記事ID)を得れば良い。キーワードや文章による検索は、文字列を予めOpenAI API Embeddingに通してベクトル化してから、類似のベクトル(と記事ID)を得ればよい。

[^kishida-hatena]: 同様のことをやっている@kisさんの先行事例では、Javaで内積を計算する処理を自前で書いているようです。 [GPTのEmbeddingを使った近いエントリを探す処理がVector APIなどで10倍高速になった - きしだのHatena](https://nowokay.hatenablog.com/entry/2023/04/03/173313)

### CloudFlare Workers

検索ページ `https://memo.yammer.jp/search` から受けた検索クエリを元に、OpenAI API EmbeddingsとPineconeへリクエストを発行するのに使っている。このブログはNext.jsを使っているが、SSGなので、APIキーを隠すためになんらかのバックエンドが必要だった。

ブラウザから実行される公開されたエンドポイントなので、IPアドレスベースのRate Limitを実装した。[CloudFlare KVベースの実装を説明したブログ記事](https://steemit.com/blog/@justyy/a-simple-rate-limiter-for-cloudflare-workers-serverless-api-based-on-kv-stores)があったので、これをそのまま真似た。作ったものの中身はGitHubにある。([yammerjp/memo-yammer-jp-similarity-matching](https://github.com/yammerjp/memo-yammer-jp-similarity-matching))

OpenAI APIもPinconeもNode.js用のクライアントライブラリがあるが、CloudFlare Workers内では[Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)を直接使ってリクエストを発行している。余談だが、curlの実行例をChatGPTに渡したらFetch APIの実装をやってくれて便利だった。

### 手元のPC (Macbook)

現在は、以下の2つのことを手元のMacbookでやっている。継続的に使うようならGitHub Actionsに載せる予定。

- 記事の内容をベクトル化 ([`bin/embedding.js`](https://github.com/yammerjp/memo.yammer.jp/blob/1c2f55be7fb2fdeaba409ff7e189c6bc3d533c55/bin/embedding.js))してPineconeに登録する ([`bin/genIndex.js`](https://github.com/yammerjp/memo.yammer.jp/blob/1c2f55be7fb2fdeaba409ff7e189c6bc3d533c55/bin/embedding.js))
- 関連記事を得る ([`bin/queryRelatedArticles.js`](https://github.com/yammerjp/memo.yammer.jp/blob/1c2f55be7fb2fdeaba409ff7e189c6bc3d533c55/bin/embedding.js))

 上記の2つは、すべての記事に対して処理を実行するスクリプトになっている。本当はすべての記事に対してやる必要はなく、差分更新すればいいのだが、Gitで記事管理しているSSGのサイトは、差分更新と相性が悪いので、どのようにやるか考えあぐねている。Pinecone以外に何らかのデータストアが外部に欲しい。

## おわりに

便利なものが揃っていて、それらを繋ぎ込むだけで割と簡単に作れてしまった。

関連記事は結構いい結果が出ているようにみえる。検索も、まあまあいい感じではある。ただ、検索ワードを検索欄に自分で入力するUIは、単語ベースの完全一致の検索を想起するので「記事のどこかに検索ワードが出てくるのではないか」「だとしたらどこに出てくるのか」などが気になってしまう。何か他のものと組み合わせるのがよいのかもしれない。
