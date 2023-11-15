import { setAppErrorAC, setAppStatusAC } from "app/app-reducer"
import { ResponseType } from "api/todolists-api"
import { Dispatch } from "redux"
import { AxiosError } from "axios"

export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: Dispatch) => {
  if (data.messages.length) {
    dispatch(setAppErrorAC({ error: data.messages[0] }))
  } else {
    dispatch(setAppErrorAC({ error: "some error" }))
  }
  dispatch(setAppStatusAC({ status: "failed" }))
}

export const handleServerNetworkError = (
  error: AxiosError<{ message: string }>,
  dispatch: Dispatch,
) => {
  dispatch(
    setAppErrorAC(error.message ? { error: error.message } : { error: "Some error occurred" }),
  )
  dispatch(setAppStatusAC({ status: "failed" }))
}
