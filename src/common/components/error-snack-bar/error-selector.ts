import { AppRootStateType } from 'state/store'

export const selectError = (state: AppRootStateType) => state.app.error
