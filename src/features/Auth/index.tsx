import * as authSelector from "./AuthSelector"
import { Login } from "./Login"
import { asyncActions, slice } from "./authReducer"

const authActions = {
  ...asyncActions,
  ...slice.actions,
}
const authReducer = slice.reducer
export { authSelector, Login, authActions, authReducer }
