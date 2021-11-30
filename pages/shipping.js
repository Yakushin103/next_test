import { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import { useForm, Controller } from 'react-hook-form'

import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Layout from '../components/Layout'
import CheckoutWizard from '../components/CheckoutWizard'
import { useStyles } from '../utils/styles'
import { Store } from '../utils/Store'

export default function Shipping() {
  const classes = useStyles()
  const router = useRouter()
  const { state, dispatch } = useContext(Store)
  const { userInfo, cart: { shippingAddress } } = state
  const { handleSubmit, control, setValue, formState: { errors } } = useForm()

  useEffect(() => {
    if (!userInfo) {
      router.push('/login?redirect=/shipping')
    }
    setValue('fullName', shippingAddress.fullName)
    setValue('city', shippingAddress.city)
    setValue('postalCode', shippingAddress.postalCode)
    setValue('address', shippingAddress.address)
    setValue('country', shippingAddress.country)
  }, [router, userInfo, shippingAddress, setValue])


  const submitHandler = ({ fullName,
    address,
    city,
    postalCode,
    country }) => {

    dispatch({
      type: 'SAVE_SHIPPING_ADDRESS', payload: {
        fullName,
        address,
        city,
        postalCode,
        country
      }
    })

    Cookies.set('shippingAddress', JSON.stringify({
      fullName,
      address,
      city,
      postalCode,
      country
    }))

    router.push('/payment')
  }

  return (
    <Layout title="Shipping Address">
      <CheckoutWizard activeStep={1} />
      
      <form
        onSubmit={handleSubmit(submitHandler)}
        className={classes.form}
      >
        <Typography component="h1" variant="h1">
          Shipping Address
        </Typography>

        <List>
          <ListItem>
            <Controller
              name="fullName"
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
                  id="fullName"
                  label="Full Name"
                  inputProps={{ type: 'text' }}
                  error={Boolean(errors.fullName)}
                  helperText={
                    errors.fullName ?
                      errors.fullName.type === 'minLength' ?
                        'Full Name is lenght more 2' :
                        'Full Name is required' :
                      ''
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>

          <ListItem>
            <Controller
              name="address"
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
                  id="address"
                  label="Address"
                  inputProps={{ type: 'text' }}
                  error={Boolean(errors.address)}
                  helperText={
                    errors.address ?
                      errors.address.type === 'minLength' ?
                        'Address is lenght more 2' :
                        'Address is required' :
                      ''
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>

          <ListItem>
            <Controller
              name="city"
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
                  id="city"
                  label="City"
                  inputProps={{ type: 'text' }}
                  error={Boolean(errors.city)}
                  helperText={
                    errors.city ?
                      errors.city.type === 'minLength' ?
                        'City is lenght more 2' :
                        'City is required' :
                      ''
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>

          <ListItem>
            <Controller
              name="postalCode"
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
                  id="postalCode"
                  label="Postal Code"
                  inputProps={{ type: 'text' }}
                  error={Boolean(errors.postalCode)}
                  helperText={
                    errors.postalCode ?
                      errors.postalCode.type === 'minLength' ?
                        'Postal Code is lenght more 2' :
                        'Postal Code is required' :
                      ''
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>

          <ListItem>
            <Controller
              name="country"
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
                  id="country"
                  label="Country"
                  inputProps={{ type: 'text' }}
                  error={Boolean(errors.country)}
                  helperText={
                    errors.country ?
                      errors.country.type === 'minLength' ?
                        'Country is lenght more 2' :
                        'Country is required' :
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
              Continue
            </Button>
          </ListItem>
        </List>
      </form>
    </Layout>
  )
}
