import { Task } from "./Task"
import React from "react"
import { TaskPrioties, TaskStatuses } from "api/todolists-api"
import { ReduxStoreProviderDecorator } from "redux-store-decorator"

export default {
  title: "Task Component",
  component: Task,
  parameters: {
    layout: "centered",
  },
  decorators: [ReduxStoreProviderDecorator],
}

export const TaskBaseExample = () => {
  return (
    <>
      <Task
        task={{
          id: "1",
          status: TaskStatuses.Completed,
          title: "CSS",
          startDate: "",
          deadline: "",
          addedDate: "",
          order: 0,
          priority: TaskPrioties.Low,
          completed: false,
          description: "",
          todoListId: "todolistID1",
        }}
        todolistId={"todolistID1"}
      />
      <Task
        task={{
          id: "2",
          status: TaskStatuses.New,
          title: "JS",
          startDate: "",
          deadline: "",
          addedDate: "",
          order: 0,
          priority: TaskPrioties.Low,
          completed: false,
          description: "",
          todoListId: "todolistID2",
        }}
        todolistId={"todolistID2"}
      />
    </>
  )
}
