import React from 'react'
import { describe, it, expect } from 'vitest'
import { render } from '../testUtils'
import Index from '../../src/pages/index'

describe('Home page', () => {
  /*
  it('matches snapshot', () => {
    const { asFragment } = render(<Index />, {})
    expect(asFragment()).toMatchSnapshot()
  })
  */

  it('check title', () => {
    const posts = [
      {
        title: '記事タイトル',
        date: '',
        slug: '',
        tags: [],
        description: '',
      },
    ]
    const { getByText } = render(<Index allPosts={posts} />, {})
    expect(getByText('記事タイトル')).toBeTruthy()
    expect(() => getByText('記事タイトルほげほげ')).toThrow()
    // fireEvent.click(getByText('Test Button'))
    // expect(window.alert).toHaveBeenCalledWith('With typescript and Jest')
  })
})
