import { slice } from "features/Application/application-reducer"

import { appActions as commonAction } from "features/common-actions/application-common-action"

const appActions = { ...commonAction }

const appReducer = slice.reducer
export { appActions }
