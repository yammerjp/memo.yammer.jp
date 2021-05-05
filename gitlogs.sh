#!/bin/bash

rm -rf ".gitlogs"
mkdir -p ".gitlogs/content/posts"
find ./content -type f | while read md_path; do
  git log --format=COMMITIS%cd,%H,%s --date=iso8601-strict "$md_path" > ".gitlogs/$md_path"
done

