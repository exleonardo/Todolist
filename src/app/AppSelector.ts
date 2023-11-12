import { AppRootStateType } from "state/store"

export const selectStatusApp = (state: AppRootStateType) => state.app.status
export const selectIsInitialized = (state: AppRootStateType) => state.app.isInitialized
export const selectIsLoggedIn = (state: AppRootStateType) => state.auth.isLoggedIn
export const selectTasks = (state: AppRootStateType) => state.tasks
export const selectorTodolists = (state: AppRootStateType) => state.todolists
