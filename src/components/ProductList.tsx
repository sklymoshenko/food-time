import { Box, useTheme } from '@mui/material'
import { Product } from '../types'
import { ProductListItem } from './ProductListItem'

type ProductListProps = {
  productItems: Product[]
  onItemRemove: (product: Product) => void
  onProductClick: (product: Product) => void
}

export const ProductList = ({ productItems, onItemRemove, onProductClick }: ProductListProps) => {
  const theme = useTheme()
  return (
    <Box
      mt={theme.spacing(2)}
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        marginTop: { xs: theme.spacing(2), md: '0' },
        flexWrap: 'wrap',
      }}
    >
      {productItems.map((product, i) => (
        <ProductListItem
          product={product}
          onProductClick={onProductClick}
          onItemRemove={onItemRemove}
          key={i.toString()}
        />
      ))}
    </Box>
  )
}
