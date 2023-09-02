import React , {ChangeEvent , memo , useCallback} from "react";
import {useDispatch} from "react-redux";
import {changeTaskStatusAC , changeTaskTitleAC , removeTaskAC} from "./state/tasks-reducer";
import {Checkbox} from "@mui/material";
import {EditableSpan} from "./EditableSpan";
import IconButton from "@mui/material/IconButton/IconButton";
import {Delete} from "@mui/icons-material";
import {TaskType} from "./Todolist";

type TaskPropsType = {
    tasks: TaskType
    todolistId: string
}
export const Task = memo ( (props: TaskPropsType) => {
    console.log ( "Task" )
    const dispatch = useDispatch ()
    const onClickHandler = useCallback ( () => dispatch ( removeTaskAC ( props.tasks.id , props.todolistId ) ) , [props.tasks.id , props.todolistId] )

    const onChangeHandler = useCallback ( (e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked;
        dispatch ( changeTaskStatusAC ( props.tasks.id , newIsDoneValue , props.todolistId ) )
    } , [props.tasks.id , props.todolistId] )
    const onTitleChangeHandler = useCallback ( (newValue: string) => {
        dispatch ( changeTaskTitleAC ( props.tasks.id , newValue , props.todolistId ) )
    } , [props.tasks.id , props.todolistId] )

    return <div className={props.tasks.isDone ? "is-done" : ""}>
        <Checkbox
            checked={props.tasks.isDone}
            color="primary"
            onChange={onChangeHandler}
        />

        <EditableSpan value={props.tasks.title} onChange={onTitleChangeHandler}/>
        <IconButton onClick={onClickHandler}>
            <Delete/>
        </IconButton>
    </div>
} )