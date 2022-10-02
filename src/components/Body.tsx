import { Box, Container, useTheme, Button, Checkbox, Typography } from '@mui/material'
import { DateTime } from 'luxon'
import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { dbDelete, dbGet, DbIdEnum, dbPut, indexDbInit, Product } from '../services/indexDb'
import { ConfirmDialog } from './ConfirmDialog'
import { ExpireDateSelect } from './ExpireDateSelect'
import { InfoSection, ProductList } from './ProductList'
import { ProductSelect } from './ProductSelect'
import HourglassTopIcon from '@mui/icons-material/HourglassTop'
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom'
import SwPropmpt from './SwPrompt'
import { v4 as uuidv4 } from 'uuid'
import { dayDiff } from '../services/time'
const defaultDate = DateTime.now().plus({ day: 1 }).toISO()

type ListInfo = Record<InfoSection, Product[]>

const Body = () => {
  const theme = useTheme()
  const [expireDate, setExpireDate] = useState(defaultDate)
  const [product, setProduct] = useState<Product | null>(null)
  const [productList, setProductList] = useState<Product[]>([])
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [productOptionsList, setProductOptionsList] = useState<Product[]>([])
  const [deletingProductOption, setDeletingProductOption] = useState<Product>()

  const listInfo = useMemo(() => {
    return productList.reduce(
      (acc, product) => {
        const diffToday = dayDiff(product.date, new Date().toISOString())
        if (diffToday > 0 && diffToday < 3) {
          acc['expiring'].push(product)
        } else if (diffToday < 0) {
          acc['expired'].push(product)
        } else {
          acc['inTime'].push(product)
        }

        return acc
      },
      { expiring: [], inTime: [], expired: [] } as ListInfo,
    )
  }, [productList])

  useEffect(() => {
    indexDbInit()
    dbGet(DbIdEnum.products, setProductList)
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
    const newProduct = product.id ? { ...product, date: expireDate } : { ...product, id: uuidv4(), date: expireDate }
    dbPut(DbIdEnum.products, newProduct, setProductList)

    if (!productOptionsList.find(({ id }) => id === product.id)) {
      dbPut(DbIdEnum.productsOptions, { ...product, date: expireDate }, setProductOptionsList)
    }

    setProduct(null)
    setExpireDate(defaultDate)
  }

  const handleProductClick = (product: Product) => {
    setProduct(product)
    setExpireDate(product.date)
  }

  const handleProductSort = (e: ChangeEvent<HTMLInputElement>) => {
    const expireTop = e.target.checked
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
      <Box
        display={'flex'}
        justifyContent='space-between'
        width={'100%'}
        marginTop={theme.spacing(2)}
        alignItems='center'
      >
        <Box
          display={'flex'}
          flexDirection={'row'}
          width={{ xs: '70%' }}
          visibility={productList.length ? 'visible' : 'hidden'}
          marginLeft={theme.spacing(1)}
        >
          <Typography fontWeight={'bold'}>{productList.length}</Typography>&nbsp;/&nbsp;
          <Typography fontWeight={'bold'} color={theme.palette.success.dark}>
            {listInfo.inTime.length}
          </Typography>
          &nbsp;/&nbsp;
          <Typography fontWeight={'bold'} color={theme.palette.warning.dark}>
            {listInfo.expiring.length}
          </Typography>
          &nbsp;/&nbsp;
          <Typography fontWeight={'bold'} color={theme.palette.error.dark}>
            {listInfo.expired.length}
          </Typography>
        </Box>
        <Checkbox
          size='small'
          icon={<HourglassTopIcon />}
          checkedIcon={<HourglassBottomIcon />}
          onChange={handleProductSort}
        />
      </Box>
      <ProductList productItems={productList} onItemRemove={handleProductRemove} onProductClick={handleProductClick} />
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
