const info = (...params) => {
  if (!shouldLog) {
    return
  }

  console.log(...params)
}

const error = (...params) => {
  if (!shouldLog) {
    return
  }

  console.error(...params)
}

const shouldLog = () => process.env.NODE_ENV !== 'test'

module.exports = {
  info,
  error,
}