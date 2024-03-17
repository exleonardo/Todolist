import { useCallback, useEffect } from 'react'

import { selectTasks, selectorTodolists } from '@/app/selectors/app-selector'
import { todolistsActions } from '@/features/todolists-list'
import { selectIsLoggedIn } from '@/pages/auth/selectors/auth-selector'
import { useAppSelector } from '@/state/store'
import { useActions } from '@/utils/redux-utils'

export const useTodolistList = (demo: boolean = false) => {
  const todolists = useAppSelector(selectorTodolists)
  const tasks = useAppSelector(selectTasks)
  const isLoggedIn = useAppSelector(selectIsLoggedIn)

  const { addTodolist, fetchTodolist } = useActions(todolistsActions)

  useEffect(() => {
    if (demo || !isLoggedIn) {
      return
    }
    fetchTodolist()
  }, [])
  const addTodolistCallback = useCallback(async (title: string) => {
    return addTodolist(title).unwrap()
  }, [])

  return {
    addTodolistCallback,
    isLoggedIn,
    tasks,
    todolists,
  }
}
