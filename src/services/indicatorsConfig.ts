import { dayDiff } from './time'
import { ExpirationDateRangeEnum } from '../types'
import { Palette } from '@mui/material'

export const dataColor = (expDate: string, palette: Palette): string => {
  const diffToday = dayDiff(expDate, new Date().toISOString())
  let color = palette.success.dark

  if (diffToday > ExpirationDateRangeEnum.expired && diffToday < ExpirationDateRangeEnum.expiring) {
    color = palette.warning.dark
  }

  if (diffToday < ExpirationDateRangeEnum.expired) {
    color = palette.error.dark
  }

  return color
}

export const indicatorWidth = (expDate: string, createdAt: string): string => {
  const diffToday = dayDiff(expDate, new Date().toISOString())
  const totalDiff = dayDiff(expDate, createdAt)
  if (totalDiff < ExpirationDateRangeEnum.expired) return '100%'
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
