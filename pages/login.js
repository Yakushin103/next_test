import { useState } from 'react'
import NextLink from 'next/link'
import axios from 'axios'

import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import Layout from '../components/Layout'
import { useStyles } from '../utils/styles'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const classes = useStyles()

  const submitHandler = async (e) => {
    e.preventDefault()

    try {
      const { data } = await axios.post('/api/users/login', {
        email, password
      })
      alert('sucess login')
    } catch (err) {
      alert(err.response.data ? err.response.data.message : err.message)
    }
  }

  return (
    <Layout title="Login">
      <form onSubmit={submitHandler} className={classes.form}>
        <Typography component="h1" variant="h1">
          Login
        </Typography>

        <List>
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
            <NextLink passHref href="/register">
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
