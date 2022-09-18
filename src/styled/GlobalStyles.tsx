import { GlobalStyles as GlobalStylesMUI } from '@mui/material'

export const GlobalStyles = () =>
  GlobalStylesMUI({
    styles: (theme) => ({
      body: { margin: 0, padding: 0, background: theme.palette.background.default, color: theme.palette.text.primary },
    }),
  })
