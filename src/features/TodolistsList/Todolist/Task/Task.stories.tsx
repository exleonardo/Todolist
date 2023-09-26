import {Task} from "./Task";
import React from "react";
import {action} from '@storybook/addon-actions'
import {TaskPrioties , TaskStatuses} from "../../../../api/todolists-api";

export default {
    title: "Task Component" ,
    component: Task ,
    parameters: {
        layout: 'centered' ,
    }
}
const changeTaskStatusCallback = action ( "Status changed" )
const changeTaskTitleCallback = action ( "Title changed" )
const removeTaskCallback = action ( "Task removed" )

export const TaskBaseExample = () => {
    return <>
        <Task task={{
            id: "1" ,
            status: TaskStatuses.Completed ,
            title: "CSS" ,
            startDate: "" ,
            deadline: '' ,
            addedDate: '' ,
            order: 0 ,
            priority: TaskPrioties.Low ,
            completed: false ,
            description: '' ,
            todoListId: "todolistID1"
        }} changeTaskStatus={changeTaskStatusCallback}
              changeTaskTitle={changeTaskTitleCallback} removeTask={removeTaskCallback} todolistId={"todolistID1"}/>
        <Task task={{
            id: "2" ,
            status: TaskStatuses.New ,
            title: "JS" ,
            startDate: "" ,
            deadline: '' ,
            addedDate: '' ,
            order: 0 ,
            priority: TaskPrioties.Low ,
            completed: false ,
            description: '' ,
            todoListId: "todolistID2"
        }} todolistId={"todolistID2"}
              changeTaskStatus={changeTaskStatusCallback}
              changeTaskTitle={changeTaskTitleCallback} removeTask={removeTaskCallback}/>
    </>
}