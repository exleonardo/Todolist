import * as appSelectors from '@/app/selectors/app-selector'
import { slice } from '@/redux/app-reducer'
// eslint-disable-next-line no-duplicate-imports
import { RequestStatusType as T1 } from '@/redux/app-reducer'

const actions = slice.actions
const appActions = { ...actions }

export type RequestStatusTypeProp = T1

const appReducer = slice.reducer

export { appActions, appReducer, appSelectors }
