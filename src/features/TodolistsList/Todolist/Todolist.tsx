import React, { useCallback } from "react"
import { AddItemForm } from "common/components/AddItemForm/AddItemForm"
import { EditableSpan } from "common/components/EditableSpan/EditableSpan"
import { Task } from "./Task/Task"
import { Button, IconButton } from "@mui/material"
import { Delete } from "@mui/icons-material"
import { TaskStatuses, TaskType } from "api/todolists-api"
import { FilterValuesType, TodolistDomainType } from "features/TodolistsList/todolistsReducer"
import { useActions } from "state/store"
import { tasksAction, todolistsActions } from "features/TodolistsList/index"

type PropsType = {
  todolist: TodolistDomainType
  tasks: TaskType[]
  demo?: boolean
}

export const Todolist = React.memo(function ({ demo = false, ...props }: PropsType) {
  const { removeTodolist, changeTodolistTitle, changeTodolistFilter } = useActions(todolistsActions)
  const { addTask, updateTask, removeTask } = useActions(tasksAction)
  const changeStatus = useCallback(
    function (taskId: string, status: TaskStatuses, todolistId: string) {
      updateTask({ taskId, domainModel: { status }, todolistId })
    },

    [],
  )

  const changeTaskTitle = useCallback(function (
    taskId: string,
    newTitle: string,
    todolistId: string,
  ) {
    updateTask({ taskId, todolistId, domainModel: { title: newTitle } })
  }, [])

  const addTaskCallback = useCallback(
    (title: string) => {
      addTask({ title, todolistId: props.todolist.id })
    },
    [props.todolist.id],
  )

  const removeTodolistCallback = () => {
    removeTodolist(props.todolist.id)
  }
  const changeTodolistTitleCallback = useCallback(
    (title: string) => {
      changeTodolistTitle({ id: props.todolist.id, title })
    },
    [props.todolist.id],
  )

  const onFilterButtonClickHandler = useCallback(
    (filter: FilterValuesType) => changeTodolistFilter({ filter, id: props.todolist.id }),
    [props.todolist.id],
  )

  const renderFilterButton = (
    color: "inherit" | "secondary" | "primary" | "success" | "error" | "info" | "warning",
    buttonFilter: FilterValuesType,
    text: string,
  ) => {
    return (
      <Button
        variant={props.todolist.filter === buttonFilter ? "outlined" : "text"}
        onClick={() => onFilterButtonClickHandler(buttonFilter)}
        color={color}>
        {text}
      </Button>
    )
  }

  let tasksForTodolist = props.tasks

  if (props.todolist.filter === "active") {
    tasksForTodolist = props.tasks.filter((t) => t.status === TaskStatuses.New)
  }
  if (props.todolist.filter === "completed") {
    tasksForTodolist = props.tasks.filter((t) => t.status === TaskStatuses.Completed)
  }

  return (
    <div>
      <h3>
        <EditableSpan value={props.todolist.title} onChange={changeTodolistTitleCallback} />
        <IconButton
          onClick={removeTodolistCallback}
          disabled={props.todolist.entityStatus === "loading"}>
          <Delete />
        </IconButton>
      </h3>
      <AddItemForm addItem={addTaskCallback} />
      <div>
        {tasksForTodolist.map((t) => (
          <Task task={t} todolistId={props.todolist.id} key={t.id} />
        ))}
      </div>
      <div style={{ paddingTop: "10px" }}>
        {renderFilterButton("inherit", "all", "All")}
        {renderFilterButton("primary", "active", "Active")}
        {renderFilterButton("secondary", "completed", "Completed")}
      </div>
    </div>
  )
})
