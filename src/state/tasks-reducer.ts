import {TasksStateType} from '../App';
import {AddTodolistActionType , RemoveTodolistActionType , SetTodolistActionType ,} from './todolists-reducer';
import {TaskPrioties , TaskType , todolistsApi , UpdateTaskType} from "../api/todolists-api";
import {Dispatch} from "redux";
import {AppRootStateType} from "./store";


const initialState: TasksStateType = {}
export const tasksReducer = (state: TasksStateType = initialState , action: ActionsType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK':
            return {
                ...state ,
                [action.todolistId]: state[action.todolistId].filter ( (el) => el.id !== action.taskId )
            }
        case 'ADD-TASK':
            return { ...state , [action.task.todoListId]: [action.task , ...state[action.task.todoListId]] }
        case 'UPDATE-TASK':
            return {
                ...state ,
                [action.todolistId]: state[action.todolistId]
                    .map ( el => el.id === action.taskId ? {
                        ...el ,
                        ...action.model
                    } : el )
            }
        case 'ADD-TODOLIST':
            return {
                ...state ,
                [action.todolist.id]: []
            }
        case 'REMOVE-TODOLIST': {
            const copyState = { ...state };
            delete copyState[action.id];
            return copyState;
        }
        case "SET-TODOLISTS":
            const copyState = { ...state }
            action.todolists.forEach ( (tl) => {
                copyState[tl.id] = []
            } )
            return copyState
        case "SET-TASKS":
            return { ...state , [action.todolistId]: action.tasks }
        default:
            return state;
    }
}

//Actions
export const removeTaskAC = (taskId: string , todolistId: string) => ({
    type: 'REMOVE-TASK' ,
    taskId ,
    todolistId
}) as const
export const addTaskAC = (task: TaskType) => ({
    type: 'ADD-TASK' ,
    task
}) as const
export const updateTaskAC = (taskId: string , model: UpdateDomainTaskModelType , todolistId: string) => ({
    type: 'UPDATE-TASK' ,
    model ,
    todolistId ,
    taskId
}) as const
export const setTasksAC = (tasks: Array<TaskType> , todolistId: string) => ({
    type: "SET-TASKS" ,
    tasks ,
    todolistId
}) as const

// Thunks
export const fetchTaskTC = (todolistId: string) => (dispatch: Dispatch) => {
    todolistsApi.getTasks ( todolistId ).then ( (res) => {
        dispatch ( setTasksAC ( res.data.items , todolistId ) )
    } )
}
export const removeTaskTC = (taskId: string , todolistId: string) => (dispatch: Dispatch) => {
    todolistsApi.deleteTask ( todolistId , taskId ).then ( (res) => {
        const action = removeTaskAC ( taskId , todolistId )
        dispatch ( action )
    } )
}
export const addTaskTC = (title: string , todolistId: string ,) => (dispatch: Dispatch) => {
    todolistsApi.createTask ( todolistId , title ).then ( (res) => {
        const action = addTaskAC ( res.data.data.item )
        dispatch ( action )
    } )
}
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    completed?: boolean
    status?: number
    priority?: number
    startDate?: string
    deadline?: string
}
export const updateTaskTC = (taskId: string , domainModel: UpdateDomainTaskModelType , todolistId: string): any => (dispatch: Dispatch , getState: () => AppRootStateType) => {
    const task = getState ().tasks[todolistId].find ( el => el.id === taskId )
    if ( !task ) {
        console.warn ( "Task not found" );
        return
    }
    const apiModel: UpdateTaskType = {
        deadline: task.deadline ,
        priority: TaskPrioties.Low ,
        startDate: task.startDate ,
        description: task.description ,
        title: task.title ,
        status: task.status ,
        completed: task.completed ,
        ...domainModel
    }

    todolistsApi.updateTask ( todolistId , taskId , apiModel ).then ( (res) => {
        dispatch ( updateTaskAC ( taskId , domainModel , todolistId ) )
    } )
}

//types
type ActionsType =
    ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof updateTaskAC>
    | ReturnType<typeof setTasksAC>
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistActionType