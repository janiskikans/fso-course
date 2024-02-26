const Notification = ({ notification }) => {
  if (!notification.message) {
    return null
  }

  const notificationStyle = {
    color: notification.type === 'success' ? 'green' : 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    borderWidth: 3,
    padding: 10,
    marginBottom: 10,
  }

  return <div style={notificationStyle}>{ notification.message }</div>
}

export default Notification