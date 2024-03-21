import axios from 'axios'

const setting = {
  headers: {
    'API-KEY': '760288e7-5c83-412d-9a2d-8ad74cba4b0f',
  },
  withCredentials: true,
}
const instanse = axios.create({
  baseURL: 'https://social-network.samuraijs.com/api/1.1/',
  ...setting,
})

//API
export const todolistsApi = {
  changeTaskOrder({
    id,
    putAfterItemId,
    todolistId,
  }: {
    id: string
    putAfterItemId: null | string
    todolistId: string
  }) {
    return instanse.put<BaseResponseType>(`todo-lists/${todolistId}/tasks/${id}/reorder`, {
      putAfterItemId,
    })
  },
  changeTodolistOrder({ id, putAfterItemId }: { id: string; putAfterItemId: null | string }) {
    return instanse.put<BaseResponseType>(`todo-lists/${id}/reorder`, { putAfterItemId })
  },
  createTask(todolistId: string, title: string) {
    return instanse.post<BaseResponseType<{ item: TaskType }>>(`todo-lists/${todolistId}/tasks`, {
      title: title,
    })
  },
  createTodolist(title: string) {
    return instanse.post<BaseResponseType<{ item: TodolistType }>>('todo-lists', { title: title })
  },
  deleteTask(todolistId: string, taskId: string) {
    return instanse.delete<BaseResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`)
  },
  deleteTodolist(id: string) {
    return instanse.delete<BaseResponseType>(`todo-lists/${id}`)
  },
  getTasks(todolistId: string) {
    return instanse.get<GetTaskResponse>(`todo-lists/${todolistId}/tasks`)
  },
  getTodolists() {
    return instanse.get<TodolistType[]>('todo-lists')
  },
  updateTask(todolistId: string, taskId: string, model: UpdateTaskType) {
    return instanse.put<BaseResponseType<TaskType>>(
      `todo-lists/${todolistId}/tasks/${taskId}`,
      model
    )
  },
  updateTodolistTitle(id: string, title: string) {
    return instanse.put<BaseResponseType>(`todo-lists/${id}`, { title })
  },
}
export const authApi = {
  login(data: LoginParamsType) {
    return instanse.post<BaseResponseType<{ userId?: number }>>('auth/login', data)
  },
  logout() {
    return instanse.delete<BaseResponseType>('auth/login')
  },
  me() {
    return instanse.get<BaseResponseType<{ email: string; id: number; login: string }>>('auth/me')
  },
}
//Types
export type LoginParamsType = {
  captcha?: string
  email: string
  password: string
  rememberMe: boolean
}
export type TodolistType = {
  addedDate: string
  id: string
  order: number
  title: string
}
export type FieldErrorType = { error: string; field: string }
export type BaseResponseType<D = NonNullable<unknown>> = {
  data: D
  fieldsErrors?: FieldErrorType[]
  messages: string[]
  resultCode: number
}

export enum TaskStatuses {
  New,
  InProgress,
  Completed,
  Draft,
}

export enum TaskPrioties {
  Low,
  Middle,
  Hi,
  Urgently,
  Later,
}

export type TaskType = {
  addedDate: string
  completed: boolean
  deadline: string
  description: string
  id: string
  order: number
  priority: TaskPrioties
  startDate: string
  status: TaskStatuses
  title: string
  todoListId: string
}
type GetTaskResponse = {
  error: null | string
  items: TaskType[]
  totalCount: number
}
export type UpdateTaskType = {
  completed: boolean
  deadline: null | string
  description: string
  priority: number
  startDate: null | string
  status: number
  title: string
}
