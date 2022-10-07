import { Box, Card, CardContent, Typography, useTheme } from '@mui/material'
import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn'
import { dayDiff, mainTimeFormat } from '../services/time'
import { Product } from '../types'
import { dataColor, indicatorWidth } from '../services/indicatorsConfig'
import { DateTime } from 'luxon'

type ProductListItemProps = {
  product: Product
  onProductClick: (product: Product) => void
  onItemRemove: (product: Product) => void
}

export const ProductListItem = ({ onProductClick, onItemRemove, product }: ProductListItemProps) => {
  const theme = useTheme()
  const isTomorrow = dayDiff(product.date, DateTime.now().plus({ day: 1 }).toISO()) === 0

  return (
    <Card
      data-testid='productCard'
      sx={{
        marginTop: { xs: theme.spacing(1.5) },
        marginRight: { xs: 0, md: theme.spacing(2) },
        position: 'relative',
        overflow: 'visible',
        width: { xs: '100%', md: '400px' },
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
        <CardContent sx={{ width: { xs: '45%', sm: '70%', md: '60%' } }}>
          <Typography color={theme.palette.text.secondary} fontSize={theme.typography.fontSize - 2}>
            Name
          </Typography>
          <Typography
            color={theme.palette.text.primary}
            sx={{
              textTransform: 'capitalize',
              wordBreak: 'break-word',
            }}
          >
            {product.title}
          </Typography>
        </CardContent>
        <CardContent sx={{ width: { xs: '55%', sm: '30%', md: '50%' }, textAlign: 'right' }}>
          <Typography color={theme.palette.text.secondary} fontSize={theme.typography.fontSize - 2}>
            Expiration Date
          </Typography>
          <Typography color={dataColor(product.date, theme.palette)}>
            <span data-testid='productCardDate'>{mainTimeFormat(product.date)}</span>
          </Typography>
          {isTomorrow && (
            <Typography color={theme.palette.grey[600]} fontSize={theme.typography.fontSize - 2}>
              <span data-testid='productCardDateTomorrow'>Tomorrow</span>
            </Typography>
          )}
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
