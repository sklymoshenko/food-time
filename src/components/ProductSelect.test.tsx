import { describe, it, expect, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'

import { generateProductOptions } from '../mockData'
import { filterOptions, getOptionLabel, onSearchChange, ProductSelect, SelectOption } from './ProductSelect'
import { Product } from '../types'
import { DateTime } from 'luxon'
import { v4 as uuidv4 } from 'uuid'

const productItems = generateProductOptions()

describe('ProductSelect', () => {
  let product: Product
  let productOptions: Product[]
  beforeEach(() => {
    product = JSON.parse(JSON.stringify(productItems[0]))
    productOptions = JSON.parse(JSON.stringify(productItems))
  })

  it('Should render select', () => {
    render(
      <ProductSelect
        onProductOptionRemove={() => undefined}
        onProductSelect={() => undefined}
        product={product}
        productOptions={productOptions}
        selectedDate={new Date().toISOString()}
      />,
    )
    const select = screen.queryByTestId('productSelect')
    expect(select).toBeInTheDocument()
  })

  it('Should render select with correct placeholder when no product is selected', () => {
    render(
      <ProductSelect
        onProductOptionRemove={() => undefined}
        onProductSelect={() => undefined}
        product={null}
        productOptions={productOptions}
        selectedDate={new Date().toISOString()}
      />,
    )
    const placeholderText = 'Grocery name'
    const input: HTMLInputElement = screen.getByLabelText(placeholderText)
    expect(input).toBeInTheDocument()

    expect(input.value).toBe('')
  })

  it('Should render select with product name when product is selected', () => {
    render(
      <ProductSelect
        onProductOptionRemove={() => undefined}
        onProductSelect={() => undefined}
        product={product}
        productOptions={productOptions}
        selectedDate={new Date().toISOString()}
      />,
    )
    const input: HTMLInputElement = screen.getByLabelText('Grocery name')

    expect(input.value).toBe(product.title)
  })

  describe('Selected Option', () => {
    it('Renders option for autocomplete', () => {
      render(<SelectOption props={{}} product={product} onRemoveOption={() => undefined} />)

      const option = screen.getByText(product.title)
      expect(option).toBeInTheDocument()
    })

    it('Render option with title and remove button', () => {
      render(<SelectOption props={{}} product={product} onRemoveOption={() => undefined} />)
      const option = screen.getByText(product.title)
      expect(option).toBeInTheDocument()

      const removeButton = screen.queryByTestId('optionRemoveButton')

      expect(removeButton).toBeInTheDocument()
    })

    it('Renders option with title and no history for "Add" option', () => {
      const addOption = { ...product, title: `Add "${product.title}"` }
      render(<SelectOption props={{}} product={addOption} onRemoveOption={() => undefined} />)

      const option = screen.getByText(addOption.title)
      expect(option).toBeInTheDocument()

      const optionWithHistory = screen.queryByText('History')
      expect(optionWithHistory).not.toBeInTheDocument()
    })

    it('Renders option without remove button', () => {
      const addOption = { ...product, title: `Add "${product.title}"` }
      render(<SelectOption props={{}} product={addOption} onRemoveOption={() => undefined} />)

      const option = screen.getByText(addOption.title)
      expect(option).toBeInTheDocument()

      const removeButton = screen.queryByTestId('optionRemoveButton')
      expect(removeButton).not.toBeInTheDocument()
    })

    it('Call on remove option when clear button is clicked', () => {
      const onRemoveOption = vi.fn()
      render(<SelectOption props={{}} product={product} onRemoveOption={onRemoveOption} />)

      const removeButton = screen.queryByTestId('optionRemoveButton')

      fireEvent(
        removeButton!,
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        }),
      )

      expect(onRemoveOption).toHaveBeenCalled()
      expect(onRemoveOption).toHaveBeenCalledWith(product)
    })
  })

  describe('OnSearchChange', () => {
    it('Calls onProductSelect with new product when adding grocery from string', () => {
      const onProductSelect = vi.fn()
      const title = 'Some new food'
      const date = DateTime.now().plus({ day: 10 }).toISODate()
      const id = uuidv4()

      onSearchChange(title, onProductSelect, id, date)

      expect(onProductSelect).toHaveBeenCalledOnce()
      expect(onProductSelect).toHaveBeenCalledWith({ id, title, date, createdAt: DateTime.now().toISODate() })
    })

    it('Rewrite title and id when there is some input value but select "Add" option from string', () => {
      const onProductSelect = vi.fn()
      const inputValue = 'food'

      const newProduct: Product = {
        title: "Add 'food'",
        inputValue,
        date: DateTime.now().plus({ day: 10 }).toISODate(),
        id: '',
        createdAt: DateTime.now().toISODate(),
      }

      onSearchChange(newProduct, onProductSelect)

      expect(onProductSelect).toHaveBeenCalledOnce()
      expect(onProductSelect).toHaveBeenCalledWith({ ...newProduct, title: inputValue })
    })

    it('Takes selected saved product option as it is when no input value without id', () => {
      const onProductSelect = vi.fn()

      const newProduct: Product = {
        title: "Add 'food'",
        date: DateTime.now().plus({ day: 10 }).toISODate(),
        id: '',
        createdAt: DateTime.now().toISODate(),
      }

      onSearchChange(newProduct, onProductSelect)

      expect(onProductSelect).toHaveBeenCalledOnce()
      expect(onProductSelect).toHaveBeenCalledWith(newProduct)
    })
  })

  describe('Filter options', () => {
    it('Suggest adding new option if product isnt found fully', () => {
      const inputValue = product.title.slice(0, 3) // -> 'The'
      const newFilteredOptions = filterOptions(
        productOptions,
        { inputValue, getOptionLabel: (option) => option.title },
        DateTime.now().toISODate(),
      )

      const hasAddOption = newFilteredOptions[newFilteredOptions.length - 1].title.startsWith('Add')
      expect(hasAddOption).toBeTruthy()
    })

    it('Doesnt suggest adding new option if no input value', () => {
      const inputValue = ''
      const newFilteredOptions = filterOptions(
        productOptions,
        { inputValue, getOptionLabel: (option) => option.title },
        DateTime.now().toISODate(),
      )

      const hasAddOption = newFilteredOptions[newFilteredOptions.length - 1].title.startsWith('Add')
      expect(hasAddOption).not.toBeTruthy()
    })

    it('Doesnt suggest adding new option if product is found fully', () => {
      const inputValue = product.title // -> 'The Shawshank Redemption'
      const newFilteredOptions = filterOptions(
        productOptions,
        { inputValue, getOptionLabel: (option) => option.title },
        DateTime.now().toISODate(),
      )

      const hasAddOption = newFilteredOptions[newFilteredOptions.length - 1].title.startsWith('Add')
      expect(hasAddOption).toBeFalsy()
    })
  })

  describe('Get option label', () => {
    it('Return input value string when added', () => {
      const inputValue = 'Some new product'
      const optionLabel = getOptionLabel(inputValue)

      expect(optionLabel).toEqual(inputValue)
    })

    it('Return options option inputValue if exists', () => {
      const inputValue = 'Some input value'
      const optionLabel = getOptionLabel(product)

      expect(optionLabel).toEqual(product.title)

      const newProduct = { ...product, inputValue }
      const newOptionLabel = getOptionLabel(newProduct)
      expect(newOptionLabel).toEqual(inputValue)
    })

    it('Return options title', () => {
      const inputValue = product
      const optionLabel = getOptionLabel(inputValue)

      expect(optionLabel).toEqual(inputValue.title)
    })
  })
})
