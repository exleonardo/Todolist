
import {v1} from 'uuid';
import {todolistsApi , TodolistType} from "../api/todolists-api";
import {Dispatch} from "redux";





export type RemoveTodolistActionType = {
    type: 'REMOVE-TODOLIST',
    id: string
}
export type AddTodolistActionType = {
    type: 'ADD-TODOLIST',
    title: string
    todolistId: string
}
export type ChangeTodolistTitleActionType = {
    type: 'CHANGE-TODOLIST-TITLE',
    id: string
    title: string
}
export type ChangeTodolistFilterActionType = {
    type: 'CHANGE-TODOLIST-FILTER',
    id: string
    filter: FilterValuesType
}

type ActionsType = RemoveTodolistActionType | AddTodolistActionType
    | ChangeTodolistTitleActionType
    | ChangeTodolistFilterActionType
|SetTodolistActionType

export type FilterValuesType = "all" | "active" | "completed";

export type TodolistDomainType = TodolistType& {
filter:FilterValuesType
}
export type  SetTodolistActionType = {
    type:"SET-TODOLISTS";
    todolists:Array<TodolistType>;
}
const initialState: Array<TodolistDomainType> =  []

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST': {
            return state.filter(tl => tl.id !== action.id)
        }
        case 'ADD-TODOLIST': {
            return [{
                id: action.todolistId,
                title: action.title,
                filter: 'all',
                addedDate:'',
                order:0
            }, ...state]
        }
        case 'CHANGE-TODOLIST-TITLE': {
            return state.map(el=>el.id===action.id?{...el,title:action.title}:el)
        }
        case 'CHANGE-TODOLIST-FILTER': {
            return state.map(el=>el.id===action.id?{...el,filter:action.filter}:el)
        }
        case "SET-TODOLISTS":
            return action.todolists.map(el=>({...el,filter:'all'}))
        default:
            return state;
    }
}

export const removeTodolistAC = (todolistId: string): RemoveTodolistActionType => {
    return { type: 'REMOVE-TODOLIST', id: todolistId}as const
}
export const addTodolistAC = (title: string): AddTodolistActionType => {
    return { type: 'ADD-TODOLIST', title: title, todolistId: v1()}as const
}
export const changeTodolistTitleAC = (id: string, title: string): ChangeTodolistTitleActionType => {
    return { type: 'CHANGE-TODOLIST-TITLE', id: id, title: title}as const
}
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType): ChangeTodolistFilterActionType => {
    return { type: 'CHANGE-TODOLIST-FILTER', id, filter}as const
}
export const setTodolistsAC = (todolists:Array<TodolistType>): SetTodolistActionType => {
    return { type: "SET-TODOLISTS", todolists} as const
}


export const fetchTodolistTC = ():any=>{
    return (dispatch:Dispatch)=>{
        todolistsApi.getTodolists().then((res)=>dispatch(setTodolistsAC(res.data)))
    }
}