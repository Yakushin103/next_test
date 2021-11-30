import { useContext, useEffect } from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useForm, Controller } from 'react-hook-form'
import { useSnackbar } from 'notistack'

import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import Layout from '../components/Layout'
import { useStyles } from '../utils/styles'
import { Store } from '../utils/Store'

export default function Login() {
  const classes = useStyles()
  const router = useRouter()
  const { redirect } = router.query
  const { state, dispatch } = useContext(Store)
  const { userInfo } = state
  const { handleSubmit, control, formState: { errors } } = useForm()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  useEffect(() => {
    if (userInfo) {
      router.push('/')
    }
  }, [router, userInfo])


  const submitHandler = async ({ email, password }) => {
    closeSnackbar()
    try {
      const { data } = await axios.post('/api/users/login', {
        email, password
      })
      dispatch({ type: 'USER_LOGIN', payload: data })
      Cookies.set('userInfo', JSON.stringify(data))
      router.push(redirect || '/')
    } catch (err) {
      enqueueSnackbar(
        err.response.data ?
          err.response.data.message :
          err.message,
        { variant: 'error' })
    }
  }

  return (
    <Layout title="Login">
      <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
        <Typography component="h1" variant="h1">
          Login
        </Typography>

        <List>
          <ListItem>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="email"
                  label="Email"
                  inputProps={{ type: 'email' }}
                  error={Boolean(errors.email)}
                  helperText={
                    errors.email ?
                      errors.email.type === 'pattern' ?
                        'Email is not valid' :
                        'Email is required' :
                      ''
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>

          <ListItem>
            <Controller
              name="password"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 4
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="password"
                  label="Password"
                  inputProps={{ type: 'password' }}
                  error={Boolean(errors.password)}
                  helperText={
                    errors.password ?
                      errors.password.type === 'minLength' ?
                        'Password is length more the 3' :
                        'Password is required' :
                      ''
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>

          <ListItem>
            <Button
              variant="contained"
              type="submit"
              fullWidth
              color="primary"
            >
              Login
            </Button>
          </ListItem>

          <ListItem>
            Dont have an account?
            <NextLink
              passHref
              href={`/register?redirect=${redirect || '/'}`}
            >
              <Link>
                Register
              </Link>
            </NextLink>
          </ListItem>
        </List>
      </form>
    </Layout>
  )
}
