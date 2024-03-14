import * as authSelector from '@/pages/auth/selectors/auth-selector'

import { asyncActions, slice } from '@/redux/auth-reducer'
import { Login } from './ui/Login'

const authActions = {
  ...asyncActions,
  ...slice.actions,
}
const authReducer = slice.reducer
export { authSelector, Login, authActions, authReducer }
