import React, { useCallback, useEffect } from "react"
import { useActions, useAppDispatch, useAppSelector } from "state/store"
import Grid from "@mui/material/Grid"
import Paper from "@mui/material/Paper"
import { AddItemForm, AddItemFormSubmitHelperType } from "common/components/AddItemForm/AddItemForm"
import { Todolist } from "features/TodolistsList/Todolist/Todolist"
import { Navigate } from "react-router-dom"
import { selectorTodolists, selectTasks } from "app/AppSelector"
import { selectIsLoggedIn } from "features/Auth/AuthSelector"
import { tasksAction, todolistsActions } from "features/TodolistsList/index"

type TodolistsListPropsType = {
  demo?: boolean
}
export const TodolistsList: React.FC<TodolistsListPropsType> = ({ demo = false, ...props }) => {
  const todolists = useAppSelector(selectorTodolists)
  const tasks = useAppSelector(selectTasks)
  const isLoggedIn = useAppSelector(selectIsLoggedIn)

  const dispatch = useAppDispatch()

  const { fetchTodolist, addTodolist } = useActions(todolistsActions)
  useEffect(() => {
    if (demo || !isLoggedIn) {
      return
    }
    fetchTodolist()
  }, [])
  const addTodolistCallback = useCallback(
    async (title: string, helper: AddItemFormSubmitHelperType) => {
      const thunk = todolistsActions.addTodolist(title)

      const resultAction = await dispatch(thunk)
      if (todolistsActions.addTodolist.rejected.match(resultAction)) {
        console.log(resultAction)
        if (resultAction.payload?.errors.length) {
          const errorMessage = resultAction.payload?.errors[0]
          helper.setError(errorMessage)
        } else {
          helper.setError("Some Error")
        }
      } else {
        helper.setTitle("")
      }
    },
    [],
  )
  if (!isLoggedIn) {
    return <Navigate to={"/login"} />
  }

  return (
    <>
      <Grid container style={{ padding: "20px" }}>
        <AddItemForm addItem={addTodolistCallback} />
      </Grid>
      <Grid container spacing={3} style={{ flexWrap: "nowrap", overflowX: "scroll" }}>
        {todolists.map((tl) => {
          return (
            <Grid item key={tl.id}>
              <Paper style={{ width: "300px" }}>
                <Todolist todolist={tl} tasks={tasks[tl.id]} demo={demo} />
              </Paper>
            </Grid>
          )
        })}
      </Grid>
    </>
  )
}
