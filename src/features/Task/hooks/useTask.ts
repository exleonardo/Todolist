import { ChangeEvent, useCallback } from 'react'

import { TaskStatuses } from '@/api/todolists-api'
import { TaskPropsType } from '@/features/Task'
import { tasksAction } from '@/features/todolists-list'
import { useActions } from '@/utils/redux-utils'

export const useTask = (props: TaskPropsType) => {
  const { removeTask, updateTask } = useActions(tasksAction)

  const onClickHandler = () => removeTask({ taskId: props.task.id, todolistId: props.todolistId })
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const newIsDoneValue = e.currentTarget.checked

    updateTask({
      domainModel: { status: newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New },
      taskId: props.task.id,
      todolistId: props.todolistId,
    })
  }
  const onTitleChangeHandler = useCallback(
    (newValue: string) => {
      updateTask({
        domainModel: { title: newValue },
        taskId: props.task.id,
        todolistId: props.todolistId,
      })
    },
    [props.task.id, props.todolistId]
  )

  return {
    onChangeHandler,
    onClickHandler,
    onTitleChangeHandler,
  }
}
