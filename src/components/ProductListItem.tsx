import { Box, Card, CardContent, Typography, useTheme } from '@mui/material'
import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn'
import { mainTimeFormat } from '../services/time'
import { Product } from '../types'
import { dataColor, indicatorWidth } from '../services/indicatorsConfig'

type ProductListItemProps = {
  product: Product
  onProductClick: (product: Product) => void
  onItemRemove: (product: Product) => void
}

export const ProductListItem = ({ onProductClick, onItemRemove, product }: ProductListItemProps) => {
  const theme = useTheme()
  return (
    <Card
      data-testid='productCard'
      sx={{
        marginTop: { xs: theme.spacing(1.5) },
        marginRight: { xs: 0, md: theme.spacing(2) },
        position: 'relative',
        overflow: 'visible',
        width: { xs: '100', md: '350px' },
      }}
      onClick={() => {
        onProductClick(product)
      }}
    >
      <DoDisturbOnIcon
        data-testid='productCardRemoveIcon'
        sx={{ position: 'absolute', top: '-5px', right: '-5px' }}
        onClick={(e) => {
          e.stopPropagation()
          onItemRemove(product)
        }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <CardContent sx={{ width: { xs: '170px', md: '300px' } }}>
          <Typography color={theme.palette.text.secondary} fontSize={theme.typography.fontSize - 2}>
            Name
          </Typography>
          <Typography color={theme.palette.text.primary} sx={{ textTransform: 'capitalize' }}>
            {product.title}
          </Typography>
        </CardContent>
        <CardContent sx={{ width: { xs: '130px', md: '180px' } }}>
          <Typography color={theme.palette.text.secondary} fontSize={theme.typography.fontSize - 2}>
            Expiration Date
          </Typography>
          <Typography color={dataColor(product.date, theme.palette)}>
            <span data-testid='productCardDate'>{mainTimeFormat(product.date)}</span>
          </Typography>
        </CardContent>
      </Box>
      <Box
        data-testid='productCardLoaderIndicator'
        sx={{
          width: indicatorWidth(product.date, product.createdAt),
          height: '2px',
          background: dataColor(product.date, theme.palette),
        }}
      />
    </Card>
  )
}
