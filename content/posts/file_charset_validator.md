---
title: "Ruby製のCLIを作ってgemにしてみる"
date: "2022-02-09T22:20:00+09:00"
tags: [ "ruby", "gem", "文字コード", "CLI" ]
---

会社に入ってからRubyを触る機会がちょこちょこあるが、Rubyのことをあんまりわかっていないという感覚があるので機会をみつけてRubyで何かをつくるというのをやっていきたい。
今日はその中でファイルの文字コードを確認する処理をCLIとして実装してみた話。

## 作ったもの

実装するものは比較的シンプルで、渡されたファイルが指定された文字コードで解釈できるか否かを判定する。[^1]
Rubyのワンライナーで書くこともできる規模感のものだ。

```shell
$ find path/to/dir -type f | ruby -e 'STDIN.reject{|path| IO.binread(path.chomp).force_encoding(Encoding::UTF_8).valid_encoding?}.each{|f| puts f}.empty? or (puts "... There are invalid encoding files";exit 1)'
```

手元のファイルを確認するだけならワンライナーでいいが、一応テストを書いて動作が明らかであることを示したり、なによりRubyのライブラリってこんな感じで作るんやでというのを知っておくためにCLIとして実装してgemにしてみた。

https://rubygems.org/gems/file_charset_validator

さっきのワンライナーと同じことを以下で行える。

```shell
$ gem install file_charset_validator
$ find path/to/dir -type f | file_charset_validator --encoding UTF_8
```

## CLIを作ってgemにする手順

新しくRubyでCLIを作るのは雛形が用意されていて、以下のコマンドを実行するとディレクトリごと作ってくれる

```shell
$ bundle gem your_gem_name -t -b
# -t ... テストも生成
# -b ... 実行ファイルも生成
```

作ったgemのビルドやローカルへのインストール、公開などもrakeタスクが用意されているのでシュッとできる。

```shell
# gemをビルドする (gemはhogehoge.gemという単一のファイルにまとめられるらしい)
$ bundle exec rake build

# テストを実行する
$ bundle exec rake test

# ローカルにgemをインストールする
$ bundle exec rake install

# gitのリリースタグを打って、gemを公開する
# 事前に https://rubygems.org でアカウントを作り、`$ curl -u YOUR_USERNAME https://rubygems.org/api/v1/api_key.yaml > ~/.gem/credentials` などとしておくとRubyGemsに公開できる。
$ bundle exec rake release
```

コマンドライン引数やヘルプコマンドの出力などはthorに任せてしまうと楽。
作った雛形の your_gem_name.gemspec に `spec.add_dependency "thor"` などと書いて bundle install して、Thorクラスを継承したクラスを実装し、.start を呼べばいい。

## 感想

お作法がわかっていないので作りたいものを作る時間よりもお作法を学ぶ時間がほとんど出会ったが、目的はそれなのでよかった。
RubyGems、(npmに比べて) パッケージの名前空間が比較的空いている気がして、不用意に変な名前を占有してはいけないなという気持ちになった。

おわり。

[^1]: 文字コードの判定は例えば `$nkf --guess` コマンド等でも行えるが、誤検知を避けて「ある文字コードとして解釈できるかを検証する」という目的を果たすツールは見つけられなかったので作った。いろいろなところで必要そうなので見つけられていないだけで多分どこかにあるでしょう。知っている方は教えてください。

