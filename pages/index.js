import { useContext } from 'react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import axios from 'axios'

import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Layout from '../components/Layout'
import db from '../utils/db'
import Product from '../models/Product'
import { Store } from '../utils/Store'

export default function Home(props) {
  const router = useRouter()
  const { products } = props
  const { state, dispatch } = useContext(Store)

  const addToCartHandler = async (product) => {
    const existItem = state.cart.cartItems.find(x => x._id === product._id)
    const quantity = existItem ? existItem.quantity + 1 : 1
    const { data } = await axios.get(`/api/products/${product._id}`)

    if (data.countInStock < 0) {
      window.alert('Sorry. Product is out of stock')
      return
    }

    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity }
    })

    router.push('/cart')
  }

  return (
    <Layout>
      <div>
        <h1>
          Products
        </h1>

        <Grid container spacing={3}>
          {
            products.map(product => (
              <Grid item md={4} key={product.name}>
                <Card>
                  <NextLink href={`/product/${product.slug}`} passHref>
                    <CardActionArea>
                      <CardMedia
                        title={product.name}
                        component="img"
                        image={product.image}
                      />

                      <CardContent>
                        <Typography>
                          {product.name}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </NextLink>

                  <CardActions>
                    <Typography>
                      $ {product.price}
                    </Typography>

                    <Button
                      size="small"
                      color="primary"
                      onClick={() => addToCartHandler(product)}
                    >
                      Add to cart
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          }
        </Grid>
      </div>
    </Layout>

  )
}

export async function getServerSideProps() {

  await db.connect()
  const products = await Product.find({}).lean()
  await db.disconnect()

  return {
    props: {
      products: products.map(db.convertDocToObj)
    },
  }
}
