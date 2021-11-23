import { useContext, useState } from 'react'
import Head from 'next/head'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'

import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Link from '@mui/material/Link'
import Switch from '@mui/material/Switch'
import Badge from '@mui/material/Badge'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

import { useStyles } from '../utils/styles'
import { Store } from '../utils/Store'

export default function Layout({ title, description, children }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const { state, dispatch } = useContext(Store)
  const router = useRouter()
  const { darkMode, cart, userInfo } = state
  const theme = createTheme({
    typography: {
      h1: {
        fontSize: '1.6rem',
        fontWeight: 400,
        margin: '1rem 0'
      },
      h2: {
        fontSize: '1.4rem',
        fontWeight: 400,
        margin: '1rem 0'
      },
      body1: {
        fontWeight: 'normal',
      }
    },
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#f0c000'
      },
      secondary: {
        main: '#208080'
      }
    }
  })
  const classes = useStyles()

  const darkModeChangeHandler = () => {
    dispatch({ type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON' })
    const newDarkMode = !darkMode
    Cookies.set('darkMode', newDarkMode ? 'ON' : 'OFF')
  }

  const loginClickHandler = (e) => {
    setAnchorEl(e.currentTarget)
  }

  const loginMenuClosedHandler = () => {
    setAnchorEl(null)
  }

  const logoutClickHandler = () => {
    setAnchorEl(null)
    dispatch({ type: 'USER_LOGOUT' })
    Cookies.remove('userInfo')
    Cookies.remove('cartItems')

    router.push('/')
  }

  return (
    <div>
      <Head>
        <title>
          {title ? `${title} - Next Amazona` : "Next Amazona"}
        </title>
        {
          description &&
          <meta name="description" content={description}></meta>
        }
      </Head>

      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="static" className={classes.navbar}>
          <Toolbar>
            <NextLink href="/" passHref>
              <Link>
                <Typography className={classes.brand}>amazona</Typography>
              </Link>
            </NextLink>

            <div className={classes.grow}></div>

            <Switch onChange={darkModeChangeHandler} checked={darkMode} />

            <NextLink href="/cart" passHref>
              <Link>
                {
                  cart.cartItems.length > 0 ?
                    <Badge
                      color="secondary"
                      badgeContent={cart.cartItems.length}
                    >
                      Cart
                    </Badge> :
                    'Cart'
                }
              </Link>
            </NextLink>

            {
              userInfo ?
                <>
                  <Button
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={loginClickHandler}
                    className={classes.navbarButton}
                  >
                    {userInfo.name}
                  </Button>
                  <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={loginMenuClosedHandler}
                    MenuListProps={{
                      'aria-labelledby': 'basic-button',
                    }}
                  >
                    <MenuItem onClick={loginMenuClosedHandler}>
                      Profile
                    </MenuItem>
                    <MenuItem onClick={loginMenuClosedHandler}>
                      My account
                    </MenuItem>
                    <MenuItem onClick={logoutClickHandler}>
                      Logout
                    </MenuItem>

                  </Menu>
                </> :
                <NextLink href="/login" passHref>
                  <Link>
                    Login
                  </Link>
                </NextLink>
            }
          </Toolbar>
        </AppBar>

        <Container className={classes.main}>
          {children}
        </Container>

        <footer className={classes.footer}>
          <Typography>
            All rights reserved. Next Amazona.
          </Typography>
        </footer>
      </ThemeProvider>
    </div>
  )
}
