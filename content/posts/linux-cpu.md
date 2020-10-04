---
title: "デスクトップLinuxでCPUの状況を確認する"
date: 2020-05-30T11:46:49+09:00
tag: [ "Linux", "Shell" ]
---

```sh
$ cat /proc/cpuinfo
# CPUの各スレッドごとの情報を含んだファイルを表示する

$ nproc
# CPUのスレッド数(プロセッサの数)を表示する

$ top
# CPU使用率の高い順にプロセスを表示する。定期的に内容は再描画される。
```

参考: [CPU and Linux -  Youtube Satoru Takeuchi](https://youtu.be/etZrDmrD5Q0)
