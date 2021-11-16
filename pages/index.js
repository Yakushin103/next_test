import NextLink from 'next/link'

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

export default function Home(props) {
  const { products } = props

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

                    <Button size="small" color="primary">
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
