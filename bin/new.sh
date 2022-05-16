#!/bin/bash

PROCESS_ARG_1="$1"

SCRIPT_DIR="$(cd "$(dirname "$0")"; pwd)"
cd "$SCRIPT_DIR"
cd ..

if command -v gdate; then
  TODAY_ISO8601="$(gdate --iso-8601=second)"
elif command -v date; then
  TODAY_ISO8601="$(date --iso-8601=second)"
else
  echo 'failed!! The command `date` or `gdate` is not found...' 1&>2
  exit 1
fi

TODAY="$(echo "$TODAY_ISO8601"| awk -F T '{ print $1}' | sed 's/-//g')"

if [ "$PROCESS_ARG_1" == "" ]; then
  NEW_ARTICLE_TITLE="$TODAY"
else
  NEW_ARTICLE_TITLE="$PROCESS_ARG_1"
fi

NEW_ARTICLE_PATH="content/posts/$NEW_ARTICLE_TITLE.md"

if [ -e "$NEW_ARTICLE_PATH" ]; then
  echo "$NEW_ARTICLE_PATH is already exists..." 1>&2
  exit
fi

cat <<-EOF > "$NEW_ARTICLE_PATH"
---
title: "$NEW_ARTICLE_TITLE"
date: "$TODAY_ISO8601"
tags: [ "日記" ]
---

日記。

EOF

exec nvim "$NEW_ARTICLE_PATH"
