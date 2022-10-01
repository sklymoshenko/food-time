import { Box, Card, CardContent, Typography, useTheme } from '@mui/material'
import { dayDiff, mainTimeFormat } from '../services/time'
import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn'

import { Product } from '../services/indexDb'

type ProductListProps = {
  productItems: Product[]
  onItemRemove: (product: Product) => void
  onProductClick: (product: Product) => void
}

export type InfoSection = 'expiring' | 'inTime' | 'expired'
export const ExpirationDateRangeEnum: Record<InfoSection, number> = {
  expired: 0,
  expiring: 3,
  inTime: 1000,
}

export const ProductList = ({ productItems, onItemRemove, onProductClick }: ProductListProps) => {
  const theme = useTheme()
  const dataColor = (expDate: string): string => {
    const diffToday = dayDiff(expDate, new Date().toISOString())
    let color = theme.palette.success.dark

    if (diffToday > ExpirationDateRangeEnum.expired && diffToday < ExpirationDateRangeEnum.expiring) {
      color = theme.palette.warning.dark
    }

    if (diffToday < ExpirationDateRangeEnum.expired) {
      color = theme.palette.error.dark
    }

    return color
  }

  const indicatorWidth = (expDate: string, createdAt: string) => {
    const diffToday = dayDiff(expDate, new Date().toISOString())
    const totalDiff = dayDiff(expDate, createdAt)
    const percentage = Math.round((diffToday / totalDiff) * 100)
    let loaded = percentage < 0 ? 0 : percentage

    // If we create option and add product today there will be no loaded bc percentage will be 0
    // So lets set it up like something is hapenning to a 5
    if (loaded === 100 && totalDiff > ExpirationDateRangeEnum.expiring) {
      loaded = loaded - 5
    } else if (loaded === 100 && totalDiff < ExpirationDateRangeEnum.expiring) {
      loaded = 15
    }
    return `${100 - loaded}%`
  }

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
        <Card
          key={i.toString()}
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
              <Typography color={dataColor(product.date)}>{mainTimeFormat(product.date)}</Typography>
            </CardContent>
          </Box>
          <Box
            sx={{
              width: indicatorWidth(product.date, product.createdAt),
              height: '2px',
              background: dataColor(product.date),
            }}
          />
        </Card>
      ))}
    </Box>
  )
}
