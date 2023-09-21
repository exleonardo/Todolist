import React , {useCallback , useEffect} from 'react'
import './App.css';
import {Todolist} from './Todolist';
import {AddItemForm} from './AddItemForm';
import {AppBar , Button , Container , Grid , IconButton , Paper , Toolbar , Typography} from "@mui/material";
import {Menu} from "@mui/icons-material";
import {
    addTodolistTC ,
    changeTodolistFilterAC ,
    changeTodolistTitleTC ,
    fetchTodolistTC ,
    FilterValuesType ,
    removeTodolistTC ,
    TodolistDomainType ,
} from './state/todolists-reducer';
import {addTaskTC , removeTaskTC , updateTaskTC} from './state/tasks-reducer';
import {useDispatch , useSelector} from 'react-redux';
import {AppRootStateType} from './state/store';
import {TaskStatuses , TaskType} from "./api/todolists-api";


export type TasksStateType = {
    [key: string]: Array<TaskType>
}


function AppWithRedux() {

    const todolists = useSelector<AppRootStateType , Array<TodolistDomainType>> ( state => state.todolists )
    const tasks = useSelector<AppRootStateType , TasksStateType> ( state => state.tasks )
    const dispatch = useDispatch ();
    useEffect ( () => {
            dispatch ( fetchTodolistTC () )
        }
        , [] );

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

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
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
            </Container>
        </div>
    );
}

export default AppWithRedux;
