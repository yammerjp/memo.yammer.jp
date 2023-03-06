import type { Root, Element, RootContent } from 'hast'
import { visit } from 'unist-util-visit'
import { fromHtml } from 'hast-util-from-html'

/** @type {import('unified').Plugin<[], import('hast').Root>} */
export function twitterEmbeddingPlugin() {
  return async function (tree: Root) {
    const nodes: Element[] = []
    visit(tree, 'element', (node: Element) => {
      if (
        node.tagName === 'a' &&
        node.properties &&
        typeof node?.properties?.href === 'string' &&
        node.properties.href.startsWith('https://twitter.com/') &&
        node.children.length === 1 &&
        node.children[0].type === 'text' &&
        node.children[0].value === node.properties.href
      ) {
        nodes.push(node)
      }
    })

    await Promise.all(
      nodes.map(async (node: Element) => {
        const url = node?.properties?.href
        if (typeof url !== 'string') {
          return
        }
        const json = await fetch('https://publish.twitter.com/oembed?' + new URLSearchParams({ url })).then((res) =>
          res.json(),
        )
        const tree = fromHtml(json?.html, { fragment: true })
        if (tree.children.length === 0) {
          return
        }
        const elm = tree.children[0] as Element
        elm.children = elm.children.filter((elm) => !(elm.type === 'element' && elm.tagName === 'script'))
        ;(Object.keys(elm) as any).forEach((key: any) => {
          ;(node as any)[key] = (elm as any)[key]
        })
        //   (Object.keys(elm) as (keyof RootContent & Element)).forEach((key: keyof RootContent & Element) => { node[key] = elm[key] });
      }),
    )
  }
}
