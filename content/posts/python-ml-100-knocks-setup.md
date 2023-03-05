---
title: "Python実践機械学習システム100本ノックの準備"
date: "2022-11-15T01:53:00+09:00"
tags: [ "Python", "機械学習", "本" ]
---

[Python実践機械学習システム100本ノック](https://www.amazon.co.jp/Python%E5%AE%9F%E8%B7%B5%E6%A9%9F%E6%A2%B0%E5%AD%A6%E7%BF%92%E3%82%B7%E3%82%B9%E3%83%86%E3%83%A0100%E6%9C%AC%E3%83%8E%E3%83%83%E3%82%AF-%E4%B8%8B%E5%B1%B1%E8%BC%9D%E6%98%8C-ebook/dp/B0928FD1P8/ref=sr_1_1?keywords=Python%E5%AE%9F%E8%B7%B5%E6%A9%9F%E6%A2%B0%E5%AD%A6%E7%BF%92%E3%82%B7%E3%82%B9%E3%83%86%E3%83%A0100%E6%9C%AC%E3%83%8E%E3%83%83%E3%82%AF&qid=1668239148&qu=eyJxc2MiOiIyLjI4IiwicXNhIjoiMS44OSIsInFzcCI6IjEuOTIifQ%3D%3D&s=digital-text&sr=1-1)を手元で動かしながら読んでみている。

Docker環境でJupyter Notebookを動かすサンプルコードがダウンロードできるが、そのままではビルドに失敗するので、requirements.txtにあるバージョンを書き換えるなどして動くように整えた。

```
jupyter==1.0.0
numpy==1.21.0
pandas==1.5.1
openpyxl==3.0.4
scikit-learn==1.1.3
matplotlib==3.3.2
japanize-matplotlib==1.1.2
seaborn==0.11.0
ipywidgets==7.5.1
ipympl==0.5.8
xlrd==1.2.0
```

あわせて、Dockerfileとdocker-compose.ymlをやりやすい形に書き換えた。
ディレクトリ構成は以下のようにしている。

```
.
├── .env
├── .env.example
├── .gitignore
├── Dockerfile
├── Makefile
├── README.md
├── docker-compose.yml
├── requirements.txt
└── src
    └── samples
        ├── 01
        │   ├── 1章_分析に向けた準備を行う10本ノック.ipynb
        │   ├── 1章_分析に向けた準備を行う10本ノック_answer.ipynb
        │   ├── m_area.csv
        │   ├── m_store.csv
        │   ├── tbl_order_202004.csv
        │   ├── tbl_order_202005.csv
        │   └── tbl_order_202006.csv
        ...
```

```Makefile
# Makefile
.PHONY: build-image run build-image:
        bash -c 'docker-compose build --build-arg UID="`id -u`" --build-arg GID="`id -g`"'
run:
        docker-compose up -d
```

```Dockerfile
# Dockerfile
FROM ubuntu:22.04

RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    curl \
    git \
  && rm -rf /var/lib/apt/lists/*

ARG USERNAME=app
ARG GROUPNAME=app
ARG UID=1000
ARG GID=1000

RUN groupadd -g $GID $GROUPNAME && \
  useradd -m -s /bin/bash -u $UID -g $GID $USERNAME

USER $USERNAME
WORKDIR /home/$USERNAME/

ENV PATH $PATH:/home/$USERNAME/.local/bin

COPY ./requirements.txt /home/$USERNAME/requirements.txt
RUN pip3 install -r /home/$USERNAME/requirements.txt

ENV PYTHONIOENCODING utf-8
ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8
```

```yaml
# docker-compose.yml
# docker-compose.yml
version: '3.5'

services:
    jupyter_notebook:
        build:
            context: .
            args:
              - UID:1000
              - GID:1000
              - USERNAME:app
              - GROUPNAME:app
            dockerfile: ./Dockerfile
        volumes:
            - ./src:/home/app/src
        ports:
            - "8888:8888"
        environment:
            TZ: "Asia/Tokyo"
        networks:
            - default
        command: jupyter notebook --ip=0.0.0.0 --port=8888 --allow-root --no-browser --NotebookApp.notebook_dir='/home/app/src' --NotebookApp.token=''
```

本文はまだ最初の方しか試せていないが、読みやすいし、Jupyter Notebook上で試せるのでテンポよく進んでいい感じ。
