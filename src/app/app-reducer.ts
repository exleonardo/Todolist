import {AppThunk} from "../state/store";
import {authApi} from "../api/todolists-api";
import {setIsLoggedInAC} from "../features/Login/authReducer";

const appReducer = (state: AppReducerStateType = initialState , action: ActionsAppType): AppReducerStateType => {
    switch (action.type) {
        case 'SET-STATUS':
            return { ...state , status: action.status }
        case 'SET-ERROR':
            return { ...state , error: action.error }
        case "APP/SET-IS-INITIALIZED":
            return { ...state , isInitialized: action.value }
        default:
            return state
    }
}
export default appReducer
//Actions
export const setAppErrorAC = (error: string | null) => ({
    type: 'SET-ERROR' ,
    error
} as const)
export const setAppStatusAC = (status: RequestStatusType) => ({
    type: 'SET-STATUS' ,
    status
} as const)

//Thunks
export const initializedTC = (): AppThunk => (dispatch) => {
    authApi.me ().then ( (res) => {
        if ( res.data.resultCode === 0 ) {
            dispatch ( setIsLoggedInAC ( true ) )

        } else {

        }
        dispatch ( setAppInitializedAC ( true ) )
    } )
}
export const setAppInitializedAC = (value: boolean) => ({ type: 'APP/SET-IS-INITIALIZED' , value } as const)
const initialState: AppReducerStateType = {
    status: "idle" ,
    error: null ,
    //true когда приложение проинициализировалось (проверили юзера, получили настройки ... )
    isInitialized: false
}
//Types
export type RequestStatusType = 'idle' | 'loading' | 'succesed' | 'failed';
export type AppReducerStateType = {
    status: RequestStatusType
    error: string | null,
    isInitialized: boolean
}
export type SetErrorActionType = ReturnType<typeof setAppErrorAC>
export type SetStatusActionType = ReturnType<typeof setAppStatusAC>
type SetAppInitializedType = ReturnType<typeof setAppInitializedAC>
export type ActionsAppType = SetErrorActionType | SetStatusActionType | SetAppInitializedType