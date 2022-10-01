import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'

type ConfirmDialogProps = {
  open: boolean
  handleClose: () => void
  handleConfirm: () => void
  title?: string
  contentText?: string
}

export const ConfirmDialog = ({ open, handleClose, handleConfirm, title, contentText }: ConfirmDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      {title && <DialogTitle id='alert-dialog-title'>{title}</DialogTitle>}
      {contentText && (
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>{contentText}</DialogContentText>
        </DialogContent>
      )}
      <DialogActions>
        <Button onClick={handleClose} color='success'>
          Cancel
        </Button>
        <Button onClick={handleConfirm} autoFocus color='error'>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  )
}
