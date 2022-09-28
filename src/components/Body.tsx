import { Box, Container, useTheme, Button } from '@mui/material'
import { useState } from 'react'
import { generateProductOptions, selectedProductOption } from '../mockData'
import { ExpireDateSelect } from './ExpireDateSelect'
import { ProductList } from './ProductList'
import { ProductSelect } from './ProductSelect'
import SwPropmpt from './SWPrompt'
const productOptions = generateProductOptions()

export type ProductOptionType = {
  id: string
  inputValue?: string
  title: string
  date: string
  createdAt: string
}

const Body = () => {
  const theme = useTheme()
  const [expireDate, setExpireDate] = useState(new Date().toISOString())
  const [product, setProduct] = useState<ProductOptionType | null>(null)
  const [productList, setProductList] = useState(selectedProductOption)

  const handleExpireDateSelect = (date: { toJSDate: () => Date } | null) => {
    // Well idk why but type for date is DateTime luxon object
    if (date !== null && typeof date === 'object') {
      setExpireDate(date.toJSDate().toISOString())
      return
    }

    setExpireDate(new Date().toISOString())
  }

  const handleProductSelect = (newProduct: ProductOptionType | null) => {
    setProduct(newProduct)

    if (newProduct?.date) setExpireDate(newProduct.date)
  }

  const handleProductRemove = (item: ProductOptionType) => {
    setProductList((prevValue) => prevValue.filter((product) => item.id !== product.id))
  }

  const handleProductAdd = () => {
    if (!product) return
    const newProduct: ProductOptionType = {
      ...product,
      id: productList.length.toString(),
      date: expireDate,
    }

    setProductList(() => [newProduct, ...productList])

    setProduct(null)
    setExpireDate(new Date().toISOString())
  }

  const handleProductClick = (product: ProductOptionType) => {
    setProduct(product)
    setExpireDate(product.date)
  }

  return (
    <Container maxWidth='xl'>
      <SwPropmpt />
      <Box
        mt={theme.spacing(2)}
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
        }}
      >
        <ProductSelect product={product} onProductSelect={handleProductSelect} productOptions={productOptions} />
        <ExpireDateSelect date={expireDate} onDateSelect={handleExpireDateSelect} />
      </Box>
      <Box sx={{ width: { xs: '100%', md: '5%' }, marginTop: theme.spacing(2) }}>
        <Button
          variant='contained'
          fullWidth
          color='success'
          sx={{ color: theme.palette.text.primary }}
          disabled={!product}
          onClick={handleProductAdd}
        >
          Add
        </Button>
      </Box>
      <ProductList productItems={productList} onItemRemove={handleProductRemove} onProductClick={handleProductClick} />
    </Container>
  )
}

export default Body
