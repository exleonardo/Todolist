import { useActions } from '@/utils/redux-utils'
import { appActions } from '@/common/common-actions/application-common-action'
import { useAppSelector } from '@/state/store'
import { selectError } from '@/widgets/error-snack-bar/selectors/error-selector'
import * as React from 'react'

export const useErrorSnackbar = () => {
  const { setAppError } = useActions(appActions)

  const error = useAppSelector(selectError)
  const isOpen = error !== null

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    setAppError({ error: null })
  }
  return {
    isOpen,
    handleClose,
    error,
  }
}
