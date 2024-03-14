import Checkbox from '@mui/material/Checkbox/Checkbox'
import React from 'react'
import { EditableSpan } from '@/widgets/editable-span/ui/editable-span'

import { IconButton } from '@mui/material'
import { Delete } from '@mui/icons-material'
import { TaskStatuses, TaskType } from '@/api/todolists-api'
import s from '../style/task.module.scss'
import { useTask } from '@/features/Task/hooks/useTask'

export type TaskPropsType = {
  task: TaskType
  todolistId: string
}
export const Task = React.memo((props: TaskPropsType) => {
  const { onTitleChangeHandler, onClickHandler, onChangeHandler } = useTask(props)
  return (
    <div key={props.task.id} className={props.task.status === TaskStatuses.Completed ? s.task : ''}>
      <Checkbox
        checked={props.task.status === TaskStatuses.Completed}
        color="primary"
        onChange={onChangeHandler}
      />

      <EditableSpan value={props.task.title} onChange={onTitleChangeHandler} />
      <IconButton className={s.iconButtonDelete} onClick={onClickHandler}>
        <Delete fontSize={'small'} />
      </IconButton>
    </div>
  )
})
