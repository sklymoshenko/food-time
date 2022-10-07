import { dayDiff } from './time'
import { ExpirationDateRangeEnum, PaletteColors } from '../types'
import { DateTime } from 'luxon'
import { Palette } from '@mui/material'

export const dataColor = (expDate: string, paletteColors: PaletteColors | Palette): string => {
  const diffToday = dayDiff(expDate, DateTime.now().toISO())
  let color = paletteColors.success.dark

  if (diffToday >= ExpirationDateRangeEnum.expired && diffToday <= ExpirationDateRangeEnum.expiring) {
    color = paletteColors.warning.dark
  }

  if (diffToday < ExpirationDateRangeEnum.expired) {
    color = paletteColors.error.dark
  }

  return color
}

export const indicatorWidth = (expDate: string, createdAt: string): string => {
  const totalDiff = dayDiff(expDate, createdAt)
  if (totalDiff < ExpirationDateRangeEnum.expired) return '100%'

  const diffToday = dayDiff(expDate, DateTime.now().toISO())
  if (diffToday < ExpirationDateRangeEnum.expired) return '100%'

  let percentage = Math.round((diffToday / totalDiff) * 100)

  // If we create option and add product today there will be no loaded bc percentage will be 0
  // So lets set it up like something is hapenning to a 5
  if (percentage === 100 && totalDiff > ExpirationDateRangeEnum.expiring) {
    percentage = percentage - 5
  } else if (
    percentage === 100 &&
    totalDiff > ExpirationDateRangeEnum.expired &&
    totalDiff <= ExpirationDateRangeEnum.expiring
  ) {
    percentage = 15
  }
  return `${100 - percentage}%`
}
