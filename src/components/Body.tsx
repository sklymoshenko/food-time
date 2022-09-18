import { Box, Container, useTheme } from '@mui/material'
import { FoodSelect } from './FoodSelect'

const Body = () => {
  const theme = useTheme()
  return (
    <Container maxWidth='xl'>
      <Box mt={theme.spacing(2)}>
        <FoodSelect />
      </Box>
    </Container>
  )
}

export default Body
