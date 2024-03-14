import { useActions } from '@/utils/redux-utils'
import { tasksAction } from '@/features/todolists-list'
import { ChangeEvent, useCallback } from 'react'
import { TaskStatuses } from '@/api/todolists-api'
import { TaskPropsType } from '@/features/Task'

export const useTask = (props: TaskPropsType) => {
  const { updateTask, removeTask } = useActions(tasksAction)

  const onClickHandler = () => removeTask({ taskId: props.task.id, todolistId: props.todolistId })
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const newIsDoneValue = e.currentTarget.checked
    updateTask({
      taskId: props.task.id,
      domainModel: { status: newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New },
      todolistId: props.todolistId,
    })
  }
  const onTitleChangeHandler = useCallback(
    (newValue: string) => {
      updateTask({
        taskId: props.task.id,
        todolistId: props.todolistId,
        domainModel: { title: newValue },
      })
    },
    [props.task.id, props.todolistId]
  )
  return {
    onClickHandler,
    onChangeHandler,
    onTitleChangeHandler,
  }
}