import { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import { useSnackbar } from 'notistack'

import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import RadioGroup from '@mui/material/RadioGroup'
import Radio from '@mui/material/Radio'
import Button from '@mui/material/Button'
import Layout from '../components/Layout'
import CheckoutWizard from '../components/CheckoutWizard'
import { Store } from '../utils/Store'
import { useStyles } from '../utils/styles'

export default function Payment() {
  const [paymentMethod, setPaymentMethod] = useState('')
  const router = useRouter()
  const { state, dispatch } = useContext(Store)
  const { cart: { shippingAddress } } = state
  const classes = useStyles()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  useEffect(() => {
    if (!shippingAddress.address) {
      router.push('/shipping')
    } else {
      setPaymentMethod(Cookies.get('paymentMethod') || '')
    }
  }, [router, shippingAddress])

  const submitHandler = (e) => {
    closeSnackbar()
    e.preventDefault()
    if (!paymentMethod) {
      enqueueSnackbar(
        'Payment method is required',
        { variant: 'error' }
      )
    } else {
      dispatch({
        type: 'SAVE_PAYMENT_METHOD',
        payload: paymentMethod
      })
      Cookies.set('paymentMethod', paymentMethod)
      router.push('placeorder')
    }
  }

  return (
    <Layout title="Paymont Method">
      <CheckoutWizard activeStep={2} />

      <form
        className={classes.form}
        onSubmit={submitHandler}
      >
        <Typography component="h1" variant="h1">
          Payment Method
        </Typography>

        <List>
          <ListItem>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="Payment Method"
                name="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <FormControlLabel
                  label="PayPal"
                  value="PayPal"
                  control={<Radio />}
                ></FormControlLabel>

                <FormControlLabel
                  label="Stripe"
                  value="Stripe"
                  control={<Radio />}
                ></FormControlLabel>

                <FormControlLabel
                  label="Cash"
                  value="Cash"
                  control={<Radio />}
                ></FormControlLabel>
              </RadioGroup>
            </FormControl>
          </ListItem>

          <ListItem>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
            >
              Continue
            </Button>
          </ListItem>

          <ListItem>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="secondary"
              onClick={() => router.push('/shipping')}
            >
              Back
            </Button>
          </ListItem>
        </List>
      </form>
    </Layout>
  )
}
