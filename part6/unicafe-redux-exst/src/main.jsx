import React from 'react'
import ReactDOM from 'react-dom/client'

import { createStore } from 'redux'
import reducer from './reducer'

const store = createStore(reducer)

const App = () => {
  const onGoodClick = () => {
    store.dispatch({
      type: 'GOOD'
    })
  }

  const onBadClick = () => {
    store.dispatch({
      type: 'BAD'
    })
  }

  const onOkClick = () => {
    store.dispatch({
      type: 'OK'
    })
  }

  const onResetClick = () => {
    store.dispatch({
      type: 'ZERO'
    })
  }

  const state = store.getState()

  return (
    <div>
      <button onClick={onGoodClick}>good</button> 
      <button onClick={onOkClick}>ok</button> 
      <button onClick={onBadClick}>bad</button>
      <button onClick={onResetClick}>reset stats</button>
      <div>good {state.good}</div>
      <div>ok {state.ok}</div>
      <div>bad {state.bad}</div>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))

const renderApp = () => {
  root.render(<App />)
}

renderApp()
store.subscribe(renderApp)
