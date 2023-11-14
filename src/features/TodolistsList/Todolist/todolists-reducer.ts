import { todolistsApi, TodolistType } from "api/todolists-api"
import { RequestStatusType, setAppStatusAC } from "app/app-reducer"

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { fetchTaskTC } from "./Task/tasks-reducer"
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils"
import { isAxiosError } from "axios"

export const fetchTodolistTC = createAsyncThunk(
  "todolists/fetchTodolists",
  async (param, { dispatch, rejectWithValue }) => {
    dispatch(setAppStatusAC({ status: "loading" }))
    try {
      const res = await todolistsApi.getTodolists()
      dispatch(setAppStatusAC({ status: "succesed" }))

      const todos = res.data
      todos.forEach((tl) => {
        dispatch(fetchTaskTC(tl.id))
      })
      return { todolists: res.data }
    } catch (error) {
      if (isAxiosError(error)) handleServerNetworkError(error, dispatch)
      return rejectWithValue(null)
    }
  },
)

export const removeTodolistTC = createAsyncThunk(
  "todolists/removeTodolists",
  async (todolistId: string, { dispatch, rejectWithValue }) => {
    dispatch(setAppStatusAC({ status: "loading" }))
    dispatch(changeTodolistEntityStatusAC({ id: todolistId, status: "loading" }))
    const res = await todolistsApi.deleteTodolist(todolistId)
    dispatch(setAppStatusAC({ status: "succesed" }))
    return { id: todolistId }
  },
)

export const addTodolistTC = createAsyncThunk(
  "todolists/addTodolists",
  async (title: string, { dispatch, rejectWithValue }) => {
    dispatch(setAppStatusAC({ status: "loading" }))
    try {
      const res = await todolistsApi.createTodolist(title)
      if (res.data.resultCode === 0) {
        dispatch(setAppStatusAC({ status: "succesed" }))
        return { todolist: res.data.data.item }
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

export const changeTodolistTitleTC = createAsyncThunk(
  "todolists/changeTodolistsTitle",
  async (
    {
      id,
      title,
    }: {
      id: string
      title: string
    },
    { dispatch },
  ) => {
    const res = await todolistsApi.updateTodolistTitle(id, title)
    return { id, title }
  },
)

const slice = createSlice({
  name: "todolists",
  initialState: [] as TodolistDomainType[],
  reducers: {
    changeTodolistFilterAC(state, action: PayloadAction<{ id: string; filter: FilterValuesType }>) {
      const index = state.findIndex((tl) => tl.id === action.payload.id)
      if (index > -1) {
        state[index].filter = action.payload.filter
      }
    },
    changeTodolistEntityStatusAC(
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
    builder.addCase(fetchTodolistTC.fulfilled, (state, action) => {
      return action.payload.todolists.map((el) => ({ ...el, filter: "all", entityStatus: "idle" }))
    })
    builder.addCase(removeTodolistTC.fulfilled, (state, action) => {
      const index = state.findIndex((tl) => tl.id === action.payload.id)
      if (index > -1) {
        state.splice(index, 1)
      }
    })
    builder.addCase(addTodolistTC.fulfilled, (state, action) => {
      state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" })
    })
    builder.addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
      const index = state.findIndex((tl) => tl.id === action.payload.id)
      if (index > -1) {
        state[index].title = action.payload.title
      }
    })
  },
})
export const todolistsReducer = slice.reducer
export const { changeTodolistFilterAC, changeTodolistEntityStatusAC, clearTodosData } =
  slice.actions

//types

export type FilterValuesType = "all" | "active" | "completed"
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}
