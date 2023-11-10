import { todolistsApi, TodolistType } from "api/todolists-api"
import { AppThunk } from "state/store"
import { RequestStatusType, setAppStatusAC } from "app/app-reducer"

import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { fetchTaskTC } from "./Task/tasks-reducer"
import { handleServerNetworkError } from "utils/error-utils"

const initialState: Array<TodolistDomainType> = []
const slice = createSlice({
  name: "todolists",
  initialState: initialState,
  reducers: {
    removeTodolistAC(state, action: PayloadAction<{ id: string }>) {
      const index = state.findIndex((tl) => tl.id === action.payload.id)
      if (index > -1) {
        state.splice(index, 1)
      }
    },
    addTodolistAC(state, action: PayloadAction<{ todolist: TodolistType }>) {
      state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" })
    },
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
    setTodolistsAC(state, action: PayloadAction<{ todolists: Array<TodolistType> }>) {
      return action.payload.todolists.map((el) => ({ ...el, filter: "all", entityStatus: "idle" }))
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
})
export const todolistsReducer = slice.reducer
export const {
  removeTodolistAC,
  addTodolistAC,
  changeTodolistTitleAC,
  changeTodolistFilterAC,
  setTodolistsAC,
  changeTodolistEntityStatusAC,
  clearTodosData,
} = slice.actions

//Thunk
export const fetchTodolistTC = (): AppThunk => {
  return (dispatch) => {
    dispatch(setAppStatusAC({ status: "loading" }))
    todolistsApi
      .getTodolists()
      .then((res) => {
        dispatch(setTodolistsAC({ todolists: res.data }))
        dispatch(setAppStatusAC({ status: "succesed" }))
        return res.data
      })
      .then((todos) => {
        todos.forEach((tl) => {
          dispatch(fetchTaskTC(tl.id))
        })
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch)
      })
  }
}
export const removeTodolistTC = (todolistId: string): AppThunk => {
  return (dispatch) => {
    dispatch(setAppStatusAC({ status: "loading" }))
    dispatch(changeTodolistEntityStatusAC({ id: todolistId, status: "loading" }))
    todolistsApi
      .deleteTodolist(todolistId)
      .then((res) => dispatch(removeTodolistAC({ id: todolistId })))
    dispatch(setAppStatusAC({ status: "succesed" }))
  }
}
export const addTodolistTC = (title: string): AppThunk => {
  return (dispatch) => {
    dispatch(setAppStatusAC({ status: "loading" }))
    todolistsApi.createTodolist(title).then((res) => {
      dispatch(addTodolistAC({ todolist: res.data.data.item }))
      dispatch(setAppStatusAC({ status: "succesed" }))
    })
  }
}
export const changeTodolistTitleTC = (id: string, title: string): AppThunk => {
  return (dispatch) => {
    todolistsApi.updateTodolistTitle(id, title).then((res) => {
      dispatch(changeTodolistTitleAC({ id, title }))
    })
  }
}

//types

export type FilterValuesType = "all" | "active" | "completed"
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}
