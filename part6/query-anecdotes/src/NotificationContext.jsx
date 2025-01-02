import { createContext, useReducer, useContext } from "react";

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.payload
    case 'CLEAR':
      return ''
    default:
      return state
  }
}

const NotificationContext = createContext()

export const useNotifcationValue = () => {
  const notificationAndDispatch = useContext(NotificationContext)

  return notificationAndDispatch[0]
}

export const useNotifcationDispatch = () => {
  const notificationAndDispatch = useContext(NotificationContext)

  return notificationAndDispatch[1]
}

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, '')

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
        {props.children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext