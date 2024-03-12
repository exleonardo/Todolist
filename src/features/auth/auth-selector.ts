import { AppRootStateType } from "app/state/store"

export const selectIsLoggedIn = (state: AppRootStateType) => state.login.isLoggedIn
