import { slice } from '@/features/Application/application-reducer'
import { RequestStatusType as T1 } from '@/features/Application/application-reducer'
import * as appSelectors from '@/features/Application/app-selector'

const actions = slice.actions
const appActions = { ...actions }
export type RequestStatusType = T1

const appReducer = slice.reducer
export { appActions, appReducer, appSelectors }
