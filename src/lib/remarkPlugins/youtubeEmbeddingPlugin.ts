import type { Root, Element } from 'hast'
import { visit } from 'unist-util-visit'

/** @type {import('unified').Plugin<[], import('hast').Root>} */
export function youtubeEmbeddingPlugin() {
  return function (tree: Root) {
    visit(tree, 'element', (node: Element) => {
      if (
        node.tagName === 'a' &&
        typeof node.properties?.href === 'string' &&
        node.properties.href.startsWith('https://www.youtube.com/')
      ) {
        const url = node.properties.href
        const id = url
          ?.split('?')
          .flatMap((s: string) => s.split('&'))
          .find((s: string) => s.startsWith('v='))
          ?.slice(2)
        node.content = undefined
        node.tagName = 'div'
        node.properties = {
          class: 'embed-youtube embed-wrapper',
          style: 'text-align: center;',
        }
        const child: Element = {
          type: 'element',
          tagName: 'iframe',
          properties: {
            class: 'embed-youtube',
            width: '560',
            height: '315',
            src: `https://www.youtube.com/embed/${id}?feature=oembed`,
          },
          children: [],
        }
        node.children = [child]
      }
    })
  }
}
