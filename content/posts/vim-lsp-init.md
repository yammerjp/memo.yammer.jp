---
title: "vim-lspを使った、Vim上でのTypeScript(JavaScript)の補完の実現"
date: "2020-04-01T17:37:46+09:00"
tags: [ "Vim", "LSP", "TypeScript", "JavaScript" ]
---


## LSPとは

[LSP(Language Server Protocol)](https://github.com/Microsoft/language-server-protocol)とは、IDEと言語サーバとの通信用プロトコル。

IDEやテキストエディタが補完やコードジャンプなどの様々な機能を実現するために、以前はIDEやエディタのプラグイン内に内包されていた機能を、言語ごとにLanguage Serverとして切り出す。

これにより言語補完部分の製作はLanguage Serverさえ作ってしまえばたくさんのIDE(エディタ)に対応できるし、IDE(エディタ)開発側も、LSPにさえ対応してしまえば各言語への対応を独自実装しなくて済む。

2016年6月にMicrosoftが発表したらしい。

参考: [language server protocolについて (前編) - Qiita](https://qiita.com/atsushieno/items/ce31df9bd88e98eec5c4)


## やること

今回はTypeScript,JavaScript用のLanguage Serverをインストールし、これをvim-lspにつないでvim上でLanguage Serverの支援が得られるようにする。

( [vim-lsp](https://github.com/prabirshrestha/vim-lsp)はvimでLanguage Serverを利用できるようにするプラグイン )

## 環境

- macOS Mojave(10.14.6)
- VIM 8.2  Compiled by Homebrew
- dein.vimでプラグイン管理

Vim8上で、dein.vimにプラグインを読み込ませる。

## 手順

1. typescript-language-serverをインストールする

```shell
$ npm install -g typescript typescript-language-server
# または
$ yarn global add typescript typescript-language-server
```

typescript-language-serverはJavaScriptのLanguage Serverとしても動く

2. 各種vimプラグインを入れる

dein.tomlに以下の記述を追記

```toml
# dein.toml

#========== vim-lsp とその関連プラグイン ==========
#vim-lspとLanguage Serverの連携に必要なプラグイン群
[[plugins]]
repo = 'prabirshrestha/async.vim'
[[plugins]]
repo = 'prabirshrestha/asyncomplete.vim'
[[plugins]]
repo = 'prabirshrestha/asyncomplete-lsp.vim'

# 事前にnpm install -g typescript typescript-language-server 
[[plugins]]
repo = 'prabirshrestha/vim-lsp'
hook_add = '''
" TypeScript, JavaScript
if executable('typescript-language-server')
    au User lsp_setup call lsp#register_server({
        \ 'name': 'typescript-language-server',
        \ 'cmd': {server_info->[&shell, &shellcmdflag, 'typescript-language-server --stdio']},
        \ 'root_uri':{server_info->lsp#utils#path_to_uri(lsp#utils#find_nearest_parent_file_directory(lsp#utils#get_buffer_path(), 'package.json'))},
"       \ 'root_uri':{server_info->lsp#utils#path_to_uri(lsp#utils#find_nearest_parent_file_directory(lsp#utils#get_buffer_path(), 'tsconfig.json'))},
        \ 'whitelist': ['typescript', 'typescript.tsx', 'javascript', 'javascript.jsx'],
        \ })
endif

" 他言語サーバの読み込みはここに挿入
'''

#vim-lspのキーバインドを設定
後で書く
```

3. vimを起動

```shell
$ vim
```

