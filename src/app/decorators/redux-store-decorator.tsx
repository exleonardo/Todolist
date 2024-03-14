import React from 'react'
import { Provider } from 'react-redux'
import { v1 } from 'uuid'

import { TaskPrioties, TaskStatuses } from '@/api/todolists-api'
import { AppRootStateType } from '@/state/store'
import { thunk } from 'redux-thunk'
import { configureStore } from '@reduxjs/toolkit'
import { MemoryRouter } from 'react-router-dom'
import { tasksReducer, todolistsReducer } from '@/features/todolists-list'
import { appReducer } from '@/app'
import { authReducer } from '@/pages/auth'

const initialGlobalState: AppRootStateType = {
  todolists: [
    {
      id: 'todolistId1',
      title: 'What to learn',
      filter: 'all',
      addedDate: '',
      order: 0,
      entityStatus: 'idle',
    },
    {
      id: 'todolistId2',
      title: 'What to buy',
      filter: 'all',
      addedDate: '',
      order: 0,
      entityStatus: 'idle',
    },
  ],
  tasks: {
    todolistId1: [
      {
        id: v1(),
        title: 'HTML&CSS',
        status: TaskStatuses.Completed,
        todoListId: 'todolistId1',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPrioties.Low,
        completed: false,
        description: '',
      },
      {
        id: v1(),
        title: 'JS',
        status: TaskStatuses.Completed,
        todoListId: 'todolistId1',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPrioties.Low,
        completed: false,
        description: '',
      },
    ],
    todolistId2: [
      {
        id: v1(),
        title: 'Milk',
        status: TaskStatuses.Completed,
        todoListId: 'todolistId2',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPrioties.Low,
        completed: false,
        description: '',
      },
      {
        id: v1(),
        title: 'React Book',
        status: TaskStatuses.Completed,
        todoListId: 'todolistId2',
        startDate: '',
        deadline: '',
        addedDate: '',
        order: 0,
        priority: TaskPrioties.Low,
        completed: false,
        description: '',
      },
    ],
  },
  app: {
    error: null,
    status: 'succesed',
    isInitialized: true,
  },
  login: {
    isLoggedIn: true,
  },
}

export const storyBookStore = configureStore({
  reducer: {
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    login: authReducer,
  },
  preloadedState: initialGlobalState,
  middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunk),
})

export const ReduxStoreProviderDecorator = (storyFn: () => React.ReactNode) => {
  return (
    <MemoryRouter>
      <Provider store={storyBookStore}>{storyFn()}</Provider>
    </MemoryRouter>
  )
}
