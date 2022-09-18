import { Box, Container, useTheme } from '@mui/material'
import { useState } from 'react'
import { ExpireDateSelect } from './ExpireDateSelect'
import { FoodOptionType, FoodSelect } from './FoodSelect'

const Body = () => {
  const theme = useTheme()
  const [expireDate, setExpireDate] = useState(new Date())
  const [food, setFood] = useState<FoodOptionType | null>(null)
  const handleExpireDateSelect = (date: Date | null) => {
    setExpireDate(date || new Date())
  }
  const handleFoodSelect = (newFood: FoodOptionType | null) => {
    setFood(newFood)

    if (newFood?.date) setExpireDate(newFood.date)
  }

  return (
    <Container maxWidth='xl'>
      <Box
        mt={theme.spacing(2)}
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
        }}
      >
        <FoodSelect food={food} onFoodSelect={handleFoodSelect} />
        <ExpireDateSelect date={expireDate} onDateSelect={handleExpireDateSelect} />
      </Box>
    </Container>
  )
}

export default Body
