import { Alert } from '@/features/alert'
import { useErrorSnackbar } from '@/widgets/error-snack-bar/hooks/useErrorSnackbar'
import Snackbar from '@mui/material/Snackbar'

export default function CustomizedSnackbars() {
  const { error, handleClose, isOpen } = useErrorSnackbar()

  return (
    <Snackbar
      anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
      autoHideDuration={3000}
      onClose={handleClose}
      open={isOpen}
    >
      <Alert onClose={handleClose} severity={'error'} sx={{ width: '100%' }}>
        {error}
      </Alert>
    </Snackbar>
  )
}
