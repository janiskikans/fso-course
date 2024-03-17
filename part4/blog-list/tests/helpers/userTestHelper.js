const User = require('../../models/user')

const getDbUsers = async () => {
  const users = await User.find({})

  return users.map(user => user.toJSON())
}

const deleteAllUsers = async () => {
  await User.deleteMany({})
}

module.exports = { getDbUsers, deleteAllUsers }