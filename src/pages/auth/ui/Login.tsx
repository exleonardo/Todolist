import { Navigate } from 'react-router-dom'

import { useLogin } from '@/pages/auth/hooks/useLogin'
import { selectIsLoggedIn } from '@/pages/auth/selectors/auth-selector'
import { useAppSelector } from '@/state/store'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import FormLabel from '@mui/material/FormLabel'
import clsx from 'clsx'

import s from '../style/login.module.scss'

export const Login = () => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn)
  const { formik } = useLogin()
  const classesInput = clsx(
    s.input,
    !!(formik.touched.email && formik.errors.email) && s.inputError
  )

  if (isLoggedIn) {
    return <Navigate to={'/'} />
  }

  return (
    <form className={s.form} onSubmit={formik.handleSubmit}>
      <FormControl>
        <FormLabel>
          <div className={s.description}>
            <p>
              To log in get registered
              <a
                href={'https://social-network.samuraijs.com/'}
                rel={'noreferrer'}
                target={'_blank'}
              >
                here
              </a>
            </p>
            <p>or use common test account credentials:</p>
            <p>Email: free@samuraijs.com</p>
            <p>Password: free</p>
          </div>
        </FormLabel>
        <FormGroup>
          <input
            className={classesInput}
            placeholder={'Email'}
            {...formik.getFieldProps('email')}
          />
          {formik.errors.email && <div style={{ color: 'red' }}>{formik.errors.email}</div>}
          <input
            type={'password'}
            {...formik.getFieldProps('password')}
            className={classesInput}
            placeholder={'Password'}
          />
          {formik.errors.password && <div style={{ color: 'red' }}>{formik.errors.password}</div>}
          <FormControlLabel
            className={s.formControl}
            control={
              <input className={s.uiCheckbox} style={{ marginLeft: '11px' }} type={'checkbox'} />
            }
            label={'Remember me'}
          />
          <button className={s.button} disabled={formik.isSubmitting} type={'submit'}>
            Login
          </button>
        </FormGroup>
      </FormControl>
    </form>
  )
}
