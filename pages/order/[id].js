import { useContext, useEffect, useReducer } from 'react'
import axios from 'axios'
import NextLink from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { useSnackbar } from 'notistack'
import { useRouter } from 'next/router'
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js"

import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import CircularProgress from '@mui/material/CircularProgress'
import Layout from '../../components/Layout'
import CheckoutWizard from '../../components/CheckoutWizard'
import { Store } from '../../utils/Store'
import { useStyles } from '../../utils/styles'
import { getError } from '../../utils/error'

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return {
        ...state,
        loading: true,
        error: ''
      }
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        order: action.payload,
        error: ''
      }
    case 'FETCH_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload
      }
    case 'PAY_REQUEST':
      return {
        ...state,
        loadingPay: true
      }
    case 'PAY_SUCCESS':
      return {
        ...state,
        loadingPay: false,
        successPay: true
      }
    case 'PAY_ERROR':
      return {
        ...state,
        loadingPay: false,
        errorPay: action.payload
      }
      case 'PAY_RESET':
      return {
        ...state,
        loadingPay: false,
        successPay: false,
        errorPay: ''
      }
    default: state
  }
}

function Order({ params }) {
  const orderId = params.id
  const router = useRouter()
  const { state } = useContext(Store)
  const { userInfo } = state
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()
  const [{ loading, error, order, successPay }, dispatch] = useReducer(
    reducer, {
    loading: true,
    order: {},
    error: ''
  })

  const {
    shippingAddress,
    paymentMethod,
    orderItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isDelivered,
    deliveredAt,
    isPaid,
    paidAt
  } = order
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer()

  useEffect(() => {
    if (!userInfo) {
      router.push('/login')
    }
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' })
        const { data } = await axios.get(
          `/api/orders/${orderId}`,
          {
            headers: {
              authorization: `Bearer ${userInfo.token}`
            }
          }
        )
        dispatch({ type: 'FETCH_SUCCESS', payload: data })
      } catch (err) {
        dispatch({ type: 'FETCH_ERROR', payload: getError(err) })
      }
    }
    if (!order._id || successPay || (order._id && order._id !== orderId)) {
      fetchOrder()
      if (successPay) {
        dispatch({ type: 'PAY_RESET' })
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get(
          '/api/keys/paypal',
          {
            headers: {
              authorization: `Bearer ${userInfo.token}`
            }
          }
        )

        paypalDispatch({
          type: 'resetOptions', value: {
            'client-id': clientId,
            currency: 'USD'
          }
        })

        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' })
      }
      loadPaypalScript()
    }
  }, [router, userInfo, dispatch, orderId, order, paypalDispatch, successPay])

  function createOrder(data, actions) {
    return actions.order.create({
      purchase_units: [
        {
          amount: { value: totalPrice }
        }
      ]
    }).then((orderID) => {
      return orderID
    })
  }

  function onApprove(data, actions) {
    return actions.order.capture()
      .then(async function (details) {
        try {
          dispatch({ type: 'PAY_REQUEST' })
          const { data } = await axios.put(
            `/api/orders/${order._id}/pay`,
            details,
            {
              headers: {
                authorization: `Bearer ${userInfo.token}`
              }
            }
          )
          dispatch({ type: 'PAY_SUCCESS', payload: data })
          enqueueSnackbar('order is paid', { variant: 'success' })
        } catch (err) {
          dispatch({ type: 'PAY_FAIL', payload: getError(err) })
          enqueueSnackbar(getError(err), { variant: 'error' })
        }
      })
  }

  function onError(err) {
    enqueueSnackbar(getError(err), { variant: 'error' })
  }

  return (
    <Layout title={`Order ${orderId}`}>
      <CheckoutWizard activeStep={3} />

      <Typography component="h1" variant="h1">
        Order - {orderId}
      </Typography>

      {
        loading ? (<CircularProgress />) :
          error ? <Typography className={classes.error}>
            {error}
          </Typography> : (
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              spacing={1}
            >
              <Grid item md={9} xs={12}>
                <Card className={classes.section}>
                  <List>
                    <ListItem>
                      <Typography variant="h2">
                        Shipping Address
                      </Typography>
                    </ListItem>

                    <ListItem>
                      {shippingAddress.fullName}, {shippingAddress.address},
                      {' '}
                      {shippingAddress.city}, {shippingAddress.postalCode},
                      {' '}
                      {shippingAddress.country}
                    </ListItem>

                    <ListItem>
                      Status: {' '}
                      {
                        isDelivered ?
                          `delivered at ${deliveredAt}` :
                          'not delivered'
                      }
                    </ListItem>
                  </List>
                </Card>

                <Card className={classes.section}>
                  <List>
                    <ListItem>
                      <Typography variant="h2">
                        Payment Method
                      </Typography>
                    </ListItem>

                    <ListItem>
                      {paymentMethod}
                    </ListItem>

                    <ListItem>
                      Status: {' '}
                      {
                        isPaid ?
                          `paid at ${paidAt}` :
                          'not paid'
                      }
                    </ListItem>
                  </List>
                </Card>

                <Card className={classes.section}>
                  <List>
                    <ListItem>
                      <Typography component="h2" variant="h2">
                        Order Items
                      </Typography>
                    </ListItem>

                    <ListItem>
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>
                                Image
                              </TableCell>

                              <TableCell>
                                Name
                              </TableCell>

                              <TableCell align="right">
                                Quantity
                              </TableCell>

                              <TableCell align="right">
                                Price
                              </TableCell>
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {
                              orderItems.map((item) => (
                                <TableRow key={item._id}>
                                  <TableCell>
                                    <NextLink passHref href={`/product/${item.slug}`}>
                                      <Link>
                                        <Image
                                          src={item.image}
                                          alt={item.name}
                                          width={50}
                                          height={50}
                                        />
                                      </Link>
                                    </NextLink>
                                  </TableCell>

                                  <TableCell>
                                    <NextLink passHref href={`/product/${item.slug}`}>
                                      <Link>
                                        <Typography>
                                          {item.name}
                                        </Typography>
                                      </Link>
                                    </NextLink>
                                  </TableCell>

                                  <TableCell align="right">
                                    <Typography>
                                      {item.quantity}
                                    </Typography>
                                  </TableCell>

                                  <TableCell align="right">
                                    <Typography>
                                      $ {item.price}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              ))
                            }
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </ListItem>
                  </List>
                </Card>
              </Grid>

              <Grid item md={3} xs={12}>
                <Card className={classes.section}>
                  <List>
                    <ListItem>
                      <Typography variant="h2">
                        Order Summary
                      </Typography>
                    </ListItem>

                    <ListItem>
                      <Grid container>
                        <Grid item xs={6}>
                          <Typography>
                            Items:
                          </Typography>
                        </Grid>

                        <Grid item xs={6}>
                          <Typography align="right">
                            $ {itemsPrice}
                          </Typography>
                        </Grid>
                      </Grid>
                    </ListItem>

                    <ListItem>
                      <Grid container>
                        <Grid item xs={6}>
                          <Typography>
                            Tax:
                          </Typography>
                        </Grid>

                        <Grid item xs={6}>
                          <Typography align="right">
                            $ {taxPrice}
                          </Typography>
                        </Grid>
                      </Grid>
                    </ListItem>

                    <ListItem>
                      <Grid container>
                        <Grid item xs={6}>
                          <Typography>
                            Shipping:
                          </Typography>
                        </Grid>

                        <Grid item xs={6}>
                          <Typography align="right">
                            $ {shippingPrice}
                          </Typography>
                        </Grid>
                      </Grid>
                    </ListItem>

                    <ListItem>
                      <Grid container>
                        <Grid item xs={6}>
                          <Typography>
                            <strong>
                              Total:
                            </strong>
                          </Typography>
                        </Grid>

                        <Grid item xs={6}>
                          <Typography align="right">
                            <strong>
                              $ {totalPrice}
                            </strong>
                          </Typography>
                        </Grid>
                      </Grid>
                    </ListItem>

                    {
                      !isPaid && (
                        <ListItem>
                          {isPending ? (<CircularProgress />) :
                            (
                              <div className={classes.fullWidth}>
                                <PayPalButtons
                                  createOrder={createOrder}
                                  onApprove={onApprove}
                                  onError={onError}
                                ></PayPalButtons>
                              </div>
                            )
                          }
                        </ListItem>
                      )
                    }
                  </List>
                </Card>
              </Grid>
            </Grid>
          )
      }

    </Layout>
  )
}

export async function getServerSideProps({ params }) {
  return { props: { params } }
}

export default dynamic(() => Promise.resolve(Order), { ssr: false })
