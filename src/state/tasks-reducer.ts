import {AddTodolistActionType , RemoveTodolistActionType , SetTodolistActionType ,} from './todolists-reducer';
import {TaskPrioties , TaskType , todolistsApi , UpdateTaskType} from "../api/todolists-api";
import {AppRootStateType , AppThunk} from "./store";
import {Dispatch} from "redux";
import {TasksStateType} from "../app/App";
import {setAppStatusAC , SetErrorActionType , SetStatusActionType} from "../app/app-reducer";
import {handleServerAppError , handleServerNetworkError} from "../utils/error-utils";


const initialState: TasksStateType = {}
export const tasksReducer = (state: TasksStateType = initialState , action: ActionsTaskType): TasksStateType => {
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
} as const)
export const addTaskAC = (task: TaskType) => ({
    type: 'ADD-TASK' ,
    task
} as const)
export const updateTaskAC = (taskId: string , model: UpdateDomainTaskModelType , todolistId: string) => ({
    type: 'UPDATE-TASK' ,
    model ,
    todolistId ,
    taskId
} as const)
export const setTasksAC = (tasks: Array<TaskType> , todolistId: string) => ({
    type: "SET-TASKS" ,
    tasks ,
    todolistId
} as const)

// Thunks
export const fetchTaskTC = (todolistId: string): AppThunk =>
    (dispatch: Dispatch<ActionsTaskType>) => {
        dispatch ( setAppStatusAC ( 'loading' ) )
        todolistsApi.getTasks ( todolistId ).then ( (res) => {
            dispatch ( setTasksAC ( res.data.items , todolistId ) )
            dispatch ( setAppStatusAC ( 'succesed' ) )
        } )
    }
export const removeTaskTC = (taskId: string , todolistId: string): AppThunk => (dispatch: Dispatch<ActionsTaskType>) => {
    todolistsApi.deleteTask ( todolistId , taskId ).then ( (res) => {
        const action = removeTaskAC ( taskId , todolistId )
        dispatch ( action )
    } )
}
export const addTaskTC = (title: string , todolistId: string): AppThunk => (dispatch: Dispatch<ActionsTaskType>) => {
    dispatch ( setAppStatusAC ( 'loading' ) )
    todolistsApi.createTask ( todolistId , title ).then ( (res) => {
        if ( res.data.resultCode === 0 ) {
            const action = addTaskAC ( res.data.data.item )
            dispatch ( action )
            dispatch ( setAppStatusAC ( 'succesed' ) )
        } else {
            handleServerAppError ( res.data , dispatch )
        }
    } ).catch ( (error) => {
        handleServerNetworkError ( error , dispatch )
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
export const updateTaskTC = (taskId: string , domainModel: UpdateDomainTaskModelType , todolistId: string): AppThunk => (dispatch: Dispatch<ActionsTaskType> , getState: () => AppRootStateType) => {
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
        if ( res.data.resultCode === 0 ) {
            dispatch ( updateTaskAC ( taskId , domainModel , todolistId ) )
        } else {
            handleServerAppError ( res.data , dispatch )
        }
    } ).catch ( (error) => {
        handleServerNetworkError ( error , dispatch )
    } )
}

//types
export type ActionsTaskType =
    ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof updateTaskAC>
    | ReturnType<typeof setTasksAC>
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistActionType
    | SetErrorActionType
    | SetStatusActionType