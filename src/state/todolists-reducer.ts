import {todolistsApi , TodolistType} from "../api/todolists-api";
import {Dispatch} from "redux";
import {AppThunk} from "./store";
import {RequestStatusType , setStatusAC , SetStatusActionType} from "../app/app-reducer";


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
        case "SET-TODOLISTS":
            return action.todolists.map ( el => ({ ...el , filter: 'all' , entityStatus: "idle" }) )
        default:
            return state;
    }
}

//Actions
export const removeTodolistAC = (id: string) => ({ type: 'REMOVE-TODOLIST' , id }) as const
export const addTodolistAC = (todolist: TodolistType) => ({
    type: 'ADD-TODOLIST' ,
    todolist
}) as const
export const changeTodolistTitleAC = (id: string , title: string) => ({
    type: 'CHANGE-TODOLIST-TITLE' ,
    id ,
    title
}) as const
export const changeTodolistFilterAC = (id: string , filter: FilterValuesType) => ({
    type: 'CHANGE-TODOLIST-FILTER' ,
    id ,
    filter
}) as const
export const setTodolistsAC = (todolists: Array<TodolistType>) => ({
    type: "SET-TODOLISTS" ,
    todolists
}) as const

//Thunk
export const fetchTodolistTC = (): AppThunk => {
    return (dispatch: Dispatch<ActionsTodolistsType>) => {
        dispatch ( setStatusAC ( 'loading' ) )
        todolistsApi.getTodolists ().then ( (res) => {
            dispatch ( setTodolistsAC ( res.data ) )
            dispatch ( setStatusAC ( 'succesed' ) )
        } )

    }
}
export const removeTodolistTC = (todolistId: string): AppThunk => {
    return (dispatch: Dispatch) => {
        todolistsApi.deleteTodolist ( todolistId ).then ( (res) =>
            dispatch ( removeTodolistAC ( todolistId ) ) )
    }
}
export const addTodolistTC = (title: string): any => {
    return (dispatch: Dispatch<ActionsTodolistsType>) => {
        dispatch ( setStatusAC ( 'loading' ) )
        todolistsApi.createTodolist ( title ).then ( (res) => {
            dispatch ( addTodolistAC ( res.data.data.item ) )
            dispatch ( setStatusAC ( 'succesed' ) )
        } )
    }
}
export const changeTodolistTitleTC = (id: string , title: string): AppThunk => {
    return (dispatch: Dispatch<ActionsTodolistsType>) => {
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
    | SetStatusActionType
export type FilterValuesType = "all" | "active" | "completed";

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}
