import {TasksStateType} from '../App';
import {v1} from 'uuid';
import {
    AddTodolistActionType ,
    RemoveTodolistActionType ,
    SetTodolistActionType ,
    setTodolistsAC
} from './todolists-reducer';
import {TaskStatuses , TaskType , todolistsApi} from "../api/todolists-api";
import {Dispatch} from "redux";

export type RemoveTaskActionType = {
    type: 'REMOVE-TASK',
    todolistId: string
    taskId: string
}

export type AddTaskActionType = {
    type: 'ADD-TASK',
    todolistId: string
    title: string
}

export type ChangeTaskStatusActionType = {
    type: 'CHANGE-TASK-STATUS',
    todolistId: string
    taskId: string
    status: TaskStatuses
}

export type ChangeTaskTitleActionType = {
    type: 'CHANGE-TASK-TITLE',
    todolistId: string
    taskId: string
    title: string
}

type ActionsType = RemoveTaskActionType | AddTaskActionType
    | ChangeTaskStatusActionType
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
            const newTask: TaskType = {
                id: v1 () ,
                title: action.title ,
                addedDate: '' ,
                completed: false ,
                deadline: '' ,
                order: 0 ,
                description: '' ,
                priority: 0 ,
                startDate: '' ,
                todoListId: action.todolistId ,
                status: TaskStatuses.New
            }
            return { ...state , [action.todolistId]: [newTask , ...state[action.todolistId]] }
        }
        case 'CHANGE-TASK-STATUS': {
            return {
                ...state ,
                [action.todolistId]: state[action.todolistId].map ( el => el.id === action.taskId ? {
                    ...el ,
                    status: action.status
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
                [action.todolistId]: []
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

export const removeTaskAC = (taskId: string , todolistId: string): RemoveTaskActionType => {
    return { type: 'REMOVE-TASK' , taskId , todolistId }
}
export const addTaskAC = (title: string , todolistId: string): AddTaskActionType => {
    return { type: 'ADD-TASK' , title , todolistId }
}
export const changeTaskStatusAC = (taskId: string , status: TaskStatuses , todolistId: string): ChangeTaskStatusActionType => {
    return { type: 'CHANGE-TASK-STATUS' , status , todolistId , taskId }
}
export const changeTaskTitleAC = (taskId: string , title: string , todolistId: string): ChangeTaskTitleActionType => {
    return { type: 'CHANGE-TASK-TITLE' , title , todolistId , taskId }
}
export const setTasksAC = (tasks: Array<TaskType> , todolistId: string): SetTasksActionType => {
    return {
        type: "SET-TASKS" ,
        tasks ,
        todolistId
    }
}
export const fetchTaskTC = (todolistId: string): any => {
    return (dispatch: Dispatch) => {
        todolistsApi.getTasks ( todolistId ).then ( (res) => {
            dispatch ( setTasksAC ( res.data.items , todolistId ) )
        } )
    }
}

