import { TasksStateType } from "app/App"
import { clearTodosData } from "features/TodolistsList/todolistsReducer"
import { asyncActions as asyncTodolistsAction } from "features/TodolistsList/todolistsReducer"
import { createSlice } from "@reduxjs/toolkit"
import { createAppAsyncThunk } from "common/utils/createAppAsyncThunk"
import { TaskPrioties, TaskType, todolistsApi, UpdateTaskType } from "api/todolists-api"
import { setAppStatusAC } from "app/appReducer"
import { isAxiosError } from "axios"
import { handleServerAppError, handleServerNetworkError } from "common/utils/error-utils"
import { AppRootStateType } from "state/store"

const initialState: TasksStateType = {}
const slice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(asyncTodolistsAction.addTodolist.fulfilled, (state, action) => {
      state[action.payload.todolist.id] = []
    })
    builder.addCase(asyncTodolistsAction.removeTodolist.fulfilled, (state, action) => {
      delete state[action.payload.id]
    })
    builder.addCase(asyncTodolistsAction.fetchTodolist.fulfilled, (state, action) => {
      action.payload.todolists.forEach((tl) => {
        state[tl.id] = []
      })
    })
    builder.addCase(clearTodosData, () => {
      return {}
    })
    builder.addCase(fetchTask.fulfilled, (state, action) => {
      state[action.payload.todolistId] = action.payload.tasks
    })
    builder.addCase(removeTask.fulfilled, (state, action) => {
      const tasks = state[action.payload.todolistId]
      const index = tasks.findIndex((t) => t.id === action.payload.taskId)
      if (index > -1) {
        tasks.splice(index, 1)
      }
    })
    builder.addCase(addTask.fulfilled, (state, action) => {
      state[action.payload.task.todoListId].unshift(action.payload.task)
    })
    builder.addCase(updateTask.fulfilled, (state, action) => {
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
  async (todolistId: string, { dispatch, rejectWithValue }) => {
    dispatch(setAppStatusAC({ status: "loading" }))
    try {
      const res = await todolistsApi.getTasks(todolistId)
      dispatch(setAppStatusAC({ status: "succesed" }))
      return { tasks: res.data.items, todolistId }
    } catch (error) {
      if (isAxiosError(error)) {
        handleServerNetworkError(error, dispatch)
      }
      return rejectWithValue(null)
    }
  },
)
export const removeTask = createAppAsyncThunk<RemoveTaskType, RemoveTaskType>(
  `${slice.name}/removeTask`,
  async (param: RemoveTaskType, { dispatch, rejectWithValue }) => {
    try {
      await todolistsApi.deleteTask(param.todolistId, param.taskId)
      return { taskId: param.taskId, todolistId: param.todolistId }
    } catch (error) {
      handleServerNetworkError(error, dispatch)
      return rejectWithValue(null)
    }
  },
)
export const addTask = createAppAsyncThunk(
  `${slice.name}/addTask`,
  async (
    {
      title,
      todolistId,
    }: {
      title: string
      todolistId: string
    },
    { dispatch, rejectWithValue },
  ) => {
    dispatch(setAppStatusAC({ status: "loading" }))

    try {
      const res = await todolistsApi.createTask(todolistId, title)
      if (res.data.resultCode === 0) {
        dispatch(setAppStatusAC({ status: "succesed" }))
        return { task: res.data.data.item }
      } else {
        handleServerAppError(res.data, dispatch)
        return rejectWithValue(null)
      }
    } catch (error) {
      if (isAxiosError(error)) handleServerNetworkError(error, dispatch)
      return rejectWithValue(null)
    }
  },
)
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

    try {
      const res = await todolistsApi.updateTask(param.todolistId, param.taskId, apiModel)
      if (res.data.resultCode === 0) {
        return param
      } else {
        handleServerAppError(res.data, dispatch)
        return rejectWithValue(null)
      }
    } catch (error) {
      if (isAxiosError(error)) handleServerNetworkError(error, dispatch)
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
export const tasksReducer = slice.reducer

//types
