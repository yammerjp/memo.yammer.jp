#!/bin/bash -e

SCRIPT_DIR="$(cd $(dirname $0); pwd)"
cd $SCRIPT_DIR

if [ -z "$1" ]; then
	echo "Usage $0 ARTICLE-ID" 1>&2
	exit 1
fi

hugo new "posts/$1.md"

exec vim "content/posts/$1.md"

