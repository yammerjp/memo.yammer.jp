---
title: TypeScriptでプロジェクト内独自の型定義をまとめたファイルを読み込ませる方法。
date: 2020-05-16T01:01:45+09:00
---

TypeScriptでプロジェクト内の型定義をするときのための過去のメモをここに供養する。

## やりたいこと

TypeScriptで、独自の型定義をプロジェクト内の複数のファイルで利用したい。

`src/types/index.d.ts`で定義する型`DayOfWeek`をはじめとして、`src/types`ディレクトリ以下のファイルにある型定義をTypeScriptコンパイラに読み込ませて、プロジェクト内の任意のファイルで利用できるようにする。

```src/types/index.d.ts
type DayOfWeek = "Sunday" | "Monday" | "Tuesday" | Wednesday" | "Tursday" | "Friday" | Saturday"; 
```

## 方法

`tsconfig.json`に次を追記する

```tsconfig.json
{
  "compilerOptions": {
    "typeRoots": [
      "node_modules/@types",
      "src/types"
    ]
  }
}
```

`tsconfig.json`内での`compilerOptions.typeRoots`は文字列の配列をおく。

文字列は型定義ファイルを置くディレクトリのパスを表す。

もともと、npmでインストールしたパッケージの型定義は`node_modules/@types`以下に配置され、`compilerOptions.typeRoots`が定義されていないときはデフォルトで読み込まれる。

`compilerOptions.typeRoots`を記述する際には、自分の定義したい型ファイルのディレクトリと合わせて、デフォルトで読み込まれる型定義ファイルのパスも記述する必要がある。


## 発展して

逆に、インストールした型定義を無視したい時は、`compilerOptions.typeRoots`に`node_modules/@types`を除いて記述すれば良い。

使うシチュエーションはあまりないかもしれないが。

## 感想

TypeScriptは毎回完全理解()しているので、チョットデキル人間になるために一度ちゃんと学び直す必要がありそう。

(この項目はメモをここに移したときに書いた)

