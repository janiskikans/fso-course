import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    setNotificationContent(state, action) {
      return action.payload
    },
    clearNotification() {
      return '';
    }
  }
})

export const { clearNotification, setNotificationContent } = notificationSlice.actions

export const setNotification = (notification, ttlInSeconds) => {
  return async dispatch => {
    dispatch(setNotificationContent(notification))
    setTimeout(() => dispatch(clearNotification()), ttlInSeconds * 1000)
  }
}

export default notificationSlice.reducer