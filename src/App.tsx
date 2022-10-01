import { ThemeProvider } from '@mui/material'
import Header from './components/Header'
import Body from './components/Body'
import { GlobalStyles } from './styled/GlobalStyles'
import { darkTheme } from './theme'
import CssBaseline from '@mui/material/CssBaseline'
import { permissions } from './services/notifications'

const App = () => {
  permissions()

  return (
    <ThemeProvider theme={darkTheme}>
      <GlobalStyles />
      <CssBaseline />
      <div className='App'>
        <Header />
        <Body />
      </div>
    </ThemeProvider>
  )
}

export default App
