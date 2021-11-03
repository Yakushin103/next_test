import { useRouter } from 'next/router'
import NextLink from 'next/link'
import Image from 'next/image'

import Link from '@mui/material/Link'
import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Layout from '../../components/Layout'
import { data } from '../../utils/data'
import { useStyles } from '../../utils/styles'

export default function ProductScreen() {
  const classes = useStyles()
  const router = useRouter()
  const { slug } = router.query
  const product = data.products.find(prod => prod.slug === slug)

  if (!product) {
    return <div>Product not Found</div>
  }

  return (
    <Layout title={product.name}>
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
