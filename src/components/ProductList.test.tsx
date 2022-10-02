import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import { generateProductOptions } from '../mockData'
import { ProductList } from './ProductList'

const productItems = generateProductOptions()

describe('ProductList', () => {
  it('Should render whole list of products', () => {
    render(<ProductList onItemRemove={() => undefined} onProductClick={() => undefined} productItems={productItems} />)
    const cards = screen.queryAllByTestId('productCard')
    expect(cards.length).toEqual(productItems.length)
  })
})
