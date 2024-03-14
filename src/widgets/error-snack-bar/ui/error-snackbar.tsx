import Snackbar from '@mui/material/Snackbar'
import { Alert } from '@/features/alert'
import { useErrorSnackbar } from '@/widgets/error-snack-bar/hooks/useErrorSnackbar'

export default function CustomizedSnackbars() {
  const { isOpen, handleClose, error } = useErrorSnackbar()

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
        {error}
      </Alert>
    </Snackbar>
  )
}
