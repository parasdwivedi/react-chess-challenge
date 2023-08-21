import React from 'react'

export default function Square({ children, color }) {
  return <div className={`${color} board-square`}>{children}</div>
}
