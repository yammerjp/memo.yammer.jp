---
title: "awkで実装するUnion-Findと、ABC177 D"
date: "2023-06-06T02:15:00+09:00"
tags: [ "競技プログラミング", "AtCoder", "ABC", "Union-Find", "awk" ]
---

最近、業務時間後のオフィスで「競プロもくもくわいわい会」というのをやっている。そこで[@purple_jwl](https://twitter.com/purple_jwl)さんよりUnion-Findを教えていただいたので、それをawkで実装して、[ABC177のD問題](https://atcoder.jp/contests/abc177/tasks/abc177_d)を解いてみる。

## Union-Findとは

ここでは深く解説しないが、Union-Findについては、以下のサイトなどが参考になる。

[Union-Find とは - アルゴ式](https://algo-method.com/descriptions/132)

> Union-Find はグループ分けを効率的に管理する、根付き木を用いたデータ構造です。
> Union-Find を用いると、次の各クエリ(要求)を高速に処理できます。
>
> N 個の要素 0,1,⋯,N−1 があり、初期状態ではそれぞれ異なるグループに属しています。
> 各クエリでは次のどちらかの操作を行います。
> - issame(x,y) : 要素 x,y が同じグループに属するかを調べる。
> - unite(x,y) : 要素 x を含むグループと要素 y を含むグループとを併合する。

複数のグループを統合して1つのグループにする操作(上記の`unite`)と、複数の要素が同じ要素に属しているかを確認する操作(上記の`issame`)ができるもので、これを使うことで、グループ分けの問題を解くことができる。ABCだとD問題などで出てくるらしい。

## Union-Findのawk実装

これを、awkで実装すると以下のようになる。[^vec]

[^vec]: ここでは`uf_parent`と`uf_size`という配列をハードコーディングしているが、これらの代わりに`vec["parent"]`、`vec["size"]`などとして、`vec`を各関数の第一引数に渡せるようにすると、Union-Findのデータ構造を、複数扱えるようになる。

```awk
# Union-Findの内部のデータ構造は、各グループごとの木構造である
# ある根を他の根の子にすることがUnion、ある頂点の根を求めることがFindにあたる。
# Findした結果が同じ頂点なら、同じ木に属するとわかる

# グラフは、次の変数に保持する
# - uf_parent[x] ... 値xの親となる値
# - uf_size[x] ... xが根のとき、その木の頂点数

# 新しい頂点を登録。辺はなく、自身が根になる
function uf_add(x) {
  uf_parent[x] = x
  uf_size[x] = 1
}

# uf_parentを再帰的にたどり、rootの値を返す
function uf_root(x) {
  if (uf_parent[x] == x) {
    # 根
    return x
  }
  # 再帰的に辿りながら、木の深さが浅くなるように辺を付け替えて高速化 (パス圧縮)
  return uf_parent[x] = uf_root(uf_parent[x])
}
 
# xとyを同じ木に統合する
function uf_unite(x, y,        rootX, rootY) {
  rootX = uf_root(x)
  rootY = uf_root(y)
  if (rootX == rootY) {
    # 既に同じ木ならば、何もしない
    return 0
  }
  # 片方の根を、もう片方の根の子にする
  #   木の深さが浅くなるよう、深い木の根の子として、浅い木の根を生やすことで高速化 (ランク結合)
  #     ここでは、ランクではなく木に含まれる頂点数を測って深さの代わりとしているが、
  #     これで本当に高速化されるのかは定かではない
  #     次のページなどが参考になるかもしれない
  #     ref: https://37zigen.com/union-find-complexity-1/
  if (uf_size[rootX] > uf_size[rootY]) {
    # rootXを根とする
    uf_parent[rootY] = rootX
    uf_size[rootX] += uf_size[rootY]
  } else {
    # rootYを根とする
    uf_parent[rootX] = rootY
    uf_size[rootY] += uf_size[rootX]
  }
  return 1
}
```

## Union-Findのawk実装を実行してみる

この実装の挙動は、以下のBEGIN句を動かすと想像しやすいだろう。

```awk
# 先ほどのUnion-Findの実装は同じなので省略
BEGIN {
  uf_add(1)
  uf_add(2)
  uf_add(3)
  uf_add(4)
  uf_add(5)
  uf_add(6)

  uf_unite(1,2)
  uf_unite(3,4)
  uf_unite(4,5)

  printf "uf_parent[1]: %d\n", uf_parent[1]
  printf "uf_parent[2]: %d\n", uf_parent[2]
  printf "uf_parent[3]: %d\n", uf_parent[3]
  printf "uf_parent[4]: %d\n", uf_parent[4]
  printf "uf_parent[5]: %d\n", uf_parent[5]
  printf "uf_parent[6]: %d\n", uf_parent[6]
  printf "\n"

  printf "uf_root(1): %d\n", uf_root(1)
  printf "uf_root(2): %d\n", uf_root(2)
  printf "uf_root(3): %d\n", uf_root(3)
  printf "uf_root(4): %d\n", uf_root(4)
  printf "uf_root(5): %d\n", uf_root(5)
  printf "uf_root(6): %d\n", uf_root(6)
}
```

実行結果は以下のようになる

```text
uf_parent[1]: 2
uf_parent[2]: 2
uf_parent[3]: 4
uf_parent[4]: 4
uf_parent[5]: 4
uf_parent[6]: 6

uf_root(1): 2
uf_root(2): 2
uf_root(3): 4
uf_root(4): 4
uf_root(5): 4
uf_root(6): 6
```

この時の木構造は以下のようになっている。

![mermaid `graph TD; 2-->1; 4-->3; 4-->5; 6;`](https://blob.yammer.jp/union-find-example-1-2-3-4-5-6.png)

## ABC177 D問題を解く

[D - Friends - Atcoder Beginner Contest 177](https://atcoder.jp/contests/abc177/tasks/abc177_d)

Union-Findの練習問題としてお勧めされた問題。問題文中のグループではなく、友達関係を辺としてUnion-Findに落とし込み、木ごとの頂点数の最大値が答えになる。
 
```awk
# 先ほどのUnion-Findの実装は同じなので省略

NR==1 {
  N=$1
  for (i=1; i<=N; i++) {
    uf_add(i)
  }
}

NR>1 {
  uf_unite($1, $2)
}
 
END {
  max = 0
  for (i in uf_size) {
    if (max < uf_size[i]) {
      max = uf_size[i]
    }
  }
  print max
}
```

---

というわけで、awkでもD問題が解けることが示されてしまいました。言語ではなく、解く人の能力が求められる、ということですね (頑張りましょうという自分へのメッセージ)。
