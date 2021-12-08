#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "$0")"; pwd)"
cd "$SCRIPT_DIR"
cd ..

TODAY_ISO8601="$(gdate --iso-8601=second)"
TODAY="$(echo "$TODAY_ISO8601"| awk -F T '{ print $1}' | sed 's/-//g')"
NEW_ARTICLE_PATH="content/posts/$TODAY.md"

if [ -e "$NEW_ARTICLE_PATH" ]; then
  echo "$NEW_ARTICLE_PATH is already exists..." 1>&2
  exit
fi

cat <<-EOF > "$NEW_ARTICLE_PATH"
---
title: "$TODAY"
date: "$TODAY_ISO8601"
tags: [ "日記" ]
---

日記。

EOF

exec vim "$NEW_ARTICLE_PATH"
