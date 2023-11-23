import { slice } from "features/Application/applicationReducer"

import { appActions as commonAction } from "features/CommonActions/ApplicationCommonAction"

const appActions = { ...commonAction }

const appReducer = slice.reducer
export { appActions }
