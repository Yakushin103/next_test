import Head from 'next/head'
import NextLink from 'next/link'

import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Link from '@mui/material/Link'

import { useStyles } from '../utils/styles'

export default function Layout({ title, children }) {
  const classes = useStyles()

  return (
    <div>
      <Head>
        <title>
          {title ? `${title} - Next Amazona` : "Next Amazona"} 
        </title>
      </Head>

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
    </div>
  )
}
