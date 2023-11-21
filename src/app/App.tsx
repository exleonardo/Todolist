import React, { useCallback, useEffect } from "react"
import "./App.css"
import AppBar from "@mui/material/AppBar"
import Container from "@mui/material/Container"
import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import LinearProgress from "@mui/material/LinearProgress"
import Toolbar from "@mui/material/Toolbar"
import { Menu } from "@mui/icons-material"
import { TaskType } from "api/todolists-api"
import CustomizedSnackbars from "../common/components/ErrorSnackBar/ErrorSnackbar"
import { useAppDispatch, useAppSelector } from "state/store"
import { asyncActions } from "app/appReducer"
import { Navigate, Route, Routes } from "react-router-dom"
import { CircularProgress } from "@mui/material"
import { logout } from "features/Auth/authReducer"
import { authSelector, Login } from "features/Auth"
import { selectIsInitialized, selectStatusApp } from "app/AppSelector"
import { TodolistsList } from "features/TodolistsList"

export type TasksStateType = {
  [key: string]: Array<TaskType>
}

type PropsType = {
  demo?: boolean
}

function App({ demo = false, ...props }: PropsType) {
  const status = useAppSelector(selectStatusApp)
  const isInitialized = useAppSelector(selectIsInitialized)
  const isLoggedIn = useAppSelector(authSelector.selectIsLoggedIn)
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (!demo) {
      dispatch(asyncActions.initialized())
    }
  }, [demo, dispatch])
  const logoutHandler = useCallback(() => {
    dispatch(logout())
  }, [dispatch])
  if (!isInitialized) {
    return (
      <div style={{ position: "fixed", top: "30%", width: "100%", left: "50%" }}>
        <CircularProgress />
      </div>
    )
  }

  return (
    <div className="App">
      <CustomizedSnackbars />
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <Menu />
          </IconButton>
          {isLoggedIn && (
            <Button onClick={logoutHandler} color="inherit">
              Log out
            </Button>
          )}
        </Toolbar>
        {status === "loading" && <LinearProgress />}
      </AppBar>
      <Container fixed>
        <Routes>
          <Route path={"/"} element={<TodolistsList demo={demo} />} />
          <Route path={"/login"} element={<Login />} />
          <Route path={"/404"} element={<h1>404: PAGE NOT FOUND</h1>} />
          <Route path={"*"} element={<Navigate to="/404" />} />
        </Routes>
      </Container>
    </div>
  )
}

export default App
