import {FilterValuesType , TodolistType} from '../AppWithRedux';
import {v1} from 'uuid';

export type RemoveTodolistActionType = {
    type: 'REMOVE-TODOLIST',
    todolistId: string
}
export type AddTodolistActionType = {
    todolistId: string;
    type: 'ADD-TODOLIST',
    title: string
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

type ActionsType =
    RemoveTodolistActionType
    | AddTodolistActionType
    | ChangeTodolistTitleActionType
    | ChangeTodolistFilterActionType;


const initialState: Array<TodolistType> = []
export const todolistsReducer = (state: Array<TodolistType> = initialState , action: ActionsType): TodolistType[] => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter ( tl => tl.id != action.todolistId )
        case 'ADD-TODOLIST':
            return [{ id: action.todolistId , title: action.title , filter: "all" } , ...state]
        case 'CHANGE-TODOLIST-TITLE':
            return state.map ( (el) => el.id === action.id ? { ...el , title: action.title } : el )
        case 'CHANGE-TODOLIST-FILTER': {
            return state.map ( (el) => el.id === action.id ? { ...el , filter: action.filter } : el )
        }
        default:
            return state
    }
}

export const removeTodolistAC = (todolistId: string): RemoveTodolistActionType => {
    return { type: 'REMOVE-TODOLIST' , todolistId }
}
export const addTodolistAC = (title: string): AddTodolistActionType => {
    return { type: 'ADD-TODOLIST' , title: title , todolistId: v1 () }
}
export const changeTodolistTitleAC = (todolistId: string , title: string): ChangeTodolistTitleActionType => {
    return { type: 'CHANGE-TODOLIST-TITLE' , title: title , id: todolistId }
}
export const changeTodolistFilterAC = (todolistId: string , filter: FilterValuesType): ChangeTodolistFilterActionType => {
    return { type: 'CHANGE-TODOLIST-FILTER' , filter: filter , id: todolistId }
}
