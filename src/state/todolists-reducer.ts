import {FilterValuesType , TodolistType} from '../App';
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
export let todolistId1 = v1 ();
export let todolistId2 = v1 ();

const initialState: Array<TodolistType> = [
    { id: todolistId1 , title: "What to learn" , filter: "all" } ,
    { id: todolistId2 , title: "What to buy" , filter: "all" }
]
export const todolistsReducer = (state: Array<TodolistType> = initialState , action: ActionsType): TodolistType[] => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter ( tl => tl.id != action.todolistId )
        case 'ADD-TODOLIST':
            return [{ id: action.todolistId , title: action.title , filter: "all" } , ...state]
        case 'CHANGE-TODOLIST-TITLE': {
            const todolist = state.find ( tl => tl.id === action.id );
            if ( todolist ) {
                // если нашёлся - изменим ему заголовок
                todolist.title = action.title;
            }
            return [...state]
        }
        case 'CHANGE-TODOLIST-FILTER': {
            const todolist = state.find ( tl => tl.id === action.id );
            if ( todolist ) {
                // если нашёлся - изменим ему заголовок
                todolist.filter = action.filter;
            }
            return [...state];
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
