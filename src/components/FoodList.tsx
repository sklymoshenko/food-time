import { Box, Card, CardContent, Typography, useTheme } from '@mui/material'
import { mainTimeFormat } from '../services/timeFormat'
import { FoodOptionType } from './Body'
import { DateTime } from 'luxon'

type FoodListProps = {
  foodItems: FoodOptionType[]
}

const dayDiff = (firstDate: string, secondDate: string): number => {
  const expirationDay = DateTime.fromISO(firstDate).set({ second: 0, minute: 0, hour: 0 })
  const currentDay = DateTime.fromISO(secondDate).set({ second: 0, minute: 0, hour: 0 })
  const diff = expirationDay.diff(currentDay, 'days').toObject().days || 0

  return Math.round(diff)
}

export const FoodList = ({ foodItems }: FoodListProps) => {
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

    return `${100 - percentage}%`
  }

  return (
    <Box
      mt={theme.spacing(2)}
      sx={{ display: 'flex', flexDirection: 'column', marginTop: { xs: theme.spacing(2), md: '0' } }}
    >
      {foodItems.map((food, i) => (
        <Card
          key={i.toString()}
          sx={{
            marginTop: { xs: theme.spacing(1.5) },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <CardContent sx={{ width: { xs: '170px', md: '300px' } }}>
              <Typography color={theme.palette.text.secondary} fontSize={theme.typography.fontSize - 2}>
                Name
              </Typography>
              <Typography color={theme.palette.text.primary}>{food.title}</Typography>
            </CardContent>
            <CardContent sx={{ width: { xs: '130px', md: '300px' } }}>
              <Typography color={theme.palette.text.secondary} fontSize={theme.typography.fontSize - 2}>
                Expiration Date
              </Typography>
              <Typography color={dataColor(food.date)}>{mainTimeFormat(food.date)}</Typography>
            </CardContent>
          </Box>
          <Box
            sx={{ width: indicatorWidth(food.date, food.createdAt), height: '2px', background: dataColor(food.date) }}
          />
        </Card>
      ))}
    </Box>
  )
}
