import React , {useCallback , useEffect} from "react";
import {useSelector} from "react-redux";
import {AppRootStateType , useAppDispatch} from "../../../state/store";
import {
    addTodolistTC ,
    changeTodolistFilterAC ,
    changeTodolistTitleTC ,
    fetchTodolistTC ,
    FilterValuesType ,
    removeTodolistTC ,
    TodolistDomainType
} from "../../../state/todolists-reducer";
import {addTaskTC , removeTaskTC , updateTaskTC} from "../../../state/tasks-reducer";
import {TaskStatuses} from "../../../api/todolists-api";
import {Grid , Paper} from "@mui/material";
import {AddItemForm} from "../../../components/AddItemForm/AddItemForm";
import {Todolist} from "../../../features/TodolistsList/Todolist/Todolist";
import {TasksStateType} from "../../App";

type TodolistsListPropsType = {}
export const TodolistsList: React.FC<TodolistsListPropsType> = (props) => {
    const todolists = useSelector<AppRootStateType , Array<TodolistDomainType>> ( state => state.todolists )
    const tasks = useSelector<AppRootStateType , TasksStateType> ( state => state.tasks )
    const dispatch = useAppDispatch ();
    useEffect ( () => {
            dispatch ( fetchTodolistTC () )
        }
        , [dispatch] );

    const removeTask = useCallback ( function (id: string , todolistId: string) {
        const thunk = removeTaskTC ( id , todolistId );
        dispatch ( thunk );
    } , [dispatch] );

    const addTask = useCallback ( function (title: string , todolistId: string) {
        const thunk = addTaskTC ( title , todolistId );
        dispatch ( thunk );
    } , [dispatch] );

    const changeStatus = useCallback ( function (id: string , status: TaskStatuses , todolistId: string) {
        const thunk = updateTaskTC ( id , { status } , todolistId );
        dispatch ( thunk );
    } , [dispatch] );

    const changeTaskTitle = useCallback ( function (id: string , newTitle: string , todolistId: string) {
        const thunk = updateTaskTC ( id , { title: newTitle } , todolistId );
        dispatch ( thunk );
    } , [dispatch] );

    const changeFilter = useCallback ( function (value: FilterValuesType , todolistId: string) {
        const action = changeTodolistFilterAC ( todolistId , value );
        dispatch ( action );
    } , [dispatch] );

    const removeTodolist = useCallback ( function (id: string) {
        const thunk = removeTodolistTC ( id );
        dispatch ( thunk );
    } , [dispatch] );

    const changeTodolistTitle = useCallback ( (id: string , title: string) => {
        const thunk = changeTodolistTitleTC ( id , title );
        dispatch ( thunk );
    } , [dispatch] )

    const addTodolist = useCallback ( (title: string) => {
        const thunk = addTodolistTC ( title );
        dispatch ( thunk );
    } , [dispatch] );
    return <>
        <Grid container style={{ padding: "20px" }}>
            <AddItemForm addItem={addTodolist}/>
        </Grid>
        <Grid container spacing={3}>
            {
                todolists.map ( tl => {
                    return <Grid item key={tl.id}>
                        <Paper style={{ padding: "10px" }}>
                            <Todolist
                                id={tl.id}
                                title={tl.title}
                                tasks={tasks[tl.id]}
                                removeTask={removeTask}
                                changeFilter={changeFilter}
                                addTask={addTask}
                                changeTaskStatus={changeStatus}
                                filter={tl.filter}
                                removeTodolist={removeTodolist}
                                changeTaskTitle={changeTaskTitle}
                                changeTodolistTitle={changeTodolistTitle}
                            />
                        </Paper>
                    </Grid>
                } )
            }
        </Grid>
    </>
}