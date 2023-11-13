import { todolistsApi, TodolistType } from "api/todolists-api"
import { AppThunk } from "state/store"
import { RequestStatusType, setAppStatusAC } from "app/app-reducer"

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { fetchTaskTC } from "./Task/tasks-reducer"
import { handleServerNetworkError } from "utils/error-utils"
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
  async (title: string, { dispatch }) => {
    dispatch(setAppStatusAC({ status: "loading" }))
    const res = await todolistsApi.createTodolist(title)
    dispatch(setAppStatusAC({ status: "succesed" }))
    return { todolist: res.data.data.item }
  },
)

export const changeTodolistTitleTC = (id: string, title: string): AppThunk => {
  return (dispatch) => {
    todolistsApi.updateTodolistTitle(id, title).then((res) => {
      dispatch(changeTodolistTitleAC({ id, title }))
    })
  }
}

const slice = createSlice({
  name: "todolists",
  initialState: [] as Array<TodolistDomainType>,
  reducers: {
    changeTodolistTitleAC(state, action: PayloadAction<{ id: string; title: string }>) {
      const index = state.findIndex((tl) => tl.id === action.payload.id)
      if (index > -1) {
        state[index].title = action.payload.title
      }
    },
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
  },
})
export const todolistsReducer = slice.reducer
export const {
  changeTodolistTitleAC,
  changeTodolistFilterAC,
  changeTodolistEntityStatusAC,
  clearTodosData,
} = slice.actions

//Thunk

// export const removeTodolistTC = (todolistId: string): AppThunk => {
//   return (dispatch) => {
//     dispatch(setAppStatusAC({ status: "loading" }))
//     dispatch(changeTodolistEntityStatusAC({ id: todolistId, status: "loading" }))
//     todolistsApi
//       .deleteTodolist(todolistId)
//       .then((res) => dispatch(removeTodolistAC({ id: todolistId })))
//     dispatch(setAppStatusAC({ status: "succesed" }))
//   }
// }
// export const addTodolistTC = (title: string): AppThunk => {
//   return (dispatch) => {
//     dispatch(setAppStatusAC({ status: "loading" }))
//     todolistsApi.createTodolist(title).then((res) => {
//       dispatch(addTodolistAC({ todolist: res.data.data.item }))
//       dispatch(setAppStatusAC({ status: "succesed" }))
//     })
//   }
// }
// export const changeTodolistTitleTC = (id: string, title: string): AppThunk => {
//   return (dispatch) => {
//     todolistsApi.updateTodolistTitle(id, title).then((res) => {
//       dispatch(changeTodolistTitleAC({ id, title }))
//     })
//   }
// }

//types

export type FilterValuesType = "all" | "active" | "completed"
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}
