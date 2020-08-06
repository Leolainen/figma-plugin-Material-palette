import * as React from 'react'
import './styles.css'

type Props = {
    className?: string,
    children: React.ReactChild,
}

const Button: React.FC<Props & React.HTMLAttributes<HTMLButtonElement>> = props => {
  const { className, children, ...other } = props

  return (
    <button
      className={`root ${className}`}
      {...other}
    >
      {children}
    </button>
  )
}

Button.displayName = 'Button'

export default Button
