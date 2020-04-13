---
title: さくらのVPSとdocker環境構築 
date: 2020-03-28T03:10:34+09:00
tags: さくらのVPS, linux, CentOS, docker
---

PCを整理していて発見したメモを移動して公開する。ファイルのタイムスタンプは2017/12/19。

windows10のPCから、さくらVPSでCentOS7のサーバでdockerを使えるようにする記録。 

windows10にはあらかじめputty,WinSCPがインストールされていることを想定。 
 
##  さくらVPS初期設定 

### OSインストール 

さくらVPS管理画面にて、\> サーバ一覧 \> (設定したいサーバ) \> 各種設定 \> OSインストール 

- OSインストール形式の選択: 標準OS 
- インストールするOSを選んでください: CentOS7 x86_64 
- rootパスワード: 適当に設定 
- スタートアップスクリプト: 利用しない 
 
こんな感じでOSをインストールする。 
 
 
### 一般ユーザーの作成 

まず、さくらVPS管理画面にて、\>サーバ一覧 \>(設定したいサーバ) \> \_コンソール \> \_シリアルコンソール(β)版 から操作。 
 
#### sampleuserの作成

以下、sampleuserは適当に自分の作りたいユーザー名に置き換える。 
```sh 
#rootでログイン 
$ useradd sampleuser #ユーザー作成 
$ passwd sampleuser #パスワード設定 
``` 
 
#### sampleuserがsudoできるようにする 

```sh 
$ visudo 
``` 

visudoで/etc/sudoersを編集する。次の行のコメントアウトを外す。 

``` 
## Allows people in group wheel to run all commands 
#%wheel  ALL=(ALL)       ALL 
↓ 
## Allows people in group wheel to run all commands 
%wheel  ALL=(ALL)       ALL 
``` 

:wqで保存。 

```sh 
$ usermod -aG wheel sampleuser 
#ユーザーをwheelグループに追加 
 
$ exit 
 
$ login #sampleuserでlogin 
 
$ groups #自分の所属groupを確認 
sampleuser wheel 
 
$ sudo su #sampleuserでsudoできるか確認 
[sudo] password for sampleuser:{sampleuserのパスワード} 
 
$ whoami 
root 
``` 
 
#### puttyからsshログインしてみる 

putty.exeを起動。 
- \>Session の Host Name : サーバのipアドレスorドメイン名 
- \>Session の Port : 22 
- \>Conection の Seconds to between keepalives(0 to turn off) : 30    
(30秒ごとにnull文字が送信されることでしばらく操作が無くてもsshセッションが途絶えるのを防ぐ。) 
- \>Session の SavedSessions : sakura_vps_session 
 
Saveし、その後Openでssh接続できるか確認する。 
 
 
### セキュリティの強化 

#### rootのsshログインを止める 

```sh 
$ vim sudo /etc/ssh/sshd_config 
``` 

/etc/ssh/sshd_configを次のように編集する。 

``` 
 #PermitRootLogin yes 
 ↓ 
 PermitRootLogin no 
 
``` 

:wqで保存。 
 
```sh 
$ systemctl restart sshd #設定を反映させる 
``` 
 
#### port番号変更とfirewall設定変更 

sshポートを、標準である22から適当な値に変更する。ここでは2222に変更するが、セキュリティのためには各自適当な値を用いるべき。 

```sh 
$ sudo vim /etc/ssh/sshd_config 
``` 

/etc/ssh/sshd_configを次のように編集する。 

``` 
#Port22 
↓ 
Port2222 
``` 

:wqで保存。 

```sh 
$ systemctl restart sshd #設定を反映させる 
``` 

そして、sshの設定でポートを変更したのち、__firewallの設定も変更しなければならない。。。__ これに気づかず最初つまづいた。 

```sh 
$ cp /usr/lib/firewalld/services/ssh.xml /etc/firewalld/services/ssh.xml 
 
$ sudo vim /etc/firewalld/services/ssh.xml 
``` 

firewallのデフォルト設定は/usr/lib/firewalld/にあるが、これは触らないこと。 
編集する場合は、/etc/firewalld/以下にファイルを置くと、その部分だけシステム設定が上書きされるようになっているので、こちらに書き込む。 
 
/etc/firewalld/services/ssh.xmlを次のように編集する。 

``` 
<port protocol="tcp" port="22"/> 
↓ 
<port protocol="tcp" port="2222"/> 
``` 

:wqで保存。 

```sh 
$ firewall-cmd --reload #設定を反映させる 
``` 

putty.exeでも、ポート設定を変更しておく。 
sakura_vps_session をLoadし、Portを2222に変えてSave。puttyから接続できるか確認しておく。 
 
#### 公開鍵認証 

puttygen.exeで公開鍵、秘密鍵のペアを作成する。 
Generateボタンを押した後、カーソルをウィンドウ上でランダムに動かすと鍵が作成できる。 
Key passphraseを任意のものに設定する。 
適当な場所に Save public key  で sakura_rsa.pub として、Save private key sakura_rsa.ppk として保存。 
 
公開鍵をサーバにアップロードする。 
WinSCPで、新しいサイトから、 
 
- 編集プロトコル:SFTP 
- ホスト名:にサーバのipアドレスorドメイン名 
- ポート番号:2222 
- ユーザ名:sampleuser 
- パスワード:(sampleuserのパスワード) 
 
として保存、ログインする。 
WinSCPでは画面左側にローカルの、画面右側にサーバのファイルが表示されており、ドラッグアンドドロップで相互に転送できる。 
先ほどの 
サーバの/home/sampleuser に先ほどの sakura_rsa.pub (公開鍵だけ)を転送する。 
 
サーバに公開鍵を登録する。 

```sh 
$ login #sampleuserでloginする 
 
$ ssh-keygen -i -f sakura_rsa.pub >> authorized_keys #puttygen.exeで作成した公開鍵の形式を変換 
 
#/home/sampleuser/.ssh/にauthorized_keysを設置し、適切なユーザ権限を与える 
$ mkdir .ssh 
$ chmod 700 .ssh 
$ mv authorized_keys .ssh 
$ chmod 600 .ssh/authorized_keys 
 
$ rm -f sakura_rsa.pub #変換前の公開鍵を削除 
``` 
 
puttyに秘密鍵を登録する。 

putty.exeで sakura_vps_session を Loadし、>Conection>SSH>Auth の Private key fire authentication にsakura_rsa.ppk(秘密鍵)を設定する。 
\>Sessionから 設定の変更をSaveする。 
その後puttyで接続できるか確認。鍵を作成したときのパスフレーズをここで入力する必要があるはず。 
問題なく接続できれば、晴れて公開鍵認証でssh接続できている。 
 
パスワードログインの無効化をする。 
公開鍵認証でログインできても、まだ従来のパスワードによるログインもできるのでセキュリティ向上にはなっていない。従来のパスワードによるログインを無効化する。 

```sh 
$ vim sudo /etc/ssh/sshd_config 
``` 

/etc/ssh/sshd_configを次のように編集する。 

``` 
#PasswordAuthentication yes 
↓ 
PasswordAuthentication no 
``` 

:wqで保存。 
 
```sh 
$ systemctl restart sshd #設定を反映させる 
``` 
 
 
 
## docker構築 

### dockerのインストール 

```sh 
$ sudo yum update 
$ sudo yum install docker-io 
#dockerのインストール 
 
$ sudo systemctl start docker 
#無事インストールされたか確認する 
$ sudo docker info 
#インストールされていればつらつら現在の状況が表示される 
``` 
 
### sampleuserがdockerを使えるようにする 

```sh 
$ sudo groupadd docker #dockerグループの作成 
$ sudo gpasswd -a sampleuser docker 
#sampleuserをdockerグループへ追加 
 
$ sudo systemctl restart docker 
#dockerデーモンの再起動 
 
$ docker info 
#sampleuserで動くことを確認 
``` 
 
### Moby Dockを表示してみる 

```sh 
$ docker run docker/whalesay cowsay 'Congrats!!!' 
``` 
 
## 参考文献 
- CentOSでuserをsudo可能にする:   
https://qiita.com/Esfahan/items/a159753d156d23baf180   
- CentOS7のfirewalldでsshのポート番号を変更する方法:   
https://qiita.com/DQNEO/items/5780d81b2e0af4cc1544   
- PuTTYで公開鍵認証方式でのSSH接続を行う手順まとめ:   
https://qiita.com/sugar_15678/items/55cb79d427b9ec21bac2   
- VPSにdocker環境構築:   
https://qiita.com/t-mimura/items/c206d46f3af771292f89   

