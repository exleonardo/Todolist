import {ActionsTaskType , tasksReducer} from './tasks-reducer';
import {ActionsTodolistsType , todolistsReducer} from './todolists-reducer';
import {AnyAction , applyMiddleware , combineReducers , legacy_createStore} from 'redux';
import thunkMiddleWare , {ThunkAction , ThunkDispatch} from "redux-thunk";
import {useDispatch} from "react-redux";
import appReducer , {ActionsAppType} from "../app/app-reducer";
import authReducer , {ActionsAuthType} from "../features/Login/authReducer";


// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers ( {
    tasks: tasksReducer ,
    todolists: todolistsReducer ,
    app: appReducer ,
    auth: authReducer
} )
// непосредственно создаём store
export const store = legacy_createStore ( rootReducer , applyMiddleware ( thunkMiddleWare ) )
// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof rootReducer>
export type AppDispatchType = ThunkDispatch<AppRootStateType , any , AnyAction>
type AppActionsType = ActionsTaskType | ActionsTodolistsType | ActionsAppType | ActionsAuthType
export type AppThunk = ThunkAction<void , AppRootStateType , unknown , AppActionsType>
export const useAppDispatch = useDispatch<AppDispatchType>
// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;
