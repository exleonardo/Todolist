const appReducer = (state: AppReducerStateType = initialState , action: ActionsAppType): AppReducerStateType => {
    switch (action.type) {
        case 'SET-STATUS':
            return { ...state , status: action.status }
        case 'SET-ERROR':
            return { ...state , error: action.error }
        default:
            return state
    }
}
export default appReducer

export const setErrorAC = (error: string | null) => ({
    type: 'SET-ERROR' ,
    error
} as const)
export const setStatusAC = (status: RequestStatusType) => ({
    type: 'SET-STATUS' ,
    status
} as const)
export type RequestStatusType = 'idle' | 'loading' | 'succesed' | 'failed';
export type AppReducerStateType = {
    status: RequestStatusType
    error: string | null
}
const initialState: AppReducerStateType = {
    status: "idle" ,
    error: null
}
export type SetErrorActionType = ReturnType<typeof setErrorAC>
export type SetStatusActionType = ReturnType<typeof setStatusAC>
export type ActionsAppType = SetErrorActionType | SetStatusActionType