import { ChangeEvent } from 'react'
import { Box, Card, CardContent, Checkbox, Typography, useTheme } from '@mui/material'
import { mainTimeFormat } from '../services/timeFormat'
import { ProductOptionType } from './Body'
import { DateTime } from 'luxon'
import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn'
import HourglassTopIcon from '@mui/icons-material/HourglassTop'
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom'

type ProductListProps = {
  productItems: ProductOptionType[]
  onItemRemove: (product: ProductOptionType) => void
  onProductClick: (product: ProductOptionType) => void
  onProductSort: (isSort: boolean) => void
}

const dayDiff = (firstDate: string, secondDate: string): number => {
  const expirationDay = DateTime.fromISO(firstDate).set({ second: 0, minute: 0, hour: 0 })
  const currentDay = DateTime.fromISO(secondDate).set({ second: 0, minute: 0, hour: 0 })
  const diff = expirationDay.diff(currentDay, 'days').toObject().days || 0

  return Math.round(diff)
}

export const ProductList = ({ productItems, onItemRemove, onProductClick, onProductSort }: ProductListProps) => {
  const theme = useTheme()
  const dataColor = (expDate: string): string => {
    const diffToday = dayDiff(expDate, new Date().toISOString())
    let color = theme.palette.success.dark

    if (diffToday > 0 && diffToday < 3) {
      color = theme.palette.warning.dark
    }

    if (diffToday < 0) {
      color = theme.palette.error.dark
    }

    return color
  }

  const indicatorWidth = (expDate: string, createdAt: string) => {
    const diffToday = dayDiff(expDate, new Date().toISOString())
    const totalDiff = dayDiff(expDate, createdAt)
    const percentage = Math.round((diffToday / totalDiff) * 100)
    const loaded = percentage < 0 ? 0 : percentage
    return `${100 - loaded}%`
  }

  const handleSort = (event: ChangeEvent<HTMLInputElement>) => {
    onProductSort(event.target.checked)
  }

  return (
    <Box
      mt={theme.spacing(2)}
      sx={{ display: 'flex', flexDirection: 'column', marginTop: { xs: theme.spacing(2), md: '0' } }}
    >
      <Checkbox size='small' icon={<HourglassTopIcon />} checkedIcon={<HourglassBottomIcon />} onChange={handleSort} />
      {productItems.map((product, i) => (
        <Card
          key={i.toString()}
          sx={{
            marginTop: { xs: theme.spacing(1.5) },
            position: 'relative',
            overflow: 'visible',
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
              <Typography color={theme.palette.text.primary}>{product.title}</Typography>
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
