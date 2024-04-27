import { useState, forwardRef, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

const Toggleable = forwardRef(({ children, showButtonLabel, hideButtonLabel }, refs) => {
  const [isVisible, setIsVisible] = useState(false)

  const hideWhenVisibleStyle = { display: isVisible ? 'none': '' }
  const showWhenVisibleStyle = { display: isVisible ? '' : 'none' }

  const toggleVisibility = () => setIsVisible(!isVisible)

  useImperativeHandle(refs, () => {
    return { toggleVisibility }
  })

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
})

Toggleable.propTypes = {
  showButtonLabel: PropTypes.string.isRequired,
  hideButtonLabel: PropTypes.string.isRequired,
}

Toggleable.displayName = 'Toggleable'

export default Toggleable