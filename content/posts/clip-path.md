---
title: "ベジェ曲線で画像を丸っぽくくり抜く (CSS clip-path)"
date: "2021-01-27T11:43:00+09:00"
---

```html
  <img
    src="https://blob.basd4g.net/gather_fishes.jpg"
    style="clip-path:url(#bezier-curve-circle); width:300px;"
  />
  <svg>
    <clipPath id="bezier-curve-circle" clipPathUnits="objectBoundingBox">
    <path d="
      M 0 0.5
      C 0 0.166, 0.166 0, 0.5 0
      S 1 0.166, 1 0.5
      S 0.833 1, 0.5 1
      S 0, 0.833, 0, 0.5
      Z
    "/>
    </clipPath>
  </svg>
```

HTML で上記のように記述すると下記のように丸っぽく画像をくり抜ける

---

 <img
    src="https://blob.basd4g.net/gather_fishes.jpg"
    style="clip-path:url(#bezier-curve-circle); width:300px;"
  />
  <svg>
    <clipPath id="bezier-curve-circle" clipPathUnits="objectBoundingBox">
    <path d="
      M 0 0.5
      C 0 0.166, 0.166 0, 0.5 0
      S 1 0.166, 1 0.5
      S 0.833 1, 0.5 1
      S 0, 0.833, 0, 0.5
      Z
    "/>
    </clipPath>
  </svg>

---

## 参考

- [clip-path - CSS: Cascading Style Sheets | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/clip-path)
- [Paths - SVG: Scalable Vector Graphics | MDN](https://developer.mozilla.org/ja/docs/Web/SVG/Tutorial/Paths)

