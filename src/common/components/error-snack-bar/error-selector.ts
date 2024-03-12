import { AppRootStateType } from "app/state/store"

export const selectError = (state: AppRootStateType) => state.app.error
