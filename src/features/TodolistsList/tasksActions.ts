import { createAppAsyncThunk } from "common/utils/createAppAsyncThunk"
import { TaskPrioties, TaskType, todolistsApi, UpdateTaskType } from "api/todolists-api"
import { setAppStatusAC } from "app/app-reducer"
import { isAxiosError } from "axios"
import { handleServerAppError, handleServerNetworkError } from "common/utils/error-utils"
import { AppRootStateType } from "state/store"
import { tasksReducer } from "features/TodolistsList/Todolist/Task/tasks-reducer"

export const fetchTask = createAppAsyncThunk<{ tasks: TaskType[]; todolistId: string }, string>(
  `${tasksReducer.name}/fetchTasks`,
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
  `${tasksReducer.name}/removeTask`,
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
  `${tasksReducer.name}/addTask`,
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
  `${tasksReducer.name}/updateTask`,
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
