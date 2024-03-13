import Grid from '@mui/material/Grid'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import FormLabel from '@mui/material/FormLabel'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

import { Navigate } from 'react-router-dom'

import { useLogin } from './useLogin'
import { useAppSelector } from '@/state/store'
import { selectIsLoggedIn } from '@/features/auth/auth-selector'

export const Login = () => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn)
  const { formik } = useLogin()

  if (isLoggedIn) {
    return <Navigate to={'/'} />
  }

  return (
    <Grid container justifyContent={'center'}>
      <Grid item justifyContent={'center'}>
        <form onSubmit={formik.handleSubmit}>
          <FormControl>
            <FormLabel>
              <p>
                To log in get registered
                <a
                  href={'https://social-network.samuraijs.com/'}
                  target={'_blank'}
                  rel="noreferrer"
                >
                  {' '}
                  here
                </a>
              </p>
              <p>or use common test account credentials:</p>
              <p>Email: free@samuraijs.com</p>
              <p>Password: free</p>
            </FormLabel>
            <FormGroup>
              <TextField
                error={!!(formik.touched.email && formik.errors.email)}
                label="Email"
                margin="normal"
                {...formik.getFieldProps('email')}
              />
              {formik.errors.email ? (
                <div style={{ color: 'red' }}>{formik.errors.email}</div>
              ) : null}
              <TextField
                error={!!(formik.touched.password && formik.errors.password)}
                type="password"
                label="Password"
                margin="normal"
                {...formik.getFieldProps('password')}
              />
              {formik.errors.password ? (
                <div style={{ color: 'red' }}>{formik.errors.password}</div>
              ) : null}
              <FormControlLabel
                label={'Remember me'}
                control={
                  <Checkbox
                    {...formik.getFieldProps('rememberMe')}
                    checked={formik.values.rememberMe}
                  />
                }
              />
              <Button
                type={'submit'}
                variant={'contained'}
                color={'primary'}
                disabled={formik.isSubmitting}
              >
                Login
              </Button>
            </FormGroup>
          </FormControl>
        </form>
      </Grid>
    </Grid>
  )
}