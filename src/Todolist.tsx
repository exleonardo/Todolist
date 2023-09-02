import React , {memo , useCallback} from 'react';
import {FilterValuesType} from './AppWithReducers';
import {AddItemForm} from './AddItemForm';
import {EditableSpan} from './EditableSpan';
import IconButton from '@mui/material/IconButton/IconButton';
import {Delete} from "@mui/icons-material";
import {Button} from "@mui/material";
import {useDispatch , useSelector} from "react-redux";
import {AppRootState} from "./state/store";
import {addTaskAC} from "./state/tasks-reducer";
import {Task} from "./Task";


export type TaskType = {
    id: string
    title: string
    isDone: boolean
}
type PropsType = {
    id: string
    title: string
    changeFilter: (value: FilterValuesType , todolistId: string) => void
    removeTodolist: (id: string) => void
    changeTodolistTitle: (id: string , newTitle: string) => void
    filter: FilterValuesType
}

export const Todolist = memo ( function Todolist(props: PropsType) {
    const dispatch = useDispatch ()
    const tasks = useSelector<AppRootState , TaskType[]> ( (state) => state.tasks[props.id] )

    const addTask = useCallback ( (title: string) => {
        dispatch ( addTaskAC ( title , props.id ) )
    } , [props.id] )

    const removeTodolist = () => {
        props.removeTodolist ( props.id );
    }
    const changeTodolistTitle = useCallback ( (title: string) => {
        props.changeTodolistTitle ( props.id , title );
    } , [props.changeTodolistTitle , props.id] )

    const onAllClickHandler = useCallback ( () => props.changeFilter ( "all" , props.id ) , [props.changeFilter , props.id] );
    const onActiveClickHandler = useCallback ( () => props.changeFilter ( "active" , props.id ) , [props.changeFilter , props.id] );
    const onCompletedClickHandler = useCallback ( () => props.changeFilter ( "completed" , props.id ) , [props.changeFilter , props.id] );

    let allTodolistTasks = tasks;
    let tasksForTodolist = allTodolistTasks;

    if ( props.filter === "active" ) {
        tasksForTodolist = allTodolistTasks.filter ( t => !t.isDone );
    }
    if ( props.filter === "completed" ) {
        tasksForTodolist = allTodolistTasks.filter ( t => t.isDone );
    }

    return <div>
        <h3><EditableSpan value={props.title} onChange={changeTodolistTitle}/>
            <IconButton onClick={removeTodolist}>
                <Delete/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTask}/>
        <div>
            {
                tasksForTodolist.map ( t => {
                    return <Task key={t.id} tasks={t} todolistId={props.id}/>
                } )
            }
        </div>
        <div>

            <ButtonWithMemo title={"All"} onClick={onAllClickHandler} color={'inherit'}
                            variant={props.filter === 'all' ? 'outlined' : 'text'}/>
            <ButtonWithMemo variant={props.filter === 'active' ? 'outlined' : 'text'} title={"Active"}
                            onClick={onActiveClickHandler} color={'primary'}/>
            <ButtonWithMemo variant={props.filter === 'completed' ? 'outlined' : 'text'} title={"Completed"}
                            onClick={onCompletedClickHandler} color={'secondary'}/>
        </div>
    </div>
} )
type ButtonWithMemo = {
    variant: "text" | "outlined" | "contained" | undefined
    title: string;
    onClick: () => void
    color: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
}
const ButtonWithMemo = memo ( (props: ButtonWithMemo) => {
    return <Button variant={props.variant}
                   onClick={props.onClick}
                   color={props.color}
    >{props.title}
    </Button>
} )
