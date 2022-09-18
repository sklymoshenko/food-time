import { Card, CardContent, Typography } from '@mui/material'

export const Header = () => (
  <Card>
    <CardContent>
      <Typography sx={{ fontSize: 14 }} color='text.secondary' gutterBottom>
        Word of the Day
      </Typography>
    </CardContent>
  </Card>
)
