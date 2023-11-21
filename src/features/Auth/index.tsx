import * as authSelector from "./AuthSelector"
import { Login } from "./Login"
import { asyncActions, slice } from "./authReducer"

const authActions = {
  ...asyncActions,
  ...slice.actions,
}
export { authSelector, Login, authActions }
