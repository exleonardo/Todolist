import React, { useCallback } from "react"
import { AddItemForm } from "common/components/AddItemForm/AddItemForm"
import { EditableSpan } from "common/components/EditableSpan/EditableSpan"
import { Task } from "./Task/Task"
import { Button, IconButton } from "@mui/material"
import { Delete } from "@mui/icons-material"
import { TaskStatuses, TaskType } from "api/todolists-api"
import { FilterValuesType, TodolistDomainType } from "features/TodolistsList/todolistsReducer"
import { useActions, useAppDispatch } from "state/store"
import { tasksAction, todolistsActions } from "features/TodolistsList/index"
import Paper from "@mui/material/Paper"
import { Simulate } from "react-dom/test-utils"
import error = Simulate.error

type PropsType = {
  todolist: TodolistDomainType
  tasks: TaskType[]
  demo?: boolean
}

export const Todolist = React.memo(function ({ demo = false, ...props }: PropsType) {
  const { removeTodolist, changeTodolistTitle, changeTodolistFilter } = useActions(todolistsActions)
  const { addTask } = useActions(tasksAction)
  const dispatch = useAppDispatch()
  const addTaskCallback = useCallback(async (title: string) => {
    const thunk = tasksAction.addTask({ title, todolistId: props.todolist.id })

    const resultAction = await dispatch(thunk)
    if (tasksAction.addTask.rejected.match(resultAction)) {
      console.log(resultAction)
      if (resultAction.payload?.errors.length) {
        const errorMessage = resultAction.payload?.errors[0]
        throw new Error(errorMessage)
      } else {
        throw new Error("Some Error")
      }
    }
  }, [])

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
    <Paper style={{ padding: "10px", position: "relative" }}>
      <IconButton
        style={{ position: "absolute", right: "5px" }}
        onClick={removeTodolistCallback}
        disabled={props.todolist.entityStatus === "loading"}>
        <Delete />
      </IconButton>
      <h3>
        <EditableSpan value={props.todolist.title} onChange={changeTodolistTitleCallback} />
      </h3>
      <AddItemForm addItem={addTaskCallback} />
      <div>
        {tasksForTodolist.map((t) => (
          <Task task={t} todolistId={props.todolist.id} key={t.id} />
        ))}
        {!tasksForTodolist.length && (
          <div style={{ color: "grey", padding: "10px" }}>Create your first task☝️</div>
        )}
      </div>
      <div style={{ paddingTop: "10px" }}>
        {renderFilterButton("inherit", "all", "All")}
        {renderFilterButton("primary", "active", "Active")}
        {renderFilterButton("secondary", "completed", "Completed")}
      </div>
    </Paper>
  )
})
