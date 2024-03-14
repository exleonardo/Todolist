import { useAppSelector } from '@/state/store'
import { selectorTodolists, selectTasks } from '@/app/selectors/app-selector'
import { selectIsLoggedIn } from '@/pages/auth/selectors/auth-selector'
import { useActions } from '@/utils/redux-utils'
import { todolistsActions } from '@/features/todolists-list'
import { useCallback, useEffect } from 'react'

export const useTodolistList = (demo: boolean = false) => {
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
  return {
    addTodolistCallback,
    tasks,
    todolists,
    isLoggedIn,
  }
}
