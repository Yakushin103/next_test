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

export default function Register() {
  // const [name, setName] = useState('')
  // const [email, setEmail] = useState('')
  // const [password, setPassword] = useState('')
  // const [confirmPassword, setConfirmPassword] = useState('')
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


  const submitHandler = async ({ name,
    email,
    password,
    confirmPassword }) => {
    closeSnackbar()

    if (password !== confirmPassword) {
      enqueueSnackbar('Password dont match',
        { variant: 'error' })
      return
    }

    try {
      const { data } = await axios.post('/api/users/register', {
        name, email, password
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
      alert()
    }
  }

  return (
    <Layout title="Register">
      <form
        onSubmit={handleSubmit(submitHandler)}
        className={classes.form}
      >
        <Typography component="h1" variant="h1">
          Register
        </Typography>

        <List>
          <ListItem>
            <Controller
              name="name"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 3
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="name"
                  label="Name"
                  inputProps={{ type: 'text' }}
                  error={Boolean(errors.name)}
                  helperText={
                    errors.name ?
                      errors.name.type === 'minLength' ?
                        'Name is lenght more 2' :
                        'Name is required' :
                      ''
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>

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
            <Controller
              name="confirmPassword"
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
                  id="confirmPassword"
                  label="Confirm Password"
                  inputProps={{ type: 'password' }}
                  error={Boolean(errors.password)}
                  helperText={
                    errors.confirmPassword ?
                      errors.confirmPassword.type === 'minLength' ?
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
              Register
            </Button>
          </ListItem>

          <ListItem>
            Already have an account?
            <NextLink
              passHref
              href={`/login?redirect=${redirect || '/'}`}
            >
              <Link>
                Login
              </Link>
            </NextLink>
          </ListItem>
        </List>
      </form>
    </Layout>
  )
}
