import { Box, Card, CardContent, Typography, useTheme } from '@mui/material'
import { mainTimeFormat } from '../services/timeFormat'
import { FoodOptionType } from './Body'
import { DateTime } from 'luxon'

type FoodListProps = {
  foodItems: FoodOptionType[]
}

export const FoodList = ({ foodItems }: FoodListProps) => {
  const theme = useTheme()
  const dateColor = (expDate: string): string => {
    const expirationDay = DateTime.fromISO(expDate).set({ second: 0, minute: 0, hour: 0 })
    const currentDay = DateTime.fromISO(new Date().toISOString()).set({ second: 0, minute: 0, hour: 0 })
    const diff = expirationDay.diff(currentDay, 'days').toObject().days?.toFixed() || 0
    let color = theme.palette.success.dark

    if (diff > 0 && diff < 3) {
      color = theme.palette.warning.dark
    }

    if (diff < 0) {
      color = theme.palette.error.dark
    }

    return color
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
            display: 'flex',
            flexWrap: { xs: 'nowrap', md: 'wrap' },
            marginTop: { xs: theme.spacing(1.5) },
            justifyContent: 'space-between',
          }}
        >
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
            <Typography color={dateColor(food.date!)}>{mainTimeFormat(food.date!)}</Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  )
}
