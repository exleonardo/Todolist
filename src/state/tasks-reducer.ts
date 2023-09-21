import {TasksStateType} from '../App';
import {
    AddTodolistActionType ,
    RemoveTodolistActionType ,
    SetTodolistActionType ,
} from './todolists-reducer';
import {TaskPrioties , TaskType , todolistsApi , UpdateTaskType} from "../api/todolists-api";
import {Dispatch} from "redux";
import {AppRootStateType} from "./store";

export type RemoveTaskActionType = {
    type: 'REMOVE-TASK',
    todolistId: string
    taskId: string
}

export type AddTaskActionType = {
    type: 'ADD-TASK',
    task: TaskType
}

export type UpdateTaskActionType = {
    type: 'UPDATE-TASK',
    todolistId: string
    taskId: string
    model: UpdateDomainTaskModelType
}

export type ChangeTaskTitleActionType = {
    type: 'CHANGE-TASK-TITLE',
    todolistId: string
    taskId: string
    title: string
}

type ActionsType = RemoveTaskActionType | AddTaskActionType
    | UpdateTaskActionType
    | ChangeTaskTitleActionType
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistActionType
    | SetTasksActionType

const initialState: TasksStateType = {}
export type SetTasksActionType = {
    type: "SET-TASKS"
    tasks: Array<TaskType>;
    todolistId: string
}
export const tasksReducer = (state: TasksStateType = initialState , action: ActionsType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK': {
            return {
                ...state ,
                [action.todolistId]: state[action.todolistId].filter ( (el) => el.id !== action.taskId )
            }
        }
        case 'ADD-TASK': {
            const newTask: TaskType = action.task
            return { ...state , [action.task.todoListId]: [newTask , ...state[action.task.todoListId]] }
        }
        case 'UPDATE-TASK': {
            return {
                ...state ,
                [action.todolistId]: state[action.todolistId].map ( el => el.id === action.taskId ? {
                    ...el ,
                    ...action.model
                } : el )
            }

        }
        case 'CHANGE-TASK-TITLE': {

            return {
                ...state ,
                [action.todolistId]: state[action.todolistId].map ( el => el.id === action.taskId ? {
                    ...el ,
                    title: action.title
                } : el )
            }
        }
        case 'ADD-TODOLIST': {
            return {
                ...state ,
                [action.todolist.id]: []
            }
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
        case "SET-TASKS": {
            const copyState = { ...state }
            copyState[action.todolistId] = action.tasks
            return copyState
        }
        default:
            return state;
    }
}

export const removeTaskAC = (taskId: string , todolistId: string): RemoveTaskActionType => ({
    type: 'REMOVE-TASK' ,
    taskId ,
    todolistId
}) as const

export const addTaskAC = (task: TaskType): AddTaskActionType => ({
    type: 'ADD-TASK' ,
    task
}) as const

export const updateTaskAC = (taskId: string , model: UpdateDomainTaskModelType , todolistId: string): UpdateTaskActionType => ({
    type: 'UPDATE-TASK' ,
    model ,
    todolistId ,
    taskId
}) as const

export const changeTaskTitleAC = (taskId: string , title: string , todolistId: string): ChangeTaskTitleActionType => ({
    type: 'CHANGE-TASK-TITLE' ,
    title ,
    todolistId ,
    taskId
}) as const

export const setTasksAC = (tasks: Array<TaskType> , todolistId: string): SetTasksActionType => ({
    type: "SET-TASKS" ,
    tasks ,
    todolistId
}) as const

export const fetchTaskTC = (todolistId: string): any => {
    return (dispatch: Dispatch) => {
        todolistsApi.getTasks ( todolistId ).then ( (res) => {
            dispatch ( setTasksAC ( res.data.items , todolistId ) )
        } )
    }
}

export const removeTaskTC = (taskId: string , todolistId: string): any => {
    return (dispatch: Dispatch) => {
        todolistsApi.deleteTask ( todolistId , taskId ).then ( (res) => {
            const action = removeTaskAC ( taskId , todolistId )
            dispatch ( action )
        } )
    }
}
export const addTaskTC = (title: string , todolistId: string ,): any => {
    return (dispatch: Dispatch) => {
        todolistsApi.createTask ( todolistId , title ).then ( (res) => {
            const action = addTaskAC ( res.data.data.item )
            dispatch ( action )
        } )
    }
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
export const updateTaskTC = (taskId: string , domainModel: UpdateDomainTaskModelType , todolistId: string): any => {

    return (dispatch: Dispatch , getState: () => AppRootStateType) => {
        const state = getState ()
        const task = state.tasks[todolistId].find ( el => el.id === taskId );
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
}

