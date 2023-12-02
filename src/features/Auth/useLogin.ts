import { useFormik } from "formik"
import { BaseResponseType } from "api/todolists-api"
import { useActions } from "common/utils/redux-utils"
import { authActions } from "features/Auth/index"
import { appActions } from "features/CommonActions/ApplicationCommonAction"

export const useLogin = () => {
  const { login } = useActions(authActions)
  const { setAppError } = useActions(appActions)
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    onSubmit: async (values, formikHelpers) => {
      formikHelpers.setSubmitting(true)
      login(values)
        .unwrap()
        .catch((err: BaseResponseType) => {
          err.fieldsErrors?.forEach((fieldError) => {
            return formikHelpers.setFieldError(fieldError.field, fieldError.error)
          })
        })
        .finally(() => {
          formikHelpers.setSubmitting(false)
          setAppError({ error: null })
        })
    },
  })
  return { formik }
}
