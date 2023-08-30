import React , {useCallback} from 'react';
import './App.css';
import {TaskType , Todolist} from './Todolist';
import {AddItemForm} from './AddItemForm';
import AppBar from '@mui/material/AppBar/AppBar';
import {Button , Container , Grid , IconButton , Paper , Toolbar , Typography} from "@mui/material";
import {Menu} from "@mui/icons-material";
import {
    addTodolistAC ,
    changeTodolistFilterAC ,
    changeTodolistTitleAC
} from "./state/todolists-reducer";
import {
    removeTodolistAC
} from "./state/tasks-reducer";
import {useDispatch , useSelector} from "react-redux";
import {AppRootState} from "./state/store";


export type FilterValuesType = "all" | "active" | "completed";
export type TodolistType = {
    id: string
    title: string
    filter: FilterValuesType
}

export type TasksStateType = {
    [key: string]: Array<TaskType>
}


function AppWithRedux() {

    const dispatch = useDispatch ()
    const todolists = useSelector<AppRootState , TodolistType[]> ( (state) => state.todolists )


    const changeFilter = useCallback ( function changeFilter(value: FilterValuesType , todolistId: string) {
        dispatch ( changeTodolistFilterAC ( todolistId , value ) )
    } , [] )

    const removeTodolist = useCallback ( function (todolistId: string) {
        const action = removeTodolistAC ( todolistId )
        dispatch ( action )
    } , [] )

    const changeTodolistTitle = useCallback ( function (id: string , title: string) {
        const action = changeTodolistTitleAC ( id , title )
        dispatch ( action )
    } , [] )

    const addTodolist = useCallback ( function (title: string) {
        const action = addTodolistAC ( title )
        dispatch ( action )
    } , [] )

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


                            return <Grid key={tl.id} item>
                                <Paper style={{ padding: "10px" }}>
                                    <Todolist
                                        key={tl.id}
                                        id={tl.id}
                                        title={tl.title}
                                        changeFilter={changeFilter}
                                        filter={tl.filter}
                                        removeTodolist={removeTodolist}
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
