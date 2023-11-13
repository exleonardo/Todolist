import React, { useCallback, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "state/store"
import {
  addTodolistTC,
  changeTodolistFilterAC,
  changeTodolistTitleTC,
  fetchTodolistTC,
  FilterValuesType,
  removeTodolistTC,
} from "features/TodolistsList/Todolist/todolists-reducer"
import {
  addTaskTC,
  removeTaskTC,
  updateTaskTC,
} from "features/TodolistsList/Todolist/Task/tasks-reducer"
import { TaskStatuses } from "api/todolists-api"
import { Grid, Paper } from "@mui/material"
import { AddItemForm } from "components/AddItemForm/AddItemForm"
import { Todolist } from "features/TodolistsList/Todolist/Todolist"
import { Navigate } from "react-router-dom"
import { selectIsLoggedIn, selectorTodolists, selectTasks } from "app/AppSelector"

type TodolistsListPropsType = {
  demo?: boolean
}
export const TodolistsList: React.FC<TodolistsListPropsType> = ({ demo = false, ...props }) => {
  const todolists = useAppSelector(selectorTodolists)
  const tasks = useAppSelector(selectTasks)
  const isLoggedIn = useAppSelector(selectIsLoggedIn)
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (demo || !isLoggedIn) {
      return
    }
    dispatch(fetchTodolistTC())
  }, [dispatch])

  const removeTask = useCallback(
    function (taskId: string, todolistId: string) {
      const thunk = removeTaskTC({ taskId, todolistId })
      dispatch(thunk)
    },
    [dispatch],
  )

  const addTask = useCallback(
    function (title: string, todolistId: string) {
      const thunk = addTaskTC({ title, todolistId })
      dispatch(thunk)
    },
    [dispatch],
  )

  const changeStatus = useCallback(
    function (taskId: string, status: TaskStatuses, todolistId: string) {
      const thunk = updateTaskTC({
        taskId,
        domainModel: {
          status,
        },
        todolistId,
      })
      dispatch(thunk)
    },
    [dispatch],
  )

  const changeTaskTitle = useCallback(
    function (taskId: string, newTitle: string, todolistId: string) {
      const thunk = updateTaskTC({ taskId, todolistId, domainModel: { title: newTitle } })
      dispatch(thunk)
    },
    [dispatch],
  )

  const changeFilter = useCallback(
    function (value: FilterValuesType, todolistId: string) {
      const action = changeTodolistFilterAC({ id: todolistId, filter: value })
      dispatch(action)
    },
    [dispatch],
  )

  const removeTodolist = useCallback(
    function (id: string) {
      const thunk = removeTodolistTC(id)
      dispatch(thunk)
    },
    [dispatch],
  )

  const changeTodolistTitle = useCallback(
    (id: string, title: string) => {
      const thunk = changeTodolistTitleTC(id, title)
      dispatch(thunk)
    },
    [dispatch],
  )

  const addTodolist = useCallback(
    (title: string) => {
      const thunk = addTodolistTC(title)
      dispatch(thunk)
    },
    [dispatch],
  )
  if (!isLoggedIn) {
    return <Navigate to={"/login"} />
  }

  return (
    <>
      <Grid container style={{ padding: "20px" }}>
        <AddItemForm addItem={addTodolist} />
      </Grid>
      <Grid container spacing={3}>
        {todolists.map((tl) => {
          return (
            <Grid item key={tl.id}>
              <Paper style={{ padding: "10px" }}>
                <Todolist
                  todolist={tl}
                  tasks={tasks[tl.id]}
                  removeTask={removeTask}
                  changeFilter={changeFilter}
                  addTask={addTask}
                  changeTaskStatus={changeStatus}
                  removeTodolist={removeTodolist}
                  changeTaskTitle={changeTaskTitle}
                  changeTodolistTitle={changeTodolistTitle}
                  demo={demo}
                />
              </Paper>
            </Grid>
          )
        })}
      </Grid>
    </>
  )
}
