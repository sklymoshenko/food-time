import { Container, ThemeProvider } from '@mui/material'
import { Header } from './components/Header'
import { GlobalStyles } from './styled/GlobalStyles'
import { darkTheme } from './theme'

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <GlobalStyles />
      <Container>
        <div className='App'>
          <Header />
        </div>
      </Container>
    </ThemeProvider>
  )
}

export default App
