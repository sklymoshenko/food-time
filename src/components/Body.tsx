import { Box, Container, useTheme, Button } from '@mui/material'
import { useState } from 'react'
import { generateProductOptions, selectedProductOption } from '../mockData'
import { ExpireDateSelect } from './ExpireDateSelect'
import { ProductList } from './ProductList'
import { ProductSelect } from './ProductSelect'
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

  const handleExpireDateSelect = (date: string | null) => {
    setExpireDate(date || new Date().toISOString())
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
    }

    setProductList(() => [newProduct, ...productList])
  }

  return (
    <Container maxWidth='xl'>
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
      <ProductList productItems={productList} onItemRemove={handleProductRemove} />
    </Container>
  )
}

export default Body
