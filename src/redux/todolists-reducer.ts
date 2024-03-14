import { todolistsApi, TodolistType } from '@/api/todolists-api'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { createAppAsyncThunk } from '@/utils/create-app-async-thunk'
import { fetchTask } from '@/redux/tasks-reducer'
import { RequestStatusType } from '@/app'
import { appActions } from '@/common/common-actions/application-common-action'
import { thunkTryCatch } from '@/utils/thunk-try-catch'

export const slice = createSlice({
  name: 'todolists',
  initialState: [] as TodolistDomainType[],
  reducers: {
    changeTodolistFilter(state, action: PayloadAction<{ id: string; filter: FilterValuesType }>) {
      const index = state.findIndex(tl => tl.id === action.payload.id)
      if (index > -1) {
        state[index].filter = action.payload.filter
      }
    },
    changeTodolistEntityStatus(
      state,
      action: PayloadAction<{ id: string; status: RequestStatusType }>
    ) {
      const index = state.findIndex(tl => tl.id === action.payload.id)
      if (index > -1) {
        state[index].entityStatus = action.payload.status
      }
    },
    clearTodosData() {
      return []
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTodolist.fulfilled, (_state, action) => {
        return action.payload.todolists.map(el => ({
          ...el,
          filter: 'all',
          entityStatus: 'idle',
        }))
      })
      .addCase(removeTodolist.fulfilled, (state, action) => {
        const index = state.findIndex(tl => tl.id === action.payload.id)
        if (index > -1) {
          state.splice(index, 1)
        }
      })
      .addCase(addTodolist.fulfilled, (state, action) => {
        state.unshift({ ...action.payload.todolist, filter: 'all', entityStatus: 'idle' })
      })
      .addCase(changeTodolistTitle.fulfilled, (state, action) => {
        const index = state.findIndex(tl => tl.id === action.payload.id)
        if (index > -1) {
          state[index].title = action.payload.title
        }
      })
  },
})

const fetchTodolist = createAppAsyncThunk<{ todolists: TodolistType[] }>(
  `${slice.name}/fetchTodolists`,
  async (_param, thunkAPI) => {
    const { dispatch } = thunkAPI
    return thunkTryCatch(thunkAPI, async () => {
      const res = await todolistsApi.getTodolists()
      dispatch(appActions.setAppStatus({ status: 'succesed' }))
      const todos = res.data
      todos.forEach(tl => {
        dispatch(fetchTask(tl.id))
      })
      return { todolists: res.data }
    })
  }
)
const removeTodolist = createAppAsyncThunk(
  `${slice.name}/removeTodolists`,
  async (todolistId: string) => {
    await todolistsApi.deleteTodolist(todolistId)
    return { id: todolistId }
  }
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
  }
)
const changeTodolistTitle = createAppAsyncThunk<
  { id: string; title: string },
  { id: string; title: string }
>(`${slice.name}/changeTodolistTitle`, async ({ id, title }, thunkAPI) => {
  const { rejectWithValue } = thunkAPI
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

export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}
