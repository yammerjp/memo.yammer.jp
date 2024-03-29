---
title: "C言語の構造体メンバのアライメント (x86_64, Linux (System V ABI))"
date: "2020-07-09T00:59:59+09:00"
tags: [ "コンパイラ", "willani", "日記", "C" ]
---

System V ABI における構造体メンバのアライメントの方法を記す。

C言語のコンパイラを自作しているときに学んだことの記録で、
これまでの記事
「[数日前からCコンパイラを書き始めた。](/posts/willani-start/)」
「[自作Cコンパイラの途中経過](/posts/willani-compliperbook-finished/)」
「[自作コンパイラのセルフホストに挑戦中](/posts/try-selfhost)」
に続く記事である。

## System V ABI とは？

ABI (Application Binary Interface) とは、バイナリレベルでのコンパイラが満たすべき規約である。
アーキテクチャやOSごとに決まっており、例えば我々が一般的に使うintelのCPUである x86_64 でいえば、 Windows は  Microsoft ABI, Linux と macOS は [System V ABI](https://www.uclibc.org/docs/psABI-x86_64.pdf)という規約で定められている。

具体的には次のようなものが決められている。

- int long 等の型のサイズ
- 構造体のメモリ上での配置
- 関数呼び出し時のスタック, レジスタの扱い



ABIはなんのためにあるのか？
それは異なるコンパイラ間でビルドしたバイナリをリンクできるようにするためである。

現在、一般に libc などのライブラリはバイナリに含まれず、事前に別にビルドされたものを実行時にダイナミックリンクして呼び出している。
このような状況下では、異なるコンパイラでビルドされたバイナリ同士が相互に関数を呼び出すことが考えられる。

(大きなライブラリは個別のアプリケーション開発時にビルドするのは手間だし、libcなどは様々なバイナリで使われるので、バイナリに含ませないことで共通化して容量を削減させたい。)

int や long といったデータ型は C言語の仕様ではサイズが定められていない。long のサイズが int 以上である、といったことは決まっているが、別に 4byteでなくてもよい。 (16bit CPU では 2byte だったりする。)
データ型はアーキテクチャに依存することが多い？と思われる。

他にも関数呼び出し時に引数や戻り値をどのように渡せばよいかを考えると ABI の必要性がみえてくる。
引数はレジスタに入れることも考えられるし、スタックに積むことも考えられる。C言語の仕様では引数や戻り値という概念は存在するが、具体的にどう実装するかは定められていない。そこであるコンパイラではレジスタ渡しをするかもしれないし、あるコンパイラではスタック渡しをするかもしれない。どちらも使うコンパイラもあるかも知れないし、コンパイラの作りようはいくらでもある。

しかしコンパイラが自由に作ってしまうと、他のバイナリから呼ぶときに困る。他のコンパイラでビルドしたバイナリは引数をレジスタに詰めて渡したつもりになっていたが、受け取る側はスタックを読みだすかもしれない。

このようなアーキテクチャやOSによって共通なC言語をバイナリレベルでコンパイラがどう実装するか決めておいたほうがよいことがABIで定められている。

## アライメントとは？

スタックに領域を確保するとき、空いている部分にピッタリ詰めるのではなく、ある程度キリの良いメモリ配置になるように、使っていない無駄な領域(パディング)を用意してメモリ番地を揃えることをアライメントという。

C言語のアライメントはABIによって定められている。

アライメントは構造体に求められる。
ローカル変数同士はどう配置されていようと関係なく、それを読み出すのは自身のバイナリであるから問題ない。

System V ABIでは、各データ型のサイズとアライメントすべき単位のサイズがそれぞれ同じバイト数になっている。
([仕様書](https://www.uclibc.org/docs/psABI-x86_64.pdf) 12ページ Figure 3.1 Scalar Types)


## 本題: System V ABI における構造体メンバのアライメント

### 仕様書の記述

仕様書には構造体メンバのアライメントについて次のような記述がある。
([仕様書](https://www.uclibc.org/docs/psABI-x86_64.pdf) 13ページ 中段 Aggregates and Unions)

> Structures and unions assume the alignment of their most strictly aligned component. Each member is assigned to the lowest available offset with the appropriate alignment. The size of any object is always a multiple of the object‘s alignment.

any object と the object が何を指しているのか最初イマイチわかっていなかったが、他の日本語の解説なども読んだ結果、次を意味するらしい。

- 構造体の各メンバは, それぞれの要素ごとに厳密にアライメントされる。( => 利用可能なオフセットの中で最も低いもの(パディングが小さいもの)に配置される。)
- 構造体末尾のパディングは, 構造体の要素のアライメント単位の中で最大の値でアライメントされるように付加する。

### 例

次のような構造体を考える

```c
struct hoge {
  char a;
  char b;
  int c;
  short d;
};
```

以上の構造体の実体は、次のようにアライメントされる

| メモリ番地 | 内容 |
|:---- |:---- |
| 0x....00 | char a |
| 0x....ff | char b |
| 0x....fe | padding |
| 0x....fd | padding |
| 0x....fc | int c |
| 0x....fb | int c |
| 0x....fa | int c |
| 0x....f9 | int c |
| 0x....f8 | short d |
| 0x....f7 | short d |
| 0x....f6 | padding |
| 0x....f5 | padding |

まず、定義されたメンバと同じ順で配置される。
1. `char a` は先頭なので何も考えずに配置する。
1. `char b` を配置するために、必要ならパディングをしてメモリをアライメントする。
`char` のアライメントすべきメモリ境界の単位は 1byte (すなわちどこでも良い) なのでパディングの必要がない (既にアライメントされているともいえる)
1. `char b` をアラインされた場所 (今回は `char a` のすぐ後ろ) に配置する。
1. `int c` を配置するために、必要ならパディングをしたメモリをアライメントする。
`int` のアライメントすべきメモリ境界は4byteであるが、番地 `0x...fe` はこれを満たしていないので、2byte パディングしてメモリをアライメントする。
1. `int c` をアラインされた場所 (今回は 2byte のパディングの後ろ) に配置する。
1. `short d` を配置するために、必要ならパディングをしてメモリをアライメントする。
`short` のアライメントすべきメモリ境界の単位は 2byte で、今回はこれを満たしているのでパディングの必要がない (既にアライメントされているともいえる)
1. `short d` をアラインされた場所 (今回は `int d` のすぐ後ろ) に配置する。
1. `struct hoge` 自体の終わりにパディングをする。
アライメントすべきメモリ境界は、メンバのアライメントすべきメモリ境界 (`char`...1byte, `int`...4byte, `short`...2byte) のうち最も大きい値である `int`...4byte に合わせるようにパディングする
よって 2byte のパディングを追加

以上。

ちなみに `sizeof(struct hoge)` の値は `12` となる。

- 参考: [データ構造アライメント - Wikipedia](https://ja.wikipedia.org/wiki/%E3%83%87%E3%83%BC%E3%82%BF%E6%A7%8B%E9%80%A0%E3%82%A2%E3%83%A9%E3%82%A4%E3%83%A1%E3%83%B3%E3%83%88) ... 日本語のわかりやすい解説。

## 何故アライメントするのか

アクセスが速くなるとか？？。。。

---

(2021/08/09) アクセスが早くなるかららしい。
また、(今回はx86_64に限定しているが) CPUのアーキテクチャによってはアライメントを強制する場合もあるらしい。

メモリのアライメントに関する面白い動画に出会った: [自作OSを拡張する作業配信 (2021/07/24 低レイヤガール - Youtube](https://youtu.be/V_MSKb6qgk0?t=4442)
動画後半 1:14:02 ごろからメモリのアライメントに関する話がされている。
