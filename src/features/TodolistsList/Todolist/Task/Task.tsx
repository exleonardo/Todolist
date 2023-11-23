import Checkbox from "@mui/material/Checkbox/Checkbox"
import React, { ChangeEvent, useCallback } from "react"
import { EditableSpan } from "common/components/EditableSpan/EditableSpan"

import { IconButton } from "@mui/material"
import { Delete } from "@mui/icons-material"
import { TaskStatuses, TaskType } from "api/todolists-api"

import { tasksAction } from "features/TodolistsList/index"
import { useActions } from "common/utils/redux-utils"

type TaskPropsType = {
  task: TaskType
  todolistId: string
}
export const Task = React.memo((props: TaskPropsType) => {
  const { updateTask, removeTask } = useActions(tasksAction)

  const onClickHandler = () => removeTask({ taskId: props.task.id, todolistId: props.todolistId })
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    let newIsDoneValue = e.currentTarget.checked
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
    [props.task.id, props.todolistId],
  )

  return (
    <>
      <div
        style={{ position: "relative" }}
        key={props.task.id}
        className={props.task.status === TaskStatuses.Completed ? "is-done" : ""}>
        <Checkbox
          checked={props.task.status === TaskStatuses.Completed}
          color="primary"
          onChange={onChangeHandler}
        />

        <EditableSpan value={props.task.title} onChange={onTitleChangeHandler} />
        <IconButton
          onClick={onClickHandler}
          style={{ position: "absolute", top: "2px", right: "2px" }}>
          <Delete fontSize={"small"} />
        </IconButton>
      </div>
    </>
  )
})
