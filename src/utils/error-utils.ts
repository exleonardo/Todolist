import { BaseResponseType } from '@/api/todolists-api'
import { appActions } from '@/common/common-actions/application-common-action'
import { Dispatch } from '@reduxjs/toolkit'
import { AxiosError, isAxiosError } from 'axios'

export const handleServerAppError = <D>(
  data: BaseResponseType<D>,
  dispatch: Dispatch,
  showError = true
) => {
  if (showError) {
    dispatch(
      appActions.setAppError({
        error: data.messages.length ? data.messages[0] : 'Some error occurred',
      })
    )
  }
  dispatch(appActions.setAppStatus({ status: 'failed' }))
}

export const _handleServerNetworkError = (
  error: AxiosError<{ message: string }>,
  dispatch: Dispatch
) => {
  dispatch(
    appActions.setAppError(
      error.message ? { error: error.message } : { error: 'Some error occurred' }
    )
  )
  dispatch(appActions.setAppStatus({ status: 'failed' }))
}

export const handleServerNetworkError = (err: unknown, dispatch: Dispatch): void => {
  let errorMessage = 'Some error occurred'

  // ❗Проверка на наличие axios ошибки
  if (isAxiosError(err)) {
    // ⏺️ err.response?.data?.message - например получение тасок с невалидной todolistId
    // ⏺️ err?.message - например при создании таски в offline режиме
    errorMessage = err.response?.data?.message || err?.message || errorMessage
    // ❗ Проверка на наличие нативной ошибки
  } else if (err instanceof Error) {
    errorMessage = `Native error: ${err.message}`
    // ❗Какой-то непонятный кейс
  } else {
    errorMessage = JSON.stringify(err)
  }
  dispatch(appActions.setAppError({ error: errorMessage }))
  dispatch(appActions.setAppStatus({ status: 'failed' }))
}
