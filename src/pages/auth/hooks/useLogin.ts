import { BaseResponseType } from '@/api/todolists-api'
import { appActions } from '@/common/common-actions/application-common-action'
import { authActions } from '@/pages/auth'
import { useActions } from '@/utils/redux-utils'
import { useFormik } from 'formik'

export const useLogin = () => {
  const { login } = useActions(authActions)
  const { setAppError } = useActions(appActions)
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    onSubmit: async (values, formikHelpers) => {
      formikHelpers.setSubmitting(true)
      login(values)
        .unwrap()
        .catch((err: BaseResponseType) => {
          err.fieldsErrors?.forEach(fieldError => {
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
