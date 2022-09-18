import { Box, Container, useTheme } from '@mui/material'
import { useState } from 'react'
import { selectedFoodOption } from '../mockData'
import { ExpireDateSelect } from './ExpireDateSelect'
import { FoodList } from './FoodList'
import { FoodSelect } from './FoodSelect'

export type FoodOptionType = {
  inputValue?: string
  title: string
  date?: string
}

const Body = () => {
  const theme = useTheme()
  const [expireDate, setExpireDate] = useState(new Date().toISOString())
  const [food, setFood] = useState<FoodOptionType | null>(null)
  const handleExpireDateSelect = (date: string | null) => {
    setExpireDate(date || new Date().toISOString())
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
      <FoodList foodItems={selectedFoodOption} />
    </Container>
  )
}

export default Body
