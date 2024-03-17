const User = require('../../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const getDbUsers = async () => {
  const users = await User.find({})

  return users.map(user => user.toJSON())
}

const deleteAllUsers = async () => {
  await User.deleteMany({})
}

const createUser = async (username = 'johndoetest') => {
  const passwordHash = await bcrypt.hash('secretpass', 10)
  const user = new User({ username, name: 'John Doe Test', password: passwordHash })

  await user.save()

  return user
}

const getToken = (user) => {
  return jwt.sign(
    {
      username: user.username,
      id: user._id,
    },
    process.env.APP_SECRET
  )
}

module.exports = { getDbUsers, deleteAllUsers, createUser, getToken }