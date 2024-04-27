import { useState, forwardRef, useImperativeHandle } from "react"

const Toggleable = forwardRef(({ children, showButtonLabel = 'show', hideButtonLabel = 'hide' }, refs) => {
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

export default Toggleable