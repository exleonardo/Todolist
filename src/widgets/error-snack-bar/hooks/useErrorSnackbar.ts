import * as React from 'react'

import { appActions } from '@/common/common-actions/application-common-action'
import { useAppSelector } from '@/state/store'
import { useActions } from '@/utils/redux-utils'
import { selectError } from '@/widgets/error-snack-bar/selectors/error-selector'

export const useErrorSnackbar = () => {
  const { setAppError } = useActions(appActions)

  const error = useAppSelector(selectError)
  const isOpen = error !== null

  const handleClose = (_event?: Event | React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    setAppError({ error: null })
  }

  return {
    error,
    handleClose,
    isOpen,
  }
}
