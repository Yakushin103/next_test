import jwt from 'jsonwebtoken'

const signToken = (user) => {
  const { _id, name, email, isAdmin } = user

  return jwt.sign({ _id, name, email, isAdmin },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d'
    }
  )
}

export { signToken }