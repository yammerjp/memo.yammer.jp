---
title: "master push をしないために"
date: "2021-11-09T10:31:00+09:00"
tags: [ "git", "GitHub", "Shell" ]
---

昨日、master push をしてしまいましたので懺悔します。

私の会社の開発は、GitHub Enterprise Server上のPull Requestベースで行われており、開発した機能をPull Reqeustにしてレビューを貰ってからマージすることとなっています。
しかしながら昨日の私は、ローカルで作ったcommitをそのままリモートリポジトリのmasterブランチにpushしてしまいました。
masterにマージするだけでは本番にはデプロイされませんが、複数のチームが開発しているリポジトリであり、各方面に迷惑をおかけしました。

私がやらかした後、master pushを防ぐ術を教えていただいたので、以下に記します。

## GitHub上で branch protection を行う

ルールを設定し、force pushできないようにしたり、レビュー必須としたりすることで特定のブランチが不当に変更されることを防ぎます。

(当該リポジトリでは masterブランチに対し branch protection は設定されていましたが、私が管理者権限を持っていたのでpushできてしまいました。)

[ブランチ保護ルールを管理する - GitHub Docs](https://docs.github.com/ja/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/managing-a-branch-protection-rule)

## "include administrators" を有効にする

GitHubのbranch protectionの設定の中で、"include administrators" (管理者を含める) という項目が設定できます。
これにより、管理者権限を持つ人であっても、branch protectionのルールが適用されるようになります。

[保護されたブランチについて - GitHub Docs](https://docs.github.com/ja/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/about-protected-branches#include-administrators)

## ローカルのGit Hooksでmaster/mainへのpushを制限する

gitには特定の操作の前後にスクリプトを実行できるhooksという機能があります。
hooksは、グローバルに有効なスクリプトを指定することもできるので、これを用いて以下のような設定を記述します。

### `~/.gitconfig` にグローバルに有効なhooksのディレクトリを指定

`~/.gitconfig` に以下のように記述することで、そのコンピュータでgitコマンドを実行したとき、常に `~/.config/git/hooks` 以下のhooksが参照されるようになります。

```
[core]
        hooksPath = ~/.config/git/hooks
```

### `~/.config/git/hooks/pre-push` にmaster/mainブランチへのpushを禁止するよう記述 / ローカルフックを呼び出すよう記述

グローバルなhooksに指定されたディレクトリの下に、実行権限をもつ `~/.config/git/hooks/pre-push` というファイルを配置し、以下のような記述をします。

`~/.config/git/hooks`
```bash
#!/bin/bash -e

lines="$(cat)"

# branch protection
# 標準入力 $lines にブランチ名などが渡される
# $lines をもとに、master/mainブランチへのpushであれば、終了コードを1としてpushを中断
function restrict_master_push() {
  echo "$lines" | while read local_ref local_sha1 remote_ref remote_sha1
  do
    if [[ "$remote_ref" = "refs/heads/master" ]]; then
      echo "Do not push to master branch!!!" 1>&2
      exit 1
    fi

    if [[ "${remote_ref}" = "refs/heads/main" ]]; then
      echo "Do not push to main branch!!!" 1>&2
      exit 1
    fi
  done
}

case "$(git config remote.origin.url)" in
  # 自分しか使わないリポジトリなど、master/mainにpushしてよいものはskipするようにする
  "git@github.com:yammer/dotfiles.git" )
    echo 'skip restrict_master_push()' 1>&2
    ;;
  * )
    restrict_master_push
    ;;
esac


# kick local hooks
# グローバルにgit hooksを指定してしまうと、各リポジトリのhooksは実行されない
# そこで、このシェルスクリプト内で、各リポジトリのhooksを読み込んで実行するようにする
git_root=`git rev-parse --show-superproject-working-tree --show-toplevel | head -1`
hook_name=`basename $0`
local_hook="${git_root}/.git/hooks/${hook_name}"

if [ -e $local_hook ]; then
  echo "$lines" | bash "$local_hook" $*
  exit "$?"
fi
```

### `~/.config/git/hooks` 以下の他のhooksにも、ローカルフックを呼び出すよう記述

以下のファイル名の実行ファイルを作成し、スクリプトを記述します。

- `~/.config/git/hooks/applypatch-msg`
- `~/.config/git/hooks/commit-msg`
- `~/.config/git/hooks/fsmonitor-watchman`
- `~/.config/git/hooks/post-update`
- `~/.config/git/hooks/pre-applypatch`
- `~/.config/git/hooks/pre-commit`
- `~/.config/git/hooks/pre-merge-commit`
- `~/.config/git/hooks/pre-rebase`
- `~/.config/git/hooks/pre-receive`
- `~/.config/git/hooks/prepare-commit-msg`
- `~/.config/git/hooks/push-to-checkout`
- `~/.config/git/hooks/update`

```bash
#!/bin/bash -e

lines="$(cat)"

# anything

# kick local hooks
# グローバルにgit hooksを指定してしまうと、各リポジトリのhooksは実行されない
# そこで、このシェルスクリプト内で、各リポジトリのhooksを読み込んで実行するようにする
git_root=`git rev-parse --show-superproject-working-tree --show-toplevel | head -1`
hook_name=`basename $0`
local_hook="${git_root}/.git/hooks/${hook_name}"

if [ -e $local_hook ]; then
  echo "$lines" | bash "$local_hook" $*
  exit "$?"
if
```

