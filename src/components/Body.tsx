import { Box, Container, useTheme, Button } from '@mui/material'
import { DateTime } from 'luxon'
import { useEffect, useState } from 'react'
import { generateProductOptions } from '../mockData'
import { dbDelete, dbGet, dbPut, indexDbInit, Product } from '../services/indexDb'
import { ExpireDateSelect } from './ExpireDateSelect'
import { ProductList } from './ProductList'
import { ProductSelect } from './ProductSelect'
import SwPropmpt from './SwPrompt'
const productOptions = generateProductOptions()

const Body = () => {
  const theme = useTheme()
  const [expireDate, setExpireDate] = useState(new Date().toISOString())
  const [product, setProduct] = useState<Product | null>(null)
  const [productList, setProductList] = useState<Product[]>([])

  useEffect(() => {
    indexDbInit()
    dbGet(setProductList)
  }, [])

  const handleExpireDateSelect = (date: { toJSDate: () => Date } | null) => {
    // Well idk why but type for date is DateTime luxon object
    if (date !== null && typeof date === 'object') {
      setExpireDate(date.toJSDate().toISOString())
      return
    }

    setExpireDate(new Date().toISOString())
  }

  const handleProductSelect = (newProduct: Product | null) => {
    setProduct(newProduct)

    if (newProduct?.date) setExpireDate(newProduct.date)
  }

  const handleProductRemove = (item: Product) => {
    dbDelete(item.id, setProductList)
  }

  const handleProductAdd = () => {
    if (!product) return
    const newProduct: Product = {
      ...product,
      id: productList.length.toString(),
      date: expireDate,
    }

    setProduct(null)
    setExpireDate(new Date().toISOString())
    dbPut(newProduct, setProductList)
  }

  const handleProductClick = (product: Product) => {
    setProduct(product)
    setExpireDate(product.date)
  }

  const handleProductSort = (expireTop: boolean) => {
    const sortedProducts = productList.sort((a, b) => {
      const aDate = DateTime.fromISO(a.date).toMillis()
      const bDate = DateTime.fromISO(b.date).toMillis()
      return expireTop ? bDate - aDate : aDate - bDate
    })

    setProductList(() => [...sortedProducts])
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
      <ProductList
        productItems={productList}
        onItemRemove={handleProductRemove}
        onProductClick={handleProductClick}
        onProductSort={handleProductSort}
      />
    </Container>
  )
}

export default Body
