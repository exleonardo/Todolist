import {TasksStateType} from "../App";
import {v1} from "uuid";
import {AddTodolistActionType} from "./todolists-reducer";



export type RemoveTaskActionType = {
    type:"REMOVE-TASK";
    todoListId:string;
    taskId:string
}
export type AddTaskActionType = {
    type:"ADD-TASK";
    title:string;
    todolistId:string
}
export type ChangeTaskStatusActionType = {
    type:"CHANGE-TASK-STATUS";
    isDone:boolean;
    todolistId:string
    taskId:string
}
export type ChangeTaskTitleAtionType = {
    type:"CHANGE-TASK-TITLE";
    title:string
    todolistId:string
    taskId:string
}
export type RemoveTodolistActionType = {
    type:"REMOVE-TODOLIST"
    todolistId:string
}

type ActionType = RemoveTaskActionType|AddTaskActionType|ChangeTaskStatusActionType|ChangeTaskTitleAtionType|AddTodolistActionType|RemoveTodolistActionType

export const tasksReducer = (state:TasksStateType,action:ActionType):TasksStateType=>{
    switch (action.type){
        case "REMOVE-TASK":{
            return { ...state,[action.todoListId]:state[action.todoListId].filter(el=>el.id!==action.taskId)}
        }
        case "ADD-TASK":{
            const newTask = {id: v1(), title:action.title, isDone: false}
            return {...state,[action.todolistId]:[newTask,...state[action.todolistId]]}
        }
        case  "CHANGE-TASK-STATUS":
            return {...state,[action.todolistId]:state[action.todolistId].map((el)=>el.id===action.taskId?{...el,isDone:action.isDone}:el)}
        case "CHANGE-TASK-TITLE":
            return {...state,[action.todolistId]:state[action.todolistId].map((el)=>el.id===action.taskId?{...el,title:action.title}:el)}
        case 'ADD-TODOLIST':
            return {...state,[action.todolistId]:[]}
        case 'REMOVE-TODOLIST':
            const copyState = {...state}
            delete copyState[action.todolistId]
            return copyState
        default:
            throw new Error("I don't understand this type")
    }
}

export const removeTaskAC = (taskId:string,todoListId:string):RemoveTaskActionType=>{
    return {
        type: "REMOVE-TASK",
        todoListId,
        taskId,
    }
}

 export const addTaskAC = (title:string,todolistId:string):AddTaskActionType=>{
    return {
        type: "ADD-TASK",
        title,
        todolistId
    }
}

export const changeTaskStatusAC = (taskId:string,isDone:boolean,todolistId:string):ChangeTaskStatusActionType=>{
    return {
        type:"CHANGE-TASK-STATUS",
        isDone,
        todolistId,
        taskId
    }
}
export const changeTaskTitleAC = (taskId:string,title:string,todolistId:string):ChangeTaskTitleAtionType=>{
    return {type:"CHANGE-TASK-TITLE",taskId,title,todolistId}
}

export const removeTodolistAC = (todolistId:string):RemoveTodolistActionType=>{
    return {
        type:"REMOVE-TODOLIST",
        todolistId
    }
}