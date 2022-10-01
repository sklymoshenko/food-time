import { Box, Container, useTheme, Button } from '@mui/material'
import { DateTime } from 'luxon'
import { useEffect, useState } from 'react'
import { dbDelete, dbGet, DbIdEnum, dbPut, indexDbInit, Product } from '../services/indexDb'
import { ConfirmDialog } from './ConfirmDialog'
import { ExpireDateSelect } from './ExpireDateSelect'
import { ProductList } from './ProductList'
import { ProductSelect } from './ProductSelect'
import SwPropmpt from './SwPrompt'
import { v4 as uuidv4 } from 'uuid'
const defaultDate = DateTime.now().plus({ day: 1 }).toISO()

const Body = () => {
  const theme = useTheme()
  const [expireDate, setExpireDate] = useState(defaultDate)
  const [product, setProduct] = useState<Product | null>(null)
  const [productList, setProductList] = useState<Product[]>([])
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [productOptionsList, setProductOptionsList] = useState<Product[]>([])
  const [deletingProductOption, setDeletingProductOption] = useState<Product>()

  useEffect(() => {
    indexDbInit(DbIdEnum.products)
    dbGet(DbIdEnum.products, setProductList)

    indexDbInit(DbIdEnum.productsOptions)
    dbGet(DbIdEnum.productsOptions, setProductOptionsList)
  }, [])

  const handleExpireDateSelect = (date: { toJSDate: () => Date } | null) => {
    if (date !== null && typeof date === 'object') {
      setExpireDate(date.toJSDate().toISOString())
      return
    }

    setExpireDate(defaultDate)
  }

  const handleProductSelect = (newProduct: Product | null) => {
    setProduct(newProduct)

    if (newProduct?.date) setExpireDate(newProduct.date)
  }

  const handleProductRemove = (item: Product) => {
    dbDelete(DbIdEnum.products, item.id, setProductList)
  }

  const handleProductAdd = () => {
    if (!product) return
    const newProduct: Product = {
      ...product,
      id: uuidv4(),
      date: expireDate,
    }

    setProduct(null)
    setExpireDate(defaultDate)

    dbPut(DbIdEnum.products, newProduct, setProductList)

    if (!productOptionsList.find(({ id }) => id === newProduct.id)) {
      dbPut(DbIdEnum.productsOptions, newProduct, setProductOptionsList)
    }
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

  const handleProductOptionRemove = (option: Product) => {
    setIsConfirmOpen(true)
    setDeletingProductOption(option)
  }

  const handleProductOptionDeleteCopnfirm = () => {
    if (deletingProductOption) {
      dbDelete(DbIdEnum.productsOptions, deletingProductOption.id, setProductOptionsList)
    }

    setProduct(null)
    setIsConfirmOpen(false)
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
          alignItems: 'center',
        }}
      >
        <ProductSelect
          product={product}
          selectedDate={expireDate}
          onProductSelect={handleProductSelect}
          productOptions={productOptionsList}
          onProductOptionRemove={handleProductOptionRemove}
        />
        <ExpireDateSelect date={expireDate} onDateSelect={handleExpireDateSelect} />
        <Box sx={{ width: { xs: '100%', md: '10%' }, marginTop: { xs: theme.spacing(2), md: 0 } }}>
          <Button
            variant='contained'
            fullWidth
            color='success'
            size='large'
            sx={{ color: theme.palette.text.primary }}
            disabled={!product}
            onClick={handleProductAdd}
          >
            Add
          </Button>
        </Box>
      </Box>
      <ProductList
        productItems={productList}
        onItemRemove={handleProductRemove}
        onProductClick={handleProductClick}
        onProductSort={handleProductSort}
      />
      <ConfirmDialog
        open={isConfirmOpen}
        title={'Delete grocery option'}
        contentText={
          'Are you sure you want to delete it from list? It will be deleted from your database and you wont see this option in your groceries list.'
        }
        handleClose={() => setIsConfirmOpen(false)}
        handleConfirm={handleProductOptionDeleteCopnfirm}
      />
    </Container>
  )
}

export default Body
