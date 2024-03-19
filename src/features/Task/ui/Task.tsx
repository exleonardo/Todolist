import React, { forwardRef } from 'react'
import { Draggable } from 'react-beautiful-dnd'

import { TaskStatuses, TaskType } from '@/api/todolists-api'
import { useTask } from '@/features/Task/hooks/useTask'
import { EditableSpan } from '@/widgets/editable-span/ui/editable-span'
import { Delete } from '@mui/icons-material'
import { IconButton } from '@mui/material'

import s from '../style/task.module.scss'

export type TaskPropsType = {
  index?: number
  task: TaskType
  todolistId: string
}
export const Task = React.memo(
  forwardRef<any, TaskPropsType>(({ index = 0, task, todolistId }: TaskPropsType) => {
    const { onChangeHandler, onClickHandler, onTitleChangeHandler } = useTask({
      index,
      task,
      todolistId,
    })

    return (
      <Draggable draggableId={task.id} index={index} key={task.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.dragHandleProps}
            {...provided.draggableProps}
            className={snapshot.isDragging ? s.testTask : s.task}
          >
            <label className={s.container}>
              <input
                checked={task.status === TaskStatuses.Completed}
                onChange={onChangeHandler}
                type={'checkbox'}
              />
              <div className={s.checkmark}></div>
            </label>

            <EditableSpan
              className={task.status === TaskStatuses.Completed ? '' : ''}
              onChange={onTitleChangeHandler}
              value={task.title}
            />
            <IconButton className={s.iconButtonDelete} onClick={onClickHandler}>
              <Delete color={'warning'} fontSize={'small'} />
            </IconButton>
          </div>
        )}
      </Draggable>
    )
  })
)
