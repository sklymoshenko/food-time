import { Alert, AlertTitle, Box, Button, Snackbar } from '@mui/material'
import { useRegisterSW } from 'virtual:pwa-register/react'

const SwPropmpt = () => {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // eslint-disable-next-line prefer-template
      console.log('SW Registered: ' + r)
    },
    onRegisterError(error) {
      console.log('SW registration error', error)
    },
  })

  const close = () => {
    setOfflineReady(false)
    setNeedRefresh(false)
  }

  return (
    <div className='ReloadPrompt-container'>
      <Snackbar open={offlineReady || needRefresh} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert className='ReloadPrompt-toast' onClose={() => close()}>
          <div className='ReloadPrompt-message'>
            {offlineReady ? (
              <AlertTitle>App ready to work offline</AlertTitle>
            ) : (
              <AlertTitle>New content available, click on reload button to update.</AlertTitle>
            )}
          </div>
          <Box alignItems='center' justifyContent='flex-end' display='flex'>
            {needRefresh && (
              <Button onClick={() => updateServiceWorker(true)} variant='outlined' color='success'>
                Reload
              </Button>
            )}
          </Box>
        </Alert>
      </Snackbar>
    </div>
  )
}

export default SwPropmpt
