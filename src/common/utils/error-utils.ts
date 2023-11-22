import { setAppErrorAC, setAppStatusAC } from "app/appReducer"
import { ResponseType } from "api/todolists-api"
import { Dispatch } from "redux"
import { AxiosError, isAxiosError } from "axios"

export const handleServerAppError = <D>(
  data: ResponseType<D>,
  dispatch: Dispatch,
  showError = true,
) => {
  if (showError) {
    dispatch(
      setAppErrorAC({ error: data.messages.length ? data.messages[0] : "Some error occurred" }),
    )
  }
  dispatch(setAppStatusAC({ status: "failed" }))
}

export const _handleServerNetworkError = (
  error: AxiosError<{ message: string }>,
  dispatch: Dispatch,
) => {
  dispatch(
    setAppErrorAC(error.message ? { error: error.message } : { error: "Some error occurred" }),
  )
  dispatch(setAppStatusAC({ status: "failed" }))
}

export const handleServerNetworkError = (err: unknown, dispatch: Dispatch): void => {
  let errorMessage = "Some error occurred"

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
  dispatch(setAppErrorAC({ error: errorMessage }))
  dispatch(setAppStatusAC({ status: "failed" }))
}
