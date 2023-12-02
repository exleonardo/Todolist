import * as React from "react"
import Snackbar from "@mui/material/Snackbar"
import MuiAlert, { AlertProps } from "@mui/material/Alert"
import { useAppSelector } from "state/store"
import { appActions } from "features/CommonActions/ApplicationCommonAction"
import { useActions } from "common/utils/redux-utils"
import { selectError } from "common/components/ErrorSnackBar/ErrorSelector"

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

export default function CustomizedSnackbars() {
  const { setAppError } = useActions(appActions)

  const error = useAppSelector(selectError)
  const isOpen = error !== null

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return
    }
    setAppError({ error: null })
  }

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
      <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
        {error}
      </Alert>
    </Snackbar>
  )
}
