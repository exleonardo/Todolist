import React from 'react'

import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'

import { Navigate } from 'react-router-dom'
import { AddItemForm } from '@/widgets/addItem-form/ui/add-Item-form'
import { Todolist } from '@/features/Todolist/ui/todolist'
import { useTodolistList } from '@/features/todolists-list/hooks/useTodolistList'
import s from '../style/list-todolis.module.scss'

type TodolistsListPropsType = {
  demo?: boolean
}
export const TodolistsList: React.FC<TodolistsListPropsType> = ({ demo = false }) => {
  const { todolists, addTodolistCallback, tasks, isLoggedIn } = useTodolistList(demo)
  if (!isLoggedIn) {
    return <Navigate to={'/login'} />
  }

  return (
    <>
      <Grid container className={s.container}>
        <AddItemForm addItem={addTodolistCallback} />
      </Grid>
      <Grid container spacing={3}>
        {todolists.map(tl => {
          return (
            <Grid item key={tl.id}>
              <Paper className={s.contentTodo}>
                <Todolist todolist={tl} tasks={tasks[tl.id]} demo={demo} />
              </Paper>
            </Grid>
          )
        })}
      </Grid>
    </>
  )
}
