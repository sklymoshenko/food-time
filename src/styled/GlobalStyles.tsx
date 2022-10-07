import { GlobalStyles as GlobalStylesMUI } from '@mui/material'

export const GlobalStyles = () =>
  GlobalStylesMUI({
    styles: (theme) => ({
      body: {
        margin: 0,
        padding:
          'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)',
        background: theme.palette.background.default,
        color: theme.palette.text.primary,
      },
    }),
  })
