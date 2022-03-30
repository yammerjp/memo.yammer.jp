---
title: "Web Components (ShadowDOM) でもページ内リンクをしたい"
date: "2022-03-31T13:01:55+09:00"
tags: [ "HTML", "WebComponents" ]
---

HTMLではページ内リンクができる。
id属性ないしname属性で指定した文字列を `#` [^1] の後ろにつけてリンク先のパスとして指定すると、当該の要素が画面上部に来るようにスクロールする。

```html
<p id="content">
  hello!
</p>

<p style="height: 2000px; background-color: red;">
  blank
</p>

<a href="#content">
  「hello!」へ飛ぶ
</a>
```

このページ内リンクをShadowDOM内の要素からShadowDOM内にむけて行いたいとき、そのままではできない。
同じような動きを実現する方法として、クリックイベントをもとにShadowDOMの中の要素を探してJavaScriptによってスクロールする動作を実装してみた。

```javascript
const eventListener = (event: Event) => {
  const element = event.target as HTMLElement
  if (element.tagName !== 'A') {
    return true
  }
  const href = element.getAttribute('href') ?? ''
  if (!/^#/.test(href)) {
    return true
  }
  const anchorName = href.substring(1)
  const theNameElements = shadowRoot.querySelectorAll(`[name=${anchorName}], #${anchorName}`)
  if (theNameElements.length > 0) {
    theNameElements[0].scrollIntoView()
    event.preventDefault()
    return false
  }
  return true
}
shadowRoot.addEventListener('click', eventListener)
```

このブログの記事の本文はいま本文用のCSSのスコープを狭める実装の一つとしてShadowDOMに包むようにしていて、上記のようなコードを書くことでページ内リンクのスクロールを実現している。
単純な実装なので何か考慮できていない場合をみつけたら教えていただけると嬉しい。

実装: https://github.com/yammerjp/memo.yammer.jp/blob/7bed6bc062217d7c7d16ab0a39821987e3dd3f45/src/components/article.tsx#L8-35

[^1]: ちなみにこの `#` を使ったページ内の特定の要素を表す機能は[HTMLの仕様書](https://html.spec.whatwg.org/multipage/browsing-the-web.html#scroll-to-fragid)内ではフラグメントと呼ばれているらしい。
