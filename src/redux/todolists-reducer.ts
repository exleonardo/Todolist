import { TodolistType, todolistsApi } from '@/api/todolists-api'
import { RequestStatusTypeProp } from '@/app'
import { appActions } from '@/common/common-actions/application-common-action'
import { fetchTask } from '@/redux/tasks-reducer'
import { createAppAsyncThunk } from '@/utils/create-app-async-thunk'
import { thunkTryCatch } from '@/utils/thunk-try-catch'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export const slice = createSlice({
  extraReducers: builder => {
    builder
      .addCase(fetchTodolist.fulfilled, (_state, action) => {
        return action.payload.todolists.map(el => ({
          ...el,
          entityStatus: 'idle',
          filter: 'all',
        }))
      })
      .addCase(removeTodolist.fulfilled, (state, action) => {
        const index = state.findIndex(tl => tl.id === action.payload.id)

        if (index > -1) {
          state.splice(index, 1)
        }
      })
      .addCase(addTodolist.fulfilled, (state, action) => {
        state.unshift({ ...action.payload.todolist, entityStatus: 'idle', filter: 'all' })
      })
      .addCase(changeTodolistTitle.fulfilled, (state, action) => {
        const index = state.findIndex(tl => tl.id === action.payload.id)

        if (index > -1) {
          state[index].title = action.payload.title
        }
      })
      .addCase(changeOrderTodo.fulfilled, (_state, action) => {
        return action.payload.reorderedStore
      })
  },
  initialState: [] as TodolistDomainType[],
  name: 'todolists',
  reducers: {
    changeTodolistEntityStatus(
      state,
      action: PayloadAction<{ id: string; status: RequestStatusTypeProp }>
    ) {
      const index = state.findIndex(tl => tl.id === action.payload.id)

      if (index > -1) {
        state[index].entityStatus = action.payload.status
      }
    },
    changeTodolistFilter(state, action: PayloadAction<{ filter: FilterValuesType; id: string }>) {
      const index = state.findIndex(tl => tl.id === action.payload.id)

      if (index > -1) {
        state[index].filter = action.payload.filter
      }
    },
    clearTodosData() {
      return []
    },
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

const changeOrderTodo = createAppAsyncThunk(
  `${slice.name}/changeTodolistOrder`,
  async (
    {
      id,
      putAfterItemId,
      reorderedStore,
    }: { id: string; putAfterItemId: null | string; reorderedStore: TodolistDomainType[] },
    thunkAPI
  ) => {
    const { rejectWithValue } = thunkAPI
    const res = await todolistsApi.changeTodolistOrder({ id, putAfterItemId })

    if (res.data.resultCode === 0) {
      return { reorderedStore }
    } else {
      return rejectWithValue(res.data)
    }
  }
)

export const asyncActions = {
  addTodolist,
  changeOrderTodo,
  changeTodolistTitle,
  fetchTodolist,
  removeTodolist,
}

export const { changeTodolistEntityStatus, changeTodolistFilter, clearTodosData } = slice.actions

//types

export type FilterValuesType = 'active' | 'all' | 'completed'
export type TodolistDomainType = TodolistType & {
  entityStatus: RequestStatusTypeProp
  filter: FilterValuesType
}
