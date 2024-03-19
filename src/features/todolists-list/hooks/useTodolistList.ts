import { useCallback, useEffect } from 'react'
import { DropResult } from 'react-beautiful-dnd'

import { selectTasks, selectorTodolists } from '@/app/selectors/app-selector'
import { todolistsActions } from '@/features/todolists-list'
import { selectIsLoggedIn } from '@/pages/auth/selectors/auth-selector'
import { useAppSelector } from '@/state/store'
import { useActions } from '@/utils/redux-utils'

export const useTodolistList = (demo: boolean = false) => {
  const todolists = useAppSelector(selectorTodolists)
  const tasks = useAppSelector(selectTasks)
  const isLoggedIn = useAppSelector(selectIsLoggedIn)

  const { addTodolist, changeOrderTodo, fetchTodolist } = useActions(todolistsActions)

  useEffect(() => {
    if (demo || !isLoggedIn) {
      return
    }
    fetchTodolist()
  }, [])
  const addTodolistCallback = useCallback(async (title: string) => {
    return addTodolist(title).unwrap()
  }, [])

  const onDragEnd = (result: DropResult) => {
    const { destination, draggableId, source } = result

    if (!destination) {
      return
    }
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return
    }
    let putAfterItemId = null

    if (todolists[todolists.length - 1] === todolists[destination.index]) {
      putAfterItemId = todolists[destination.index].id
    } else if (todolists[destination.index - 1] && source.index !== 0) {
      putAfterItemId = todolists[destination.index - 1].id
    } else if (source.index === 0) {
      putAfterItemId = todolists[destination.index].id
    }
    const reorderedStore = [...todolists]
    const sourceIndex = source.index
    const destinationIndex = destination.index
    const [removedStore] = reorderedStore.splice(sourceIndex, 1)

    reorderedStore.splice(destinationIndex, 0, removedStore)
    changeOrderTodo({
      id: draggableId,
      putAfterItemId,
      reorderedStore,
    })
  }

  return {
    addTodolistCallback,
    changeOrderTodo,
    isLoggedIn,
    onDragEnd,
    tasks,
    todolists,
  }
}
