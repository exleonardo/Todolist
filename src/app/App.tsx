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
import { TodolistsList } from "./features/Todolist/TodolistsList"
import CustomizedSnackbars from "../components/ErrorSnackBar/ErrorSnackbar"
import { useSelector } from "react-redux"
import { AppRootStateType, useAppDispatch } from "state/store"
import { initializedTC, RequestStatusType } from "./app-reducer"
import { Navigate, Route, Routes } from "react-router-dom"
import { Login } from "features/Login/Login"
import { CircularProgress } from "@mui/material"
import { logoutTC } from "features/Login/authReducer"

export type TasksStateType = {
  [key: string]: Array<TaskType>
}

type PropsType = {
  demo?: boolean
}

function App({ demo = false, ...props }: PropsType) {
  const status = useSelector<AppRootStateType, RequestStatusType>((state) => state.app.status)
  const isInitialized = useSelector<AppRootStateType, boolean>((state) => state.app.isInitialized)
  const isLoggedIn = useSelector<AppRootStateType, boolean>((state) => state.auth.isLoggedIn)
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (!demo) {
      dispatch(initializedTC())
    }
  }, [demo, dispatch])
  const logoutHandler = useCallback(() => {
    dispatch(logoutTC())
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
