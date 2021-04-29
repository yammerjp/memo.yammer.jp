---
title: "LoveLabのAPIサーバをAWS EC2上にセットアップする"
date: "2020-08-14T22:55:26+09:00"
tags: [ "AWS", "Shell" ]
---

以下過去の自分用のメモを移動。

昨冬、チーム開発で ToDo 管理の iPhone アプリ LoveLab を開発していた。

[LoveLab API サーバ](https://github.com/basd4g/lovelab-api)は、docker-composeでまとめられている。
AWS の EC2 上で立ち上げるための手順を以下に示す。

## EC2 instance作成後の作業

1. 80番ポートを開放

1. sshでログイン

1. 関係ソフトウェアをinstall

    ```sh
    sudo yum install -y docker
    sudo service docker start
    sudo usermod -a -G docker ec2-user
    sudo docker info
    sudo curl -L https://github.com/docker/compose/releases/download/1.24.1/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    docker-compose --version
    sudo yum install -y git
    ```

1. deploy.sshを入手

    ````sh
    touch deploy.sh
    chmod u+x deploy.sh
    vim deploy.sh
    ````

    ```deploy.sh
    #!/bin/sh
    
    echo "Deploying lovelab API server..."
    
    if [ -d ./lovelab.heroku ]; then
      echo "Stop containers and delete old source files."
      cd lovelab.heroku
      docker-compose down
      cd ../
      rm -rf lovelab.heroku
    fi
    
    echo "Clone source files."
    git clone https://github.com/basd4g/lovelab.heroku.git
    cd lovelab.heroku
    git checkout origin/release
    cp .env.example .env
    echo "docker-compose build"
    docker-compose build --no-cache
    echo "docekr-compose up"
    docker-compose up -d
    ```
