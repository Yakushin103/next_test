import { useState, useContext, useEffect } from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import axios from 'axios'
import Cookies from 'js-cookie'

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
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const classes = useStyles()
  const router = useRouter()
  const { redirect } = router.query
  const { state, dispatch } = useContext(Store)
  const { userInfo } = state

  useEffect(() => {
    if (userInfo) {
      router.push('/')
    }
  }, [router, userInfo])


  const submitHandler = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      alert('Password dont match')
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
      alert(err.response.data ? err.response.data.message : err.message)
    }
  }

  return (
    <Layout title="Register">
      <form onSubmit={submitHandler} className={classes.form}>
        <Typography component="h1" variant="h1">
          Register
        </Typography>

        <List>
          <ListItem>
            <TextField
              variant="outlined"
              fullWidth
              id="name"
              label="Name"
              inputProps={{ type: 'text' }}
              onChange={e => setName(e.target.value)}
            ></TextField>
          </ListItem>

          <ListItem>
            <TextField
              variant="outlined"
              fullWidth
              id="email"
              label="Email"
              inputProps={{ type: 'email' }}
              onChange={e => setEmail(e.target.value)}
            ></TextField>
          </ListItem>

          <ListItem>
            <TextField
              variant="outlined"
              fullWidth
              id="password"
              label="Password"
              inputProps={{ type: 'password' }}
              onChange={e => setPassword(e.target.value)}
            ></TextField>
          </ListItem>

          <ListItem>
            <TextField
              variant="outlined"
              fullWidth
              id="confirmPassword"
              label="Confirm Password"
              inputProps={{ type: 'password' }}
              onChange={e => setConfirmPassword(e.target.value)}
            ></TextField>
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
