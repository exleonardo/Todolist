import React , {ChangeEvent , useCallback} from 'react';
import {FilterValuesType} from './AppWithReducers';
import {AddItemForm} from './AddItemForm';
import {EditableSpan} from './EditableSpan';
import IconButton from '@mui/material/IconButton/IconButton';
import {Delete} from "@mui/icons-material";
import {Button , Checkbox} from "@mui/material";
import {useDispatch , useSelector} from "react-redux";
import {AppRootState} from "./state/store";
import {addTaskAC , changeTaskStatusAC , changeTaskTitleAC , removeTaskAC} from "./state/tasks-reducer";


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

export const Todolist = React.memo ( function Todolist(props: PropsType) {
    const dispatch = useDispatch ()
    const tasks = useSelector<AppRootState , TaskType[]> ( (state) => state.tasks[props.id] )
    const addTask = useCallback ( (title: string) => {
        dispatch ( addTaskAC ( title , props.id ) )
    } , [] )

    const removeTodolist = () => {
        props.removeTodolist ( props.id );
    }
    const changeTodolistTitle = (title: string) => {
        props.changeTodolistTitle ( props.id , title );
    }

    const onAllClickHandler = () => props.changeFilter ( "all" , props.id );
    const onActiveClickHandler = () => props.changeFilter ( "active" , props.id );
    const onCompletedClickHandler = () => props.changeFilter ( "completed" , props.id );

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
                    const onClickHandler = () => dispatch ( removeTaskAC ( t.id , props.id ) )
                    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
                        let newIsDoneValue = e.currentTarget.checked;
                        dispatch ( changeTaskStatusAC ( t.id , newIsDoneValue , props.id ) )
                    }
                    const onTitleChangeHandler = (newValue: string) => {
                        dispatch ( changeTaskTitleAC ( t.id , newValue , props.id ) )
                    }


                    return <div key={t.id} className={t.isDone ? "is-done" : ""}>
                        <Checkbox
                            checked={t.isDone}
                            color="primary"
                            onChange={onChangeHandler}
                        />

                        <EditableSpan value={t.title} onChange={onTitleChangeHandler}/>
                        <IconButton onClick={onClickHandler}>
                            <Delete/>
                        </IconButton>
                    </div>
                } )
            }
        </div>
        <div>
            <Button variant={props.filter === 'all' ? 'outlined' : 'text'}
                    onClick={onAllClickHandler}
                    color={'inherit'}
            >All
            </Button>
            <Button variant={props.filter === 'active' ? 'outlined' : 'text'}
                    onClick={onActiveClickHandler}
                    color={'primary'}>Active
            </Button>
            <Button variant={props.filter === 'completed' ? 'outlined' : 'text'}
                    onClick={onCompletedClickHandler}
                    color={'secondary'}>Completed
            </Button>
        </div>
    </div>
} )


