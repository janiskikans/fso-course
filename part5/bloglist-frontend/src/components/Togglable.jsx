import { useState } from "react"

const Toggleable = ({ children, showButtonLabel = 'show', hideButtonLabel = 'hide' }) => {
  const [isVisible, setIsVisible] = useState(false)

  const hideWhenVisibleStyle = { display: isVisible ? 'none': '' }
  const showWhenVisibleStyle = { display: isVisible ? '' : 'none' }

  const toggleVisibility = () => setIsVisible(!isVisible)

  return (
    <div>
      <div style={hideWhenVisibleStyle}>
        <button onClick={toggleVisibility}>{showButtonLabel}</button>
      </div>
      <div style={showWhenVisibleStyle}>
        {children}
        <button onClick={toggleVisibility}>{hideButtonLabel}</button>
      </div>
    </div>
  )
}

export default Toggleable