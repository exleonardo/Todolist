import { useCallback } from 'react'

import { TaskStatuses, TaskType } from '@/api/todolists-api'
import { tasksAction, todolistsActions } from '@/features/todolists-list'
import { FilterValuesType, TodolistDomainType } from '@/redux/todolists-reducer'
import { useActions } from '@/utils/redux-utils'

export const useTodolist = (todolist: TodolistDomainType, tasks: TaskType[]) => {
  const { changeTodolistFilter, changeTodolistTitle, removeTodolist } = useActions(todolistsActions)
  const { addTask } = useActions(tasksAction)

  const addTaskCallback = useCallback(async (title: string) => {
    return addTask({ title, todolistId: todolist.id }).unwrap()
  }, [])

  const removeTodolistCallback = () => {
    removeTodolist(todolist.id)
  }
  const changeTodolistTitleCallback = useCallback(
    (title: string) => {
      changeTodolistTitle({ id: todolist.id, title })
    },
    [todolist.id]
  )

  const onFilterButtonClickHandler = useCallback(
    (filter: FilterValuesType) => changeTodolistFilter({ filter, id: todolist.id }),
    [todolist.id]
  )

  let tasksForTodolist = tasks

  if (todolist.filter === 'active') {
    tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.New)
  }
  if (todolist.filter === 'completed') {
    tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.Completed)
  }

  return {
    addTaskCallback,
    changeTodolistTitleCallback,
    onFilterButtonClickHandler,
    removeTodolistCallback,
    tasksForTodolist,
  }
}
