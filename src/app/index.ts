import { slice } from '@/redux/app-reducer'
import { RequestStatusType as T1 } from '@/redux/app-reducer'
import * as appSelectors from '@/app/selectors/app-selector'

const actions = slice.actions
const appActions = { ...actions }
export type RequestStatusType = T1

const appReducer = slice.reducer
export { appActions, appReducer, appSelectors }
