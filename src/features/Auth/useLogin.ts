import { useFormik } from "formik"
import { login } from "features/Auth/authReducer"
import { BaseResponseType } from "api/todolists-api"
import { useAppDispatch } from "common/utils/redux-utils"

export const useLogin = () => {
  const dispatch = useAppDispatch()
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    onSubmit: async (values, formikHelpers) => {
      formikHelpers.setSubmitting(true)
      dispatch(login(values))
        .unwrap()
        .catch((err: BaseResponseType) => {
          err.fieldsErrors?.forEach((fieldError) => {
            return formikHelpers.setFieldError(fieldError.field, fieldError.error)
          })
        })
        .finally(() => {
          formikHelpers.setSubmitting(false)
        })
    },
  })
  return { formik }
}
