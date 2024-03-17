import React from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'

import { TaskPrioties, TaskStatuses } from '@/api/todolists-api'
import { appReducer } from '@/app'
import { tasksReducer, todolistsReducer } from '@/features/todolists-list'
import { authReducer } from '@/pages/auth'
import { AppRootStateType } from '@/state/store'
import { configureStore } from '@reduxjs/toolkit'
import { thunk } from 'redux-thunk'
import { v1 } from 'uuid'

const initialGlobalState: AppRootStateType = {
  app: {
    error: null,
    isInitialized: true,
    status: 'succesed',
  },
  login: {
    isLoggedIn: true,
  },
  tasks: {
    todolistId1: [
      {
        addedDate: '',
        completed: false,
        deadline: '',
        description: '',
        id: v1(),
        order: 0,
        priority: TaskPrioties.Low,
        startDate: '',
        status: TaskStatuses.Completed,
        title: 'HTML&CSS',
        todoListId: 'todolistId1',
      },
      {
        addedDate: '',
        completed: false,
        deadline: '',
        description: '',
        id: v1(),
        order: 0,
        priority: TaskPrioties.Low,
        startDate: '',
        status: TaskStatuses.Completed,
        title: 'JS',
        todoListId: 'todolistId1',
      },
    ],
    todolistId2: [
      {
        addedDate: '',
        completed: false,
        deadline: '',
        description: '',
        id: v1(),
        order: 0,
        priority: TaskPrioties.Low,
        startDate: '',
        status: TaskStatuses.Completed,
        title: 'Milk',
        todoListId: 'todolistId2',
      },
      {
        addedDate: '',
        completed: false,
        deadline: '',
        description: '',
        id: v1(),
        order: 0,
        priority: TaskPrioties.Low,
        startDate: '',
        status: TaskStatuses.Completed,
        title: 'React Book',
        todoListId: 'todolistId2',
      },
    ],
  },
  todolists: [
    {
      addedDate: '',
      entityStatus: 'idle',
      filter: 'all',
      id: 'todolistId1',
      order: 0,
      title: 'What to learn',
    },
    {
      addedDate: '',
      entityStatus: 'idle',
      filter: 'all',
      id: 'todolistId2',
      order: 0,
      title: 'What to buy',
    },
  ],
}

export const storyBookStore = configureStore({
  middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunk),
  preloadedState: initialGlobalState,
  reducer: {
    app: appReducer,
    login: authReducer,
    tasks: tasksReducer,
    todolists: todolistsReducer,
  },
})

export const ReduxStoreProviderDecorator = (storyFn: () => React.ReactNode) => {
  return (
    <MemoryRouter>
      <Provider store={storyBookStore}>{storyFn()}</Provider>
    </MemoryRouter>
  )
}
