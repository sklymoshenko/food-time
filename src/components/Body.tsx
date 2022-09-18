import { Box, Container, useTheme } from '@mui/material'
import { useState } from 'react'
import { ExpireDateSelect } from './ExpireDateSelect'
import { FoodSelect } from './FoodSelect'

const Body = () => {
  const theme = useTheme()
  const [expireDate, setExpireDate] = useState<Date>(new Date())
  const handleExpireDateSelect = (date: Date | null) => {
    setExpireDate(date || new Date())
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
        <FoodSelect />
        <ExpireDateSelect date={expireDate} onDateSelect={handleExpireDateSelect} />
      </Box>
    </Container>
  )
}

export default Body
