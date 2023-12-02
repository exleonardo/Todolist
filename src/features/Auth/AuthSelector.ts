import { AppRootStateType } from "state/store"

export const selectIsLoggedIn = (state: AppRootStateType) => state.login.isLoggedIn
