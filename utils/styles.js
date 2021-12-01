import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles({
  navbar: {
    backgroundColor: '#203040',
    marginBottom: '1rem',
    '& a': {
      color: '#fff',
      marginLeft: 10,
      textDecoration: 'none',
    }
  },
  brand: {
    fontWeight: 'bold',
    fontSize: '1.5rem'
  },
  grow: {
    flexGrow: 1
  },
  main: {
    minHeight: '80vh'
  },
  footer: {
    marginTop: 10,
    textAlign: 'center'
  },
  section: {
    margin: '10px 0'
  },
  form: {
    maxWidth: 800,
    margin: '0 auto'
  },
  navbarButton: {
    color: '#fff',
    textTransform: 'initial',
    padding: '4px 0 0 0'
  },
  transparentBackground: {
    backgroundColor: 'transparent'
  },
  error: {
    color: 'f04040'
  }
})