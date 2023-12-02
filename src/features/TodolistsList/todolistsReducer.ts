import { todolistsApi, TodolistType } from "api/todolists-api"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { createAppAsyncThunk } from "common/utils/createAppAsyncThunk"
import { fetchTask } from "features/TodolistsList/tasksReducer"
import { RequestStatusType } from "features/Application"
import { appActions } from "features/CommonActions/ApplicationCommonAction"
import { thunkTryCatch } from "common/utils/thunkTryCatch"

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
    builder
      .addCase(fetchTodolist.fulfilled, (state, action) => {
        return action.payload.todolists.map((el) => ({
          ...el,
          filter: "all",
          entityStatus: "idle",
        }))
      })
      .addCase(removeTodolist.fulfilled, (state, action) => {
        const index = state.findIndex((tl) => tl.id === action.payload.id)
        if (index > -1) {
          state.splice(index, 1)
        }
      })
      .addCase(addTodolist.fulfilled, (state, action) => {
        state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" })
      })
      .addCase(changeTodolistTitle.fulfilled, (state, action) => {
        const index = state.findIndex((tl) => tl.id === action.payload.id)
        if (index > -1) {
          state[index].title = action.payload.title
        }
      })
  },
})

const fetchTodolist = createAppAsyncThunk<{ todolists: TodolistType[] }>(
  `${slice.name}/fetchTodolists`,
  async (param, thunkAPI) => {
    const { dispatch } = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
      const res = await todolistsApi.getTodolists()
      dispatch(appActions.setAppStatus({ status: "succesed" }))
      const todos = res.data
      todos.forEach((tl) => {
        dispatch(fetchTask(tl.id))
      })
      return { todolists: res.data }
    })
  },
)
const removeTodolist = createAppAsyncThunk(
  `${slice.name}/removeTodolists`,
  async (todolistId: string, thunkAPI) => {
    const { dispatch } = thunkAPI
    await todolistsApi.deleteTodolist(todolistId)
    return { id: todolistId }
  },
)
const addTodolist = createAppAsyncThunk<{ todolist: TodolistType }, string>(
  `${slice.name}/addTodolists`,
  async (title, thunkAPI) => {
    const { rejectWithValue } = thunkAPI
    const res = await todolistsApi.createTodolist(title)
    if (res.data.resultCode === 0) {
      return { todolist: res.data.data.item }
    } else {
      return rejectWithValue(res.data)
    }
  },
)
const changeTodolistTitle = createAppAsyncThunk<
  { id: string; title: string },
  { id: string; title: string }
>(`${slice.name}/changeTodolistTitle`, async ({ id, title }, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI
  const res = await todolistsApi.updateTodolistTitle(id, title)
  if (res.data.resultCode === 0) {
    return { id, title }
  } else {
    return rejectWithValue(res.data)
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
