import React from 'react'
import {Provider} from "react-redux";

import {applyMiddleware , combineReducers , legacy_createStore} from "redux";

import {v1} from "uuid";
import {tasksReducer} from "./state/tasks-reducer";
import {todolistsReducer} from "./state/todolists-reducer";
import {TaskPrioties , TaskStatuses} from "./api/todolists-api";
import {AppRootStateType} from "./state/store";
import thunkMiddleWare from "redux-thunk";


const rootReducer = combineReducers ( {
    tasks: tasksReducer ,
    todolists: todolistsReducer
} )

const initialGlobalState: AppRootStateType = {
    todolists: [
        { id: "todolistId1" , title: "What to learn" , filter: "all" , addedDate: '' , order: 0 } ,
        { id: "todolistId2" , title: "What to buy" , filter: "all" , addedDate: '' , order: 0 }
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
    }
};

export const storyBookStore = legacy_createStore ( rootReducer , initialGlobalState , applyMiddleware ( thunkMiddleWare ) );


export const ReduxStoreProviderDecorator = (storyFn: () => React.ReactNode) => {
    return <Provider store={storyBookStore}>{storyFn ()}</Provider>
}
