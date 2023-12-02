import React, { useEffect } from "react"
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
import { useAppSelector } from "state/store"

import { Navigate, Route, Routes } from "react-router-dom"
import { CircularProgress } from "@mui/material"
import { authActions, authSelector, Login } from "features/Auth"
import { selectIsInitialized, selectStatusApp } from "features/Application/AppSelector"
import { TodolistsList } from "features/TodolistsList"
import { useActions, useAppDispatch } from "common/utils/redux-utils"
import { asyncActions } from "features/Auth/authReducer"

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
