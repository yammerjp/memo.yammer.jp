---
title: "メール送信者認証技術の整理"
date: "2025-07-05T03:52:00+09:00"
tags: [ "mail", "smtp", "spf", "dkim", "dmarc", "bimi", "email-authentication", "dns" ]
---

SPF, DKIM, DMARCをはじめとするメール送信者認証技術のトピックが時々必要になるので、自分用のメモとして書き出しておきます。覚えていないところはRFCを見たりしていますが、記憶の中を書き出しているだけので、間違っているところがあったらご指摘ください。

## メール送信者認証技術はなぜ必要なのか？

### SMTPで送信元を表すのは、IPアドレス、エンベロープFrom、ヘッダFrom

メールは、SMTPというプロトコル上でやり取りされます。この時、送信者側がどのホスト名からの接続か宣言されることとなっており、これがいわゆるエンベロープFromと呼ばれます。SMTPプロトコル上ではメールの内容(メールヘッダ+メールボディ)を合わせてテキストとして送信し、メールヘッダの中には送信者を表すFromのヘッダ(いわゆるヘッダFrom) が書かれています。

### SMTP上でエンベロープFromとヘッダFromを検証する仕組みはない。どのメールを受け取るかは受信者が決める

SMTPのプロトコル上は、エンベロープFromとヘッダFromは特に縛りがなく、何を書いても規格上は問題ないメールとして取り扱われます。これが問題で、メールは送信者が好きに自分の身元を名乗りたい放題のプロトコル[^smtp_supported_from]になっており、送信元のアドレス (=ドメイン) が本当にその人の所有しているものかを確認する術がありません。このような性質から、スパムメールと呼ばれる正当な送信元ではないメールも多数流通し、それに対応するために、インターネット上のメールというエコシステムでは、基本的に受信者が受信するかどうかを決めることでコントロールしている、というふうな構図となっています。

[^smtp_supported_from]: ここでは2025年現在の視点から、現時点でわかりやすく理解するために「名乗りたい放題のプロトコル」と表現していますが、実際にはインターネット技術の発展とともに、現在のメールエコシステムを構成するパーツが一つずつ構成されていったのであって、SMTP自体は、シンプルな文書通信のためのプロトコルであるでしょうし、その成り立ちや技術に対する対する批判等の意味合いは持っていません。ただ、パーツが色々あるので、新米Web技術者が今からキャッチアップするのは、普段メールシステムに馴染みがないとなかなか大変だという感想を持っています。

### 大手の受信者が公開しているポリシーに、送信側は実質的に従う必要がある[^mail_provider_policy]

特に影響力のある大手の受信者(GmailやMicrosoft(outlook.com)、iCloud等)に受信してもらえるよう、送信者側がその基準を満たすようなメールを送る必要性が、昨今高まっています。明確に方針として示されたのが、2024年から適用されている、いわゆる[Gmailガイドライン](https://support.google.com/a/answer/81126?hl=ja)です。Gmailに向けてメールを送る全ての送信者に一定の基準を設け、また大量送信者には、より厳しい基準を設け、満たさないメールは受信拒否すると宣言されました。後述する、メール送信者認証技術 (DMARC=pass) への準拠が求められるようになったことで、メールの送信者、特に大量送信者にはその対応が求められました。また、現在や今後も、大手受信者のポリシー変更があれば、追従する必要があります。

[^mail_provider_policy]: ここでは送信者の視点で「従う必要がある」などと書いていますが、実際には受信側からするとそのような方法でしかメールの確からしさを確認したり、大量受信による負荷を抑制することができませんし、メール全体のエコシステムとしてそのようなポリシーの公開や適用は必要である、と前向きに捉えています。

## 個々のメール送信者認証技術

メールの仕組みに話を戻しましょう。

受信者側が、そのメールに書かれている送信元が正当かどうかを確認する等のための仕組みとして、メール送信者認証技術があります。これが SPF, DKIM, DMARC (そしてBIMI！) などの各種規格です。

### DNSレコードに書かれていることは、ドメインの所有者の意思で書かれているはず

どのプロトコルも基本的に、DNSを信頼の元としています。ドメインの正当な所有者だけがDNSにレコードを登録でき、世界にその情報が正しいと伝えることができるはず、という点が起点となっています。DNSのTXTレコードに書いてあるを信頼し、受信したメールがそれと一致するかを、受信者側で検証することで、メール自体も信頼できるかを判断できるようになっています。

### SPF (passならば、エンベロープFromのドメイン所有者が認めたIPアドレスのサーバから送られたとわかる)
SPFは、次のようなDNSレコードを公開するものです。ドメインの所有者が、メールを送出するサーバのIPアドレスをTXTレコードとして宣言することで、それ以外のメールサーバから送出された場合は不正であると判断できるようになります。SMTPはTCP/IP上で成立していますから、送信元のIPアドレスは通信時にわかるので、それと比較して問題ないかを確認できます。

```
example.com. IN TXT "v=spf1 ip4:192.0.2.100 ~all"
```

ただし、ここで受信者が引くドメインは、エンベロープFromのドメインです。ヘッダFromに書かれた内容は検証されません。一般的なメールクライアントで送信元メールアドレスとして表示されているのはヘッダFromですが、全く違っていても検証されず、SPFはpassしたと判断されます。


### DKIM (passならば、署名したドメインの所有者がそのメール内容を送信したとわかる)

DKIMは、次のようなDNSレコードを公開するものです。ドメインの所有者が、公開鍵を公開します。メール送出時にドメインの所有者(か権限を委譲された者。以下略します)しか知らない秘密鍵でメールの内容に署名することで、署名を検証すれば、ドメインの所有者の送出したメールの内容(ヘッダやボディ) が正しいことを検証できます。

```
default._domainkey.example.com. IN TXT "v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQD3JbLw...（公開鍵の文字列）...AQAB"
```

ただし、ここで署名したドメインは、ヘッダFromやエンベロープFromでなくても良いことになっています。

### DMARC

DMARCは、次のようなDNSレコードを公開するものです。メールの受信者に対して、受信したメールの取り扱い方法を宣言するものです。SPFやDKIMをどの程度厳格に検証すべきか、また検証失敗時にその旨をレポートする先を示しています。

```
_dmarc.example.com. IN TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc-report@example.com; ruf=mailto:dmarc-forensic@example.com; fo=1; adkim=r; aspf=r"
```

DMARCには、SPFやDKIMを組み合わせて、メール送信元の確からしさを判定する基準の一つである「アライメント」を定めています。また、DMARCの基準を満たしていない場合に、それをレポートする仕組みがあります。順に見ていきましょう。

#### アライメント

SPFアライメントはエンベロープFromとヘッダFromが一致している時に、満たしていることとなっています。SPFがpassしている状況下では、送信者として表示されるヘッダFromのドメイン所有者が、そのメールが送出されたメールサーバ(IP)を信頼しているので、その点で確からしいメールだと言えるでしょう。

<iframe class="speakerdeck-iframe" frameborder="0" src="https://speakerdeck.com/player/e47be4bcb39e4c2abdc4ea0ad2588cf4?slide=49" title="実録_マルチテナント環境でのGmailガイドライン対応" allowfullscreen="true" style="border: 0px; background: padding-box rgba(0, 0, 0, 0.1); margin: 0px; padding: 0px; border-radius: 6px; box-shadow: rgba(0, 0, 0, 0.2) 0px 5px 40px; width: 100%; height: auto; aspect-ratio: 560 / 315;" data-ratio="1.7777777777777777"></iframe>

DKIMアライメントは署名ドメインとヘッダFromのドメインが一致している時に満たしていることとなっています。DKIMがpassしている状況下では、これを満たすメールは送信者として表示されるヘッダFromのドメイン所有者がメール本文に署名していることから、その点で確からしいメールだと言えるでしょう。

<iframe class="speakerdeck-iframe" frameborder="0" src="https://speakerdeck.com/player/e47be4bcb39e4c2abdc4ea0ad2588cf4?slide=51" title="実録_マルチテナント環境でのGmailガイドライン対応" allowfullscreen="true" style="border: 0px; background: padding-box rgba(0, 0, 0, 0.1); margin: 0px; padding: 0px; border-radius: 6px; box-shadow: rgba(0, 0, 0, 0.2) 0px 5px 40px; width: 100%; height: auto; aspect-ratio: 560 / 315;" data-ratio="1.7777777777777777"></iframe>

なお、SPFまたはDKIMのいずれかにpassし、かつSPFアライメントもしくはDKIMアライメントのいずれかをpassしているとき、DMARCにpassしたと判定されます

#### ポリシー

DMARCにpassしていないメールがどれくらい流通しているかを、ドメインの所有者が知るために、ポリシーを宣言することとなっています。 `none` , `quarantine` , `reject`  があり、各受信者に、そのポリシーに従ってメールを取り扱うことや、 DMARCをpassしないメールがあったときに、その内容をレポートするメールを送信してほしい旨を宣言します。

送信者としてのポリシーであり、仕組み上受信者が従わなければならないような制約はないですが、成り立ちからして受信者の事情からできてきたものであるからこのようになっていると理解しています。

### BIMI

BIMIは、次のようなDNSレコードを公開するものです。メールの受信者に対して、送信元のブランドロゴを宣言します。

```
default._bimi.example.com. IN TXT "v=BIMI1; l=https://example.com/logo.svg; a=https://example.com/bimi.pem"
```

BIMIは、DMARCのポリシーが `quarantine` 以上であり、かつロゴが VMC (Verified Mark Certificate) と呼ばれる証明書で署名されている必要があります。VMCでの署名を受けるには、各国の機関による商標等の知的財産権の登録が必要となっています。

BIMIがサポートされる環境で、確認されたメールには、送信元を表すロゴが、メールクライアントに表示されます。

---

というわけで、メールを専門に取り扱わないWebアプリケーションエンジニアにとっては、HTTP以外のプロトコルのことを考える時間は珍しいでしょうし、SMTPとそれをもとに構成された多層のメールエコシステムに関する理解は、忘れてしまうと面倒そうなのでメモとして書き出しました。

## メール技術のキャッチアップ

私が2024年や2025年にメールに関する学びを得た書籍とWebサイトを紹介して終わります

- [実務で使える メール技術の教科書](https://www.shoeisha.co.jp/book/detail/9784798183930) ... 2025年現在で、メールに関連する技術を、その分野に詳しくないソフトウェア開発者がゼロから知ろうと思った時に事前知識なく読み始められる丁寧な書籍
- [azumakuniyuki/feb-2024-no-auth-no-entry](https://github.com/azumakuniyuki/feb-2024-no-auth-no-entry) ... Gmailガイドラインをはじめとする、2024年以降の大手メール受信者プロバイダの公開するポリシーを時系列で記録したリポジトリ。過去に公開されていた内容との差分や、特定の事業者に閉じない大手メール受信プロバイダの動向に気づくことができる
- [古い技術について SMTP現代事情つまみ食い](https://speakerdeck.com/azumakuniyuki/gu-iji-shu-nituite-smtpxian-dai-shi-qing-tumamishi-i) ... SPF/DKIM/DMARCの関係性を説明してくれている
- [ISPmail GUIDE](https://workaround.org) ... Postfixの設定や運用として2025年に求められるものを最小範囲で実現し、手元でメールサーバを動かしてみることができる手順を解説したドキュメント。Postfixに関する書籍や入門書は最近見かけておらず、このリポジトリを読み進めながら触るのが結構良さそうという感触を得た。
- [RFC7208: Sender Policy Framework (SPF)](https://datatracker.ietf.org/doc/html/rfc7208) ... SPFのRFC
- [RFC6376: DomainKeys Identified Mail (DKIM) Signatures](https://datatracker.ietf.org/doc/html/rfc6376) ... DKIMのRFC
- [RFC7489: Domain-based Message Authentication, Reporting, and Conformance (DMARC)](https://datatracker.ietf.org/doc/html/rfc7489) ... DMARCのRFC
- [Internet Draft: Brand Indicators for Message Identification (BIMI)](https://datatracker.ietf.org/doc/draft-brand-indicators-for-message-identification/) ... BIMIはまだRFCになっていない
- [Generic IP Warm Up Schedule](https://twilio-cms-prod.s3.amazonaws.com/documents/Generic_IP_Warmup_Schedule.pdf) ... (メール送信者認証技術と直接関連ないが)新しいIPv4アドレスを使ってメールを送るにあたっての具体的なIPウォームアップの指標をSendGridが示してくれている表
