const morgan = require('morgan')
const jwt = require('jsonwebtoken')

const requestLogger = () => {
  morgan.token('body', function (req) { return JSON.stringify(req.body)})

  return morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      tokens['body'](req, res),
    ].join(' ')
  })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  if (error.name === 'MongoServerError') {
    if (error.message.includes('E11000 duplicate key error')) {
      return response.status(400).json({ error: 'expected `username` to be unique' })
    }
  }

  if (error.name ===  'JsonWebTokenError') {
    return response.status(400).json({ error: 'token missing or invalid' })
  }

  next(error)
}

const verifyToken = async (request, response, next) => {
  const token = getTokenFromRequest(request)
  if (!token) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const decodedToken = jwt.verify(token, process.env.APP_SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  request.authUserId = decodedToken.id
  next()
}

const getTokenFromRequest = request => {
  const authorization = request.get('Authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }

  return null
}

module.exports = { requestLogger, errorHandler, verifyToken }