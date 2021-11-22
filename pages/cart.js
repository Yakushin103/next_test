import { useContext } from 'react'
import axios from 'axios'
import NextLink from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Link from '@mui/material/Link'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Layout from '../components/Layout'
import { Store } from '../utils/Store'

function CartScreen() {
  const router = useRouter()
  const { state, dispatch } = useContext(Store)
  const { cart: { cartItems } } = state

  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`)
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock')
      return
    }
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity }
    })
  }

  const removeItemHandler = (item) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: item })
  }

  const checkoutHandler = () => {
    router.push('/shipping')
  }

  return (
    <Layout title="Shopping Cart">
      <Typography component="h1" variant="h1">
        Shopping Cart
      </Typography>

      {
        cartItems.length === 0 ?
          <div>
            Cart is empty.
            <NextLink passHref href="/">
              <Link>
                Go shopping
              </Link>
            </NextLink>
          </div> :
          <Box>
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              spacing={1}
            >
              <Grid item md={9} xs={12}>
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

                        <TableCell align="right">
                          Action
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {
                        cartItems.map((item) => (
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
                              <Select
                                value={item.quantity}
                                onChange={(e) => updateCartHandler(item, e.target.value)}
                              >
                                {
                                  [...Array(item.countInStock).keys()]
                                    .map((x) => (
                                      <MenuItem
                                        key={x + 1}
                                        value={x + 1}
                                      >
                                        {x + 1}
                                      </MenuItem>
                                    ))
                                }
                              </Select>
                            </TableCell>

                            <TableCell align="right">
                              $ {item.price}
                            </TableCell>

                            <TableCell align="right">
                              <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => removeItemHandler(item)}
                              >
                                x
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      }
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              <Grid item md={3} xs={12}>
                <Card>
                  <List>
                    <ListItem>
                      <Typography variant="h2">
                        Subtotal ({
                          cartItems.reduce((a, c) => a + c.quantity, 0)
                        }
                        {' '}
                        items) : $ {' '}
                        {cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}
                      </Typography>
                    </ListItem>

                    <ListItem>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={checkoutHandler}
                      >
                        Check Out
                      </Button>
                    </ListItem>
                  </List>
                </Card>
              </Grid>
            </Grid>
          </Box>
      }
    </Layout>
  )
}

export default dynamic(() => Promise.resolve(CartScreen), { ssr: false })
