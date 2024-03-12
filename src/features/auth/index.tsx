import * as authSelector from '@/features/auth/auth-selector'
import { Login } from './Login'
import { asyncActions, slice } from '@/features/auth/auth-reducer'

const authActions = {
  ...asyncActions,
  ...slice.actions,
}
const authReducer = slice.reducer
export { authSelector, Login, authActions, authReducer }
