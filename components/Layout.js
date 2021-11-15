import Head from 'next/head'
import NextLink from 'next/link'

import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Link from '@mui/material/Link'

import { useStyles } from '../utils/styles'

export default function Layout({ title, description, children }) {
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
      type: 'light',
      primary: {
        main: '#f0c000'
      },
      secondary: {
        main: '#208080'
      }
    }
  })
  const classes = useStyles()

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

            <NextLink href="/cart" passHref>
              <Link>
                Cart
              </Link>
            </NextLink>

            <NextLink href="/login" passHref>
              <Link>
                Login
              </Link>
            </NextLink>
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
