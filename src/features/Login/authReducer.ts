import {AppThunk} from "../../state/store";
import {setAppStatusAC} from "../../app/app-reducer";
import {authApi , LoginParamsType} from "../../api/todolists-api";
import {handleServerAppError , handleServerNetworkError} from "../../utils/error-utils";

const initialState = {
    isLoggedIn: false
}
type InitialState = {
    isLoggedIn: boolean
}

const authReducer = (state: InitialState = initialState , action: ActionsAuthType): InitialState => {
    switch (action.type) {
        case "LOGIN/SET-IS-LOGGED-IN":
            return { ...state , isLoggedIn: action.value }
        default :
            return state
    }
}
export default authReducer

//Actions
export const setIsLoggedInAC = (value: boolean) => ({
    type: 'LOGIN/SET-IS-LOGGED-IN' ,
    value
} as const)

//Types
export type ActionsAuthType = ReturnType<typeof setIsLoggedInAC>
//Thunk
export const loginTC = (data: LoginParamsType): AppThunk => dispatch => {
    dispatch ( setAppStatusAC ( 'loading' ) )
    authApi.auth ( data ).then ( (res) => {

        if ( res.data.resultCode === 0 ) {

            dispatch ( setAppStatusAC ( 'succesed' ) )
        } else {
            handleServerAppError ( res.data , dispatch )
        }
    } ).catch ( (error) => {
        handleServerNetworkError ( error , dispatch )
    } )

}
export const logoutTC = (): AppThunk => dispatch => {
    dispatch ( setAppStatusAC ( 'loading' ) )
    authApi.logout ().then ( (res) => {
        if ( res.data.resultCode === 0 ) {
            dispatch ( setIsLoggedInAC ( false ) )
            dispatch ( setAppStatusAC ( 'succesed' ) )
        } else {
            handleServerAppError ( res.data , dispatch )
        }
    } ).catch ( (error) => {
        handleServerNetworkError ( error , dispatch )
    } )
}
