import React from 'react'
import {Provider} from "react-redux";

import {combineReducers} from "redux";

import {v1} from "uuid";
import {tasksReducer} from "./features/TodolistsList/Todolist/Task/tasks-reducer";
import {todolistsReducer} from "./features/TodolistsList/Todolist/todolists-reducer";
import {TaskPrioties , TaskStatuses} from "./api/todolists-api";
import {AppRootStateType} from "./state/store";
import thunkMiddleWare from "redux-thunk";
import {appReducer} from "./app/app-reducer";
import {authReducer} from "./features/Login/authReducer";
import {configureStore} from "@reduxjs/toolkit";
import {MemoryRouter} from "react-router-dom";


const rootReducer = combineReducers ( {
    tasks: tasksReducer ,
    todolists: todolistsReducer ,
    app: appReducer ,
    auth: authReducer ,

} )

const initialGlobalState: AppRootStateType = {
    todolists: [
        {
            id: "todolistId1" ,
            title: "What to learn" ,
            filter: "all" ,
            addedDate: '' ,
            order: 0 ,
            entityStatus: "idle"
        } ,
        { id: "todolistId2" , title: "What to buy" , filter: "all" , addedDate: '' , order: 0 , entityStatus: "idle" }
    ] ,
    tasks: {
        "todolistId1": [
            {
                id: v1 () ,
                title: "HTML&CSS" ,
                status: TaskStatuses.Completed ,
                todoListId: "todolistId1" ,
                startDate: "" ,
                deadline: '' ,
                addedDate: '' ,
                order: 0 ,
                priority: TaskPrioties.Low ,
                completed: false ,
                description: ''
            } ,
            {
                id: v1 () ,
                title: "JS" ,
                status: TaskStatuses.Completed ,
                todoListId: "todolistId1" ,
                startDate: "" ,
                deadline: '' ,
                addedDate: '' ,
                order: 0 ,
                priority: TaskPrioties.Low ,
                completed: false ,
                description: ''
            }
        ] ,
        "todolistId2": [
            {
                id: v1 () ,
                title: "Milk" ,
                status: TaskStatuses.Completed ,
                todoListId: "todolistId2" ,
                startDate: "" ,
                deadline: '' ,
                addedDate: '' ,
                order: 0 ,
                priority: TaskPrioties.Low ,
                completed: false ,
                description: ''
            } ,
            {
                id: v1 () ,
                title: "React Book" ,
                status: TaskStatuses.Completed ,
                todoListId: "todolistId2" ,
                startDate: "" ,
                deadline: '' ,
                addedDate: '' ,
                order: 0 ,
                priority: TaskPrioties.Low ,
                completed: false ,
                description: ''
            }
        ]
    } ,
    app: {
        error: null ,
        status: 'succesed' ,
        isInitialized: true
    } ,
    auth: {
        isLoggedIn: true
    }
};

export const storyBookStore = configureStore ( {
    reducer: rootReducer ,
    preloadedState: initialGlobalState ,
    middleware: getDefaultMiddleware => getDefaultMiddleware ().prepend ( thunkMiddleWare )
} );


export const ReduxStoreProviderDecorator = (storyFn: () => React.ReactNode) => {
    return <MemoryRouter><Provider store={storyBookStore}>{storyFn ()}</Provider></MemoryRouter>

}
