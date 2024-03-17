import { useMemo } from 'react'
import { useDispatch } from 'react-redux'

import { AppDispatchType } from '@/state/store'
import { ActionCreatorsMapObject, bindActionCreators } from 'redux'

export const useAppDispatch = useDispatch<AppDispatchType>

export function useActions<T extends ActionCreatorsMapObject>(actions: T) {
  const dispatch = useAppDispatch()
  const boundActions = useMemo(() => {
    return bindActionCreators<T, RemapActionCreators<T>>(actions, dispatch)
  }, [])

  return boundActions
}

type IsValidArg<T> = T extends object ? (keyof T extends never ? false : true) : true
type ActionCreatorResponse<T extends (...args: any[]) => any> = ReturnType<ReturnType<T>>
type ReplaceReturnType<T, TNewReturn> = T extends (...args: any[]) => unknown
  ? IsValidArg<Extract<T, (...args: any[]) => any>> extends true
    ? (...args: Parameters<Extract<T, (...args: any[]) => any>>) => TNewReturn
    : () => TNewReturn
  : never

type RemapActionCreators<T extends ActionCreatorsMapObject> = {
  [K in keyof T]: ReplaceReturnType<T[K], ActionCreatorResponse<T[K]>>
}
