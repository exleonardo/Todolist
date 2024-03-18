import { TaskPrioties, TaskType, UpdateTaskType, todolistsApi } from '@/api/todolists-api'
import { TasksStateType } from '@/app/ui/App'
import { appActions } from '@/common/common-actions/application-common-action'
import { AppRootStateType } from '@/state/store'
import { createAppAsyncThunk } from '@/utils/create-app-async-thunk'
import { handleServerAppError } from '@/utils/error-utils'
import { createSlice } from '@reduxjs/toolkit'

// eslint-disable-next-line import/namespace
import { asyncActions as asyncTodolistsAction, clearTodosData } from './todolists-reducer'

const initialState: TasksStateType = {}

export const slice = createSlice({
  extraReducers: builder => {
    builder
      .addCase(asyncTodolistsAction.addTodolist.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = []
      })
      .addCase(asyncTodolistsAction.removeTodolist.fulfilled, (state, action) => {
        delete state[action.payload.id]
      })
      .addCase(asyncTodolistsAction.fetchTodolist.fulfilled, (state, action) => {
        action.payload.todolists.forEach(tl => {
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
        const index = tasks.findIndex(t => t.id === action.payload.taskId)

        if (index > -1) {
          tasks.splice(index, 1)
        }
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state[action.payload.task.todoListId].unshift(action.payload.task)
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId]
        const index = tasks.findIndex(t => t.id === action.payload.taskId)

        if (index > -1) {
          tasks[index] = { ...tasks[index], ...action.payload.domainModel }
        }
      })
      .addCase(changeOrderTask.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.reorderedStore
      })
  },
  initialState,
  name: 'tasks',
  reducers: {},
})
export const fetchTask = createAppAsyncThunk<{ tasks: TaskType[]; todolistId: string }, string>(
  `${slice.name}/fetchTasks`,
  async (todolistId: string) => {
    const res = await todolistsApi.getTasks(todolistId)

    return { tasks: res.data.items, todolistId }
  }
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
  }
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
      domainModel: UpdateDomainTaskModelType
      taskId: string
      todolistId: string
    },
    { dispatch, getState, rejectWithValue }
  ) => {
    const state = getState() as AppRootStateType
    const task = state.tasks[param.todolistId].find(el => el.id === param.taskId)

    if (!task) {
      dispatch(appActions.setAppError({ error: 'Task not found in the state' }))

      return rejectWithValue(null)
    }
    const apiModel: UpdateTaskType = {
      completed: task.completed,
      deadline: task.deadline,
      description: task.description,
      priority: TaskPrioties.Low,
      startDate: task.startDate,
      status: task.status,
      title: task.title,
      ...param.domainModel,
    }
    const res = await todolistsApi.updateTask(param.todolistId, param.taskId, apiModel)

    if (res.data.resultCode === 0) {
      return param
    } else {
      handleServerAppError(res.data, dispatch)

      return rejectWithValue(null)
    }
  }
)

const changeOrderTask = createAppAsyncThunk(
  `${slice.name}/changeTaskOrder`,
  async (
    {
      id,
      putAfterItemId,
      reorderedStore,
      todolistId,
    }: {
      id: string
      putAfterItemId: null | string
      reorderedStore: TaskType[]
      todolistId: string
    },
    thunkAPI
  ) => {
    const { rejectWithValue } = thunkAPI
    const res = await todolistsApi.changeTaskOrder({ id, putAfterItemId, todolistId })

    if (res.data.resultCode === 0) {
      return { reorderedStore, todolistId }
    } else {
      return rejectWithValue(res.data)
    }
  }
)

export const asyncActions = {
  addTask,
  changeOrderTask,
  fetchTask,
  removeTask,
  updateTask,
}
export type UpdateDomainTaskModelType = {
  completed?: boolean
  deadline?: string
  description?: string
  priority?: number
  startDate?: string
  status?: number
  title?: string
}
type ReturnTaskType = {
  domainModel: UpdateDomainTaskModelType
  taskId: string
  todolistId: string
}
type RemoveTaskType = {
  taskId: string
  todolistId: string
}

//types
