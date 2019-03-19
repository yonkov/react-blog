const jwt = require('jsonwebtoken')
const User = require('../models/User')

module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).end()
  }

  const token = req.headers.authorization.split(' ')[1]
  // decode the token using a secret key-phrase
  jwt.verify(token.toString(), 'somesupersecret', (err, decoded) => {
    if (err) {
      return res.status(401).end()
    }

    const userId = decoded.userId

    User
      .findOne({ _id: userId })
      .then(user => {

        if (!user) {
          return res.status(401).end()
        }
        req.user = user
        if (!req.user.roles.includes('Admin')) {
          return res.status(401).end()
        }

        return next()
      })
  })

  
}