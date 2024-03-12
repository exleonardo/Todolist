import React, { useCallback, useEffect } from 'react'

import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'

import { Navigate } from 'react-router-dom'

import { useAppSelector } from '@/state/store'
import { AddItemForm } from '@/common/components/AddItemForm/add-Item-form'
import { useActions } from '@/utils/redux-utils'
import { Todolist } from '@/features/todolists-list/Todolist/todolist'
import { selectorTodolists, selectTasks } from '@/features/Application/app-selector'
import { selectIsLoggedIn } from '@/features/auth/auth-selector'
import { todolistsActions } from '@/features/todolists-list/index'

type TodolistsListPropsType = {
  demo?: boolean
}
export const TodolistsList: React.FC<TodolistsListPropsType> = ({ demo = false }) => {
  const todolists = useAppSelector(selectorTodolists)
  const tasks = useAppSelector(selectTasks)
  const isLoggedIn = useAppSelector(selectIsLoggedIn)

  const { fetchTodolist, addTodolist } = useActions(todolistsActions)
  useEffect(() => {
    if (demo || !isLoggedIn) {
      return
    }
    fetchTodolist()
  }, [])
  const addTodolistCallback = useCallback(async (title: string) => {
    return addTodolist(title).unwrap()
  }, [])
  if (!isLoggedIn) {
    return <Navigate to={'/login'} />
  }

  return (
    <>
      <Grid container style={{ padding: '20px' }}>
        <AddItemForm addItem={addTodolistCallback} />
      </Grid>
      <Grid container spacing={3} style={{ flexWrap: 'nowrap', overflowX: 'scroll' }}>
        {todolists.map(tl => {
          return (
            <Grid item key={tl.id}>
              <Paper style={{ width: '300px' }}>
                <Todolist todolist={tl} tasks={tasks[tl.id]} demo={demo} />
              </Paper>
            </Grid>
          )
        })}
      </Grid>
    </>
  )
}
