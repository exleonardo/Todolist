import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { TaskType } from '@/api/todolists-api'
import { selectIsInitialized, selectStatusApp } from '@/app/selectors/app-selector'
import { TodolistsList } from '@/features/todolists-list/ui/todolists-list'
import { asyncActions } from '@/redux/auth-reducer'
import { useAppSelector } from '@/state/store'
import { useActions, useAppDispatch } from '@/utils/redux-utils'
import CustomizedSnackbars from '@/widgets/error-snack-bar/ui/error-snackbar'
import { CircularProgress } from '@mui/material'
import LinearProgress from '@mui/material/LinearProgress'

import s from '../style/app.module.scss'

import { Login, authActions, authSelector } from '../../pages/auth'

export type TasksStateType = {
  [key: string]: Array<TaskType>
}

type PropsType = {
  demo?: boolean
}

export const App = ({ demo = false }: PropsType) => {
  const status = useAppSelector(selectStatusApp)
  const isInitialized = useAppSelector(selectIsInitialized)
  const isLoggedIn = useAppSelector(authSelector.selectIsLoggedIn)
  const dispatch = useAppDispatch()
  const { logout } = useActions(authActions)
  const { initialized } = useActions(asyncActions)

  useEffect(() => {
    if (!demo) {
      initialized()
    }
  }, [demo, dispatch])
  const logoutHandler = () => logout()

  if (!isInitialized) {
    return (
      <div style={{ left: '50%', position: 'fixed', top: '30%', width: '100%' }}>
        <CircularProgress />
      </div>
    )
  }

  return (
    <div>
      <CustomizedSnackbars />

      {isLoggedIn && (
        <div className={s.header}>
          <button className={s.button} color={'inherit'} onClick={logoutHandler}>
            Log out
          </button>
        </div>
      )}

      {status === 'loading' && <LinearProgress />}

      <div className={s.content}>
        <Routes>
          <Route element={<TodolistsList demo={demo} />} path={'/'} />
          <Route element={<Login />} path={'/login'} />
          <Route element={<h1>404: PAGE NOT FOUND</h1>} path={'/404'} />
          <Route element={<Navigate to={'/404'} />} path={'*'} />
        </Routes>
      </div>
    </div>
  )
}
