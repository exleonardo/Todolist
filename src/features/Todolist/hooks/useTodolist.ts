import { useCallback } from 'react'
import { DropResult } from 'react-beautiful-dnd'

import { TaskStatuses, TaskType } from '@/api/todolists-api'
import { tasksAction, todolistsActions } from '@/features/todolists-list'
import { FilterValuesType, TodolistDomainType } from '@/redux/todolists-reducer'
import { useActions } from '@/utils/redux-utils'

export const useTodolist = (todolist: TodolistDomainType, tasks: TaskType[]) => {
  const { changeOrderTodo, changeTodolistFilter, changeTodolistTitle, removeTodolist } =
    useActions(todolistsActions)
  const { addTask, changeOrderTask } = useActions(tasksAction)

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

  const onDragEnd = useCallback(
    (result: DropResult) => {
      const { destination, draggableId, source } = result

      if (!destination) {
        return
      }
      if (source.droppableId === destination.droppableId && source.index === destination.index) {
        return
      }

      let putAfterItemId = null

      if (tasksForTodolist[tasksForTodolist.length - 1] === tasksForTodolist[destination.index]) {
        putAfterItemId = tasksForTodolist[destination.index].id
      } else if (tasksForTodolist[destination.index - 1] && source.index !== 0) {
        putAfterItemId = tasksForTodolist[destination.index - 1].id
      } else if (source.index === 0) {
        putAfterItemId = tasksForTodolist[destination.index].id
      }
      const reorderedStore = [...tasksForTodolist]
      const sourceIndex = source.index
      const destinationIndex = destination.index
      const [removedStore] = reorderedStore.splice(sourceIndex, 1)

      reorderedStore.splice(destinationIndex, 0, removedStore)
      changeOrderTask({
        id: draggableId,
        putAfterItemId,
        reorderedStore,
        todolistId: tasksForTodolist[source.index].todoListId,
      })
    },
    [changeOrderTask, tasksForTodolist]
  )

  return {
    addTaskCallback,
    changeOrderTask,
    changeOrderTodo,
    changeTodolistTitleCallback,
    onDragEnd,
    onFilterButtonClickHandler,
    removeTodolistCallback,
    tasksForTodolist,
  }
}
