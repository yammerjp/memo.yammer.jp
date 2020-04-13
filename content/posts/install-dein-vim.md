---
title: "dein.vimの導入"
date: 2020-03-17T00:13:35+09:00
tags: vim, dein-vim, vim-plugin
---

dotfiles環境下でvimのプラグイン管理に[dein.vim](https://github.com/Shougo/dein.vim)を導入する。

## 前提

- `~/dotfiles`で`.vimrc`を管理している
- dein.vimも`~/dotfiles`で管理する


## 下準備

```sh
$ cd ~/dotfiles
$ mkdir dein
$ touch dein/load.vim
```

## .vimrcに追記

`~/dotfiles/.vimrc`の先頭に次を記載

```.vimrc
"===== dein.vim =====
if filereadable(expand('dein/load.vim'))
    source dein/load.vim
endif
```

## load.vimに記述
 
`~/dotfiles/dein/load.vim`に次の内容を記述

```~/dotfiles/dein/load.vim
"""===== dein.vim ======

"dein.vim dark power
let s:dein_dir = expand('~/dotfiles/dein')
" s:dein_dirとg:rc-dirは一致させること。dein.tomlとdein-lazy.tomlをtouchしている
"
let s:dein_repo_dir = s:dein_dir . '/repos/github.com/Shougo/dein.vim'

set nocompatible
" dein.vim をインストールしていない場合は自動インストール
if !isdirectory(s:dein_repo_dir)
  echo "install dein.vim..."
  execute '!git clone git://github.com/Shougo/dein.vim' s:dein_repo_dir
  execute '!touch -m ' . s:dein_dir . '/dein.toml'
  execute '!touch -m ' . s:dein_dir . '/dein_lazy.toml'
endif
execute 'set runtimepath^=' . s:dein_repo_dir

"---------------------------
" Start dein.vim Settings.
"---------------------------

if dein#load_state(s:dein_dir)
  call dein#begin(s:dein_dir)

  let g:rc_dir    = expand('~/dotfiles/dein')
  let s:toml      = g:rc_dir . '/dein.toml'
  let s:lazy_toml = g:rc_dir . '/dein_lazy.toml'

  " TOMLファイルにpluginを記述
  call dein#load_toml(s:toml,      {'lazy': 0})
  call dein#load_toml(s:lazy_toml, {'lazy': 1})

  call dein#end()
  call dein#save_state()
endif

" 未インストールを確認
if dein#check_install()
  call dein#install()
endif

"---------------------------
" End dein.vim Settings.
"---------------------------
```

## vimを起動

`.vimrc`の記述により、vim起動によりdein.vimがinstallされる。
(ただし、gitが必要)

## 参考

- [basd4g/dotfiles -GitHub](https://github.com/basd4g/dotfiles)
