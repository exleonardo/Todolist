import {Task} from "../Task";
import React from "react";
import {action} from '@storybook/addon-actions'

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
        <Task task={{ id: "1" , isDone: true , title: "CSS" }} changeTaskStatus={changeTaskStatusCallback}
              changeTaskTitle={changeTaskTitleCallback} removeTask={removeTaskCallback} todolistId={"todolistID1"}/>
        <Task task={{ id: "2" , isDone: false , title: "JS" }} todolistId={"todolistID2"}
              changeTaskStatus={changeTaskStatusCallback}
              changeTaskTitle={changeTaskTitleCallback} removeTask={removeTaskCallback}/>
    </>
}