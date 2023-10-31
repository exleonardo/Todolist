import {todolistsApi , TodolistType} from "../api/todolists-api";
import {Dispatch} from "redux";
import {AppThunk} from "./store";
import {RequestStatusType , setAppStatusAC} from "../app/app-reducer";
import {handleServerNetworkError} from "../utils/error-utils";


const initialState: Array<TodolistDomainType> = []

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState , action: ActionsTodolistsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter ( tl => tl.id !== action.id )
        case 'ADD-TODOLIST':
            return [{ ...action.todolist , filter: 'all' , entityStatus: "idle" } , ...state]
        case 'CHANGE-TODOLIST-TITLE':
            return state.map ( el => el.id === action.id ? { ...el , title: action.title } : el )
        case 'CHANGE-TODOLIST-FILTER':
            return state.map ( el => el.id === action.id ? { ...el , filter: action.filter } : el )
        case "CHANGE-TODOLIST-ENTITY-STATUS":
            return state.map ( el => el.id === action.id ? { ...el , entityStatus: action.status } : el )
        case "SET-TODOLISTS":
            return action.todolists.map ( el => ({ ...el , filter: 'all' , entityStatus: "idle" }) )
        default:
            return state;
    }
}

//Actions
export const removeTodolistAC = (id: string) => ({ type: 'REMOVE-TODOLIST' , id } as const)
export const addTodolistAC = (todolist: TodolistType) => ({
    type: 'ADD-TODOLIST' ,
    todolist
} as const)
export const changeTodolistTitleAC = (id: string , title: string) => ({
    type: 'CHANGE-TODOLIST-TITLE' ,
    id ,
    title
} as const)
export const changeTodolistFilterAC = (id: string , filter: FilterValuesType) => ({
    type: 'CHANGE-TODOLIST-FILTER' ,
    id ,
    filter
} as const)
export const setTodolistsAC = (todolists: Array<TodolistType>) => ({
    type: "SET-TODOLISTS" ,
    todolists
} as const)
export const changeTodolistEntityStatusAC = (id: string , status: RequestStatusType) => ({
    type: 'CHANGE-TODOLIST-ENTITY-STATUS' ,
    id ,
    status
} as const)
//Thunk
export const fetchTodolistTC = (): AppThunk => {
    return (dispatch) => {
        dispatch ( setAppStatusAC ( { status: 'loading' } ) )
        todolistsApi.getTodolists ().then ( (res) => {
            dispatch ( setTodolistsAC ( res.data ) )
            dispatch ( setAppStatusAC ( { status: 'succesed' } ) )
        } ).catch ( (error) => {
            handleServerNetworkError ( error , dispatch )
        } )
    }
}
export const removeTodolistTC = (todolistId: string): AppThunk => {
    return (dispatch) => {
        dispatch ( setAppStatusAC ( { status: 'loading' } ) )
        dispatch ( changeTodolistEntityStatusAC ( todolistId , 'loading' ) )
        todolistsApi.deleteTodolist ( todolistId ).then ( (res) =>
            dispatch ( removeTodolistAC ( todolistId ) ) )
        dispatch ( setAppStatusAC ( { status: 'succesed' } ) )
    }
}
export const addTodolistTC = (title: string): AppThunk => {
    return dispatch => {
        dispatch ( setAppStatusAC ( { status: 'loading' } ) )
        todolistsApi.createTodolist ( title ).then ( (res) => {
            dispatch ( addTodolistAC ( res.data.data.item ) )
            dispatch ( setAppStatusAC ( { status: 'succesed' } ) )
        } )
    }
}
export const changeTodolistTitleTC = (id: string , title: string): AppThunk => {
    return dispatch => {
        todolistsApi.updateTodolistTitle ( id , title ).then ( (res) => {
            dispatch ( changeTodolistTitleAC ( id , title ) )
        } )
    }
}


//types
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type SetTodolistActionType = ReturnType<typeof setTodolistsAC>
export type ActionsTodolistsType =
    ReturnType<typeof removeTodolistAC>
    | ReturnType<typeof addTodolistAC>
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | ReturnType<typeof setTodolistsAC>
    | ReturnType<typeof changeTodolistEntityStatusAC>
export type FilterValuesType = "all" | "active" | "completed";

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}
