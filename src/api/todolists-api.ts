import axios from "axios";

const setting = {
    withCredentials:true,
    headers:{
        "API-KEY":"f3eb22c4-26f8-436d-a4bb-37315a600abf"
    }
}
const instanse = axios.create({
    baseURL:'https://social-network.samuraijs.com/api/1.1/',
    ...setting
})
export type TodolistType = {
    id: string,
    title: string,
    addedDate: string,
    order: number
}


type ResponseType<D = {}> = {
    resultCode: number
    messages: Array<string>,
    data: D
}
export enum TaskStatuses{
    New ,
    InProgress,
    Completed,
    Draft
}
export enum TaskPrioties{
  Low   ,
  Middle    ,
  Hi    ,
  Urgently  ,
  Later
}
export type TaskType = {
    description: string
    title: string
    completed: boolean
    status: TaskStatuses
    priority: TaskPrioties
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}
type GetTaskResponse = {
    items:TaskType[];
    totalCount:number;
    error:string|null;
}
export type UpdateTaskType = {
    title: string
    description: string
    completed: boolean
    status: number
    priority: number
    startDate: string|null
    deadline: string|null
}

export const todolistsApi = {
    getTodolists(){
       return instanse.get<TodolistType[]>("todo-lists")
    },
    createTodolist(title:string){
       return instanse.post<ResponseType<{item:TodolistType}>>("todo-lists",{title:title})
    },
    deleteTodolist(id:string){
        return instanse.delete<ResponseType>(`todo-lists/${id}`)
    },
    updateTodolistTitle(id:string,title:string){
        return  instanse.put<ResponseType>(`todo-lists/${id}`,{title:title})
    },
    getTasks(todolistId:string){
        return instanse.get<GetTaskResponse>(`todo-lists/${todolistId}/tasks`)
    },
    deleteTask(todolistId:string,taskId:string){
        return instanse.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`)
    },
    createTask(todolistId:string,title:string){
        return instanse.post<ResponseType<TaskType>>(`todo-lists/${todolistId}/tasks`,{title:title})
    },
    updateTask(todolistId:string,taskId:string,model:UpdateTaskType){
        return instanse.put<ResponseType<TaskType>>(`todo-lists/${todolistId}/tasks/${taskId}`, model)
    }
}