import Head from 'next/head'

import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'

import { useStyles } from '../utils/styles'

export default function Layout({ children }) {
  const classes = useStyles()

  return (
    <div>
      <Head>
        <title>
          Next Amazona
        </title>
      </Head>

      <AppBar position="static" className={classes.navbar}>
        <Toolbar>
          <Typography>amazona</Typography>
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
