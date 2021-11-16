import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles({
  navbar: {
    backgroundColor: '#203040',
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
  }
})