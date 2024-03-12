import { TasksStateType } from "app/App"
import {
  asyncActions as asyncTodolistsAction,
  clearTodosData,
} from "features/todolists-list/todolists-reducer"
import { createSlice } from "@reduxjs/toolkit"
import { createAppAsyncThunk } from "utils/create-app-async-thunk"
import { TaskPrioties, TaskType, todolistsApi, UpdateTaskType } from "api/todolists-api"
import { handleServerAppError } from "utils/error-utils"
import { AppRootStateType } from "app/state/store"
import { appActions } from "features/common-actions/application-common-action"

const initialState: TasksStateType = {}
export const slice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(asyncTodolistsAction.addTodolist.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = []
      })
      .addCase(asyncTodolistsAction.removeTodolist.fulfilled, (state, action) => {
        delete state[action.payload.id]
      })
      .addCase(asyncTodolistsAction.fetchTodolist.fulfilled, (state, action) => {
        action.payload.todolists.forEach((tl) => {
          state[tl.id] = []
        })
      })
      .addCase(clearTodosData, () => {
        return {}
      })
      .addCase(fetchTask.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId]
        const index = tasks.findIndex((t) => t.id === action.payload.taskId)
        if (index > -1) {
          tasks.splice(index, 1)
        }
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state[action.payload.task.todoListId].unshift(action.payload.task)
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId]
        const index = tasks.findIndex((t) => t.id === action.payload.taskId)
        if (index > -1) {
          tasks[index] = { ...tasks[index], ...action.payload.domainModel }
        }
      })
  },
})
export const fetchTask = createAppAsyncThunk<{ tasks: TaskType[]; todolistId: string }, string>(
  `${slice.name}/fetchTasks`,
  async (todolistId: string, thunkAPI) => {
    const res = await todolistsApi.getTasks(todolistId)
    return { tasks: res.data.items, todolistId }
  },
)
export const removeTask = createAppAsyncThunk<RemoveTaskType, RemoveTaskType>(
  `${slice.name}/removeTask`,
  async (param: RemoveTaskType, thunkAPI) => {
    const { rejectWithValue } = thunkAPI

    const res = await todolistsApi.deleteTask(param.todolistId, param.taskId)
    if (res.data.resultCode === 0) {
      return { taskId: param.taskId, todolistId: param.todolistId }
    } else {
      return rejectWithValue(res.data)
    }
  },
)
export const addTask = createAppAsyncThunk<
  { task: TaskType },
  { title: string; todolistId: string }
>(`${slice.name}/addTask`, async ({ title, todolistId }, thunkAPI) => {
  const { rejectWithValue } = thunkAPI
  const res = await todolistsApi.createTask(todolistId, title)
  if (res.data.resultCode === 0) {
    return { task: res.data.data.item }
  } else {
    return rejectWithValue(res.data)
  }
})
export const updateTask = createAppAsyncThunk<ReturnTaskType, ReturnTaskType>(
  `${slice.name}/updateTask`,
  async (
    param: {
      taskId: string
      domainModel: UpdateDomainTaskModelType
      todolistId: string
    },
    { dispatch, getState, rejectWithValue },
  ) => {
    const state = getState() as AppRootStateType
    const task = state.tasks[param.todolistId].find((el) => el.id === param.taskId)
    if (!task) {
      dispatch(appActions.setAppError({ error: "Task not found in the state" }))
      return rejectWithValue(null)
    }
    const apiModel: UpdateTaskType = {
      deadline: task.deadline,
      priority: TaskPrioties.Low,
      startDate: task.startDate,
      description: task.description,
      title: task.title,
      status: task.status,
      completed: task.completed,
      ...param.domainModel,
    }
    const res = await todolistsApi.updateTask(param.todolistId, param.taskId, apiModel)
    if (res.data.resultCode === 0) {
      return param
    } else {
      handleServerAppError(res.data, dispatch)
      return rejectWithValue(null)
    }
  },
)
export const asyncActions = {
  updateTask,
  addTask,
  removeTask,
  fetchTask,
}
export type UpdateDomainTaskModelType = {
  title?: string
  description?: string
  completed?: boolean
  status?: number
  priority?: number
  startDate?: string
  deadline?: string
}
type ReturnTaskType = {
  taskId: string
  domainModel: UpdateDomainTaskModelType
  todolistId: string
}
type RemoveTaskType = {
  taskId: string
  todolistId: string
}

//types
