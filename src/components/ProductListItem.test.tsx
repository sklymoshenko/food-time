import { describe, it, expect, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'

import { generateProductOptions } from '../mockData'
import { ProductListItem } from './ProductListItem'
import { mainTimeFormat } from '../services/time'
import { Product } from '../types'

const productItems = generateProductOptions()

describe('ProductListItem', () => {
  let product: Product
  beforeEach(() => {
    product = JSON.parse(JSON.stringify(productItems[0]))
  })

  it('Product should have title', () => {
    render(<ProductListItem onItemRemove={() => undefined} onProductClick={() => undefined} product={product} />)

    const title = screen.getByText(product.title)
    expect(title).toBeInTheDocument()
  })

  it('Product should have expiration date', () => {
    render(<ProductListItem onItemRemove={() => undefined} onProductClick={() => undefined} product={product} />)
    const expirationDate = screen.getByTestId('productCardDate')
    expect(expirationDate).toBeInTheDocument()
  })

  it('Product should have expiration date correct formatted', () => {
    render(<ProductListItem onItemRemove={() => undefined} onProductClick={() => undefined} product={product} />)
    const expirationDate = screen.getByTestId('productCardDate').innerHTML
    expect(expirationDate).toEqual(mainTimeFormat(product.date))
  })

  it('Product should have loader indicator', () => {
    render(<ProductListItem onItemRemove={() => undefined} onProductClick={() => undefined} product={product} />)
    const loaderIndicator = screen.queryByTestId('productCardLoaderIndicator')
    expect(loaderIndicator).toBeInTheDocument()
  })

  it('Should call click event when product is clicked', () => {
    const handleClick = vi.fn(() => 0)
    render(<ProductListItem onItemRemove={() => undefined} onProductClick={handleClick} product={product} />)
    const item = screen.queryByTestId('productCard')

    fireEvent(
      item!,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    )

    expect(handleClick).toHaveBeenCalled()
  })

  it('Should call click event when remove icon is clicked', () => {
    const handleClick = vi.fn(() => 0)
    render(<ProductListItem onItemRemove={handleClick} onProductClick={() => undefined} product={product} />)
    const item = screen.queryByTestId('productCardRemoveIcon')

    fireEvent(
      item!,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    )

    expect(handleClick).toHaveBeenCalled()
  })
})
