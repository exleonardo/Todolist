import { slice } from "features/Application/applicationReducer"
import { RequestStatusType as T1 } from "features/Application/applicationReducer"
import * as appSelectors from "./AppSelector"

const actions = slice.actions
const appActions = { ...actions }
export type RequestStatusType = T1

const appReducer = slice.reducer
export { appActions, appReducer, appSelectors }
