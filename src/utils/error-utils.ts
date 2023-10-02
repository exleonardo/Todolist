import {setAppErrorAC , setAppStatusAC , SetErrorActionType , SetStatusActionType} from "../app/app-reducer";
import {ResponseType} from '../api/todolists-api'
import {Dispatch} from "redux";
import {AxiosError} from "axios";


export const handleServerAppError = <D>(data: ResponseType<D> , dispatch: Dispatch<SetErrorActionType | SetStatusActionType>) => {
    if ( data.messages.length ) {
        dispatch ( setAppErrorAC ( data.messages[0] ) )
    } else {
        dispatch ( setAppErrorAC ( 'some error' ) )
    }
    dispatch ( setAppStatusAC ( 'failed' ) )
}

// нужно типизировать аксиос объектом который вернет сервер
export const handleServerNetworkError = (error: AxiosError<any> , dispatch: Dispatch) => {
    dispatch ( setAppErrorAC ( error.message ? error.message : 'Some error occurred' ) )
    dispatch ( setAppStatusAC ( 'failed' ) )
}