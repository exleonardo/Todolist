import { todolistsApi, TodolistType } from "api/todolists-api"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { createAppAsyncThunk } from "common/utils/createAppAsyncThunk"
import { AxiosError, isAxiosError } from "axios"
import { handleServerAppError, handleServerNetworkError } from "common/utils/error-utils"
import { fetchTask } from "features/TodolistsList/tasksReducer"
import { ThunkError } from "state/store"
import { RequestStatusType } from "features/Application"
import { appActions } from "features/CommonActions/ApplicationCommonAction"

export const slice = createSlice({
  name: "todolists",
  initialState: [] as TodolistDomainType[],
  reducers: {
    changeTodolistFilter(state, action: PayloadAction<{ id: string; filter: FilterValuesType }>) {
      const index = state.findIndex((tl) => tl.id === action.payload.id)
      if (index > -1) {
        state[index].filter = action.payload.filter
      }
    },
    changeTodolistEntityStatus(
      state,
      action: PayloadAction<{ id: string; status: RequestStatusType }>,
    ) {
      const index = state.findIndex((tl) => tl.id === action.payload.id)
      if (index > -1) {
        state[index].entityStatus = action.payload.status
      }
    },
    clearTodosData() {
      return []
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTodolist.fulfilled, (state, action) => {
      return action.payload.todolists.map((el) => ({ ...el, filter: "all", entityStatus: "idle" }))
    })
    builder.addCase(removeTodolist.fulfilled, (state, action) => {
      const index = state.findIndex((tl) => tl.id === action.payload.id)
      if (index > -1) {
        state.splice(index, 1)
      }
    })
    builder.addCase(addTodolist.fulfilled, (state, action) => {
      state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" })
    })
    builder.addCase(changeTodolistTitle.fulfilled, (state, action) => {
      const index = state.findIndex((tl) => tl.id === action.payload.id)
      if (index > -1) {
        state[index].title = action.payload.title
      }
    })
  },
})

const fetchTodolist = createAppAsyncThunk<{ todolists: TodolistType[] }>(
  `${slice.name}/fetchTodolists`,
  async (param, { dispatch, rejectWithValue }) => {
    dispatch(appActions.setAppStatus({ status: "loading" }))
    try {
      const res = await todolistsApi.getTodolists()
      dispatch(appActions.setAppStatus({ status: "succesed" }))

      const todos = res.data
      todos.forEach((tl) => {
        dispatch(fetchTask(tl.id))
      })
      return { todolists: res.data }
    } catch (error) {
      if (isAxiosError(error)) handleServerNetworkError(error, dispatch)
      return rejectWithValue(null)
    }
  },
)
const removeTodolist = createAppAsyncThunk(
  `${slice.name}/removeTodolists`,
  async (todolistId: string, { dispatch }) => {
    dispatch(appActions.setAppStatus({ status: "loading" }))
    dispatch(changeTodolistEntityStatus({ id: todolistId, status: "loading" }))
    await todolistsApi.deleteTodolist(todolistId)
    dispatch(appActions.setAppStatus({ status: "succesed" }))
    return { id: todolistId }
  },
)
const addTodolist = createAppAsyncThunk<{ todolist: TodolistType }, string, ThunkError>(
  `${slice.name}/addTodolists`,
  async (title, { dispatch, rejectWithValue }) => {
    dispatch(appActions.setAppStatus({ status: "loading" }))
    try {
      const res = await todolistsApi.createTodolist(title)
      if (res.data.resultCode === 0) {
        dispatch(appActions.setAppStatus({ status: "succesed" }))
        return { todolist: res.data.data.item }
      } else {
        handleServerAppError(res.data, dispatch, false)
        return rejectWithValue({
          errors: res.data.messages,
          fieldsErrors: res.data.fieldsErrors,
        })
      }
    } catch (err) {
      if (isAxiosError(err)) handleServerNetworkError(err, dispatch)
      const error = err as AxiosError
      return rejectWithValue({
        errors: [error.message],
        fieldsErrors: undefined,
      })
    }
  },
)
const changeTodolistTitle = createAppAsyncThunk<
  { id: string; title: string },
  { id: string; title: string }
>(`${slice.name}/changeTodolistTitle`, async ({ id, title }, { dispatch, rejectWithValue }) => {
  try {
    const res = await todolistsApi.updateTodolistTitle(id, title)
    if (res.data.resultCode === 0) {
      dispatch(appActions.setAppStatus({ status: "succesed" }))
      return { id, title }
    } else {
      handleServerAppError(res.data, dispatch, false)
      return rejectWithValue({
        errors: res.data.messages,
        fieldsErrors: res.data.fieldsErrors,
      })
    }
  } catch (err) {
    if (isAxiosError(err)) handleServerNetworkError(err, dispatch)
    const error = err as AxiosError
    return rejectWithValue({
      errors: [error.message],
      fieldsErrors: undefined,
    })
  }
})
export const asyncActions = {
  fetchTodolist,
  removeTodolist,
  changeTodolistTitle,
  addTodolist,
}

export const { changeTodolistFilter, changeTodolistEntityStatus, clearTodosData } = slice.actions

//types

export type FilterValuesType = "all" | "active" | "completed"
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}
