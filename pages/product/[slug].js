import { useContext } from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import Image from 'next/image'
import axios from 'axios'

import Link from '@mui/material/Link'
import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Layout from '../../components/Layout'
import db from '../../utils/db'
import Product from '../../models/Product'
import { useStyles } from '../../utils/styles'
import { Store } from '../../utils/Store'

export default function ProductScreen(props) {
  const router = useRouter()
  const { dispatch } = useContext(Store)
  const { product } = props
  const classes = useStyles()

  if (!product) {
    return <div>Product not Found</div>
  }

  const addToCartHandler = async () => {
    const { data } = await axios.get(`/api/products/${product._id}`)
    if (data.countInStock <= 0) {
      window.alert('Sorry. Product is out of stock')
      return
    }
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity: 1 }
    })
    router.push('/cart')
  }

  return (
    <Layout
      title={product.name}
      description={product.description}
    >
      <div className={classes.section}>
        <NextLink href="/" passHref>
          <Link>
            <Typography>
              back to products
            </Typography>
          </Link>
        </NextLink>
      </div>

      <Grid container spacing={1}>
        <Grid item md={6} xs={12}>
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
            layout="responsive"
          />
        </Grid>

        <Grid item md={3} xs={12}>
          <List>
            <ListItem>
              <Typography component="h1" variant="h1">
                {product.name}
              </Typography>
            </ListItem>

            <ListItem>
              <Typography>
                Category: {product.category}
              </Typography>
            </ListItem>

            <ListItem>
              <Typography>
                Brand: {product.brand}
              </Typography>
            </ListItem>

            <ListItem>
              <Typography>
                Rating: {product.rating} stars ({product.numReviews} reviews)
              </Typography>
            </ListItem>

            <ListItem>
              <Typography>
                Description: {product.description}
              </Typography>
            </ListItem>
          </List>
        </Grid>

        <Grid item md={3} xs={12}>
          <Card>
            <List>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>
                      Price:
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography>
                      $ {product.price}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>

              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>
                      Status:
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography>
                      {product.countInStock > 0 ? 'In stock' : 'unavailable now'}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>

              <ListItem>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={addToCartHandler}
                // color="primery"
                >
                  <Typography>
                    Add to cart
                  </Typography>
                </Button>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const { params } = context
  const { slug } = params

  await db.connect()
  const product = await Product.findOne({ slug }).lean()
  await db.disconnect()

  return {
    props: {
      product: db.convertDocToObj(product)
    },
  }
}
