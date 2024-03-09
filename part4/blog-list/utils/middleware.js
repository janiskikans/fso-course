const morgan = require('morgan')

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

module.exports = { requestLogger }