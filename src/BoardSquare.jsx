import React, { useState } from 'react'
import Square from './Square'
import Piece from './Piece'
import { useDrop } from 'react-dnd'
import { getMovesforKnights, getMovesforQueens, move } from './Logic'

export default function BoardSquare({ piece, color, position, id, setPos }) {
  const [isDrag, setIsDrag] = React.useState(false)

  const [, drop] = useDrop({
    accept: 'piece',
    drop: (item) => {
      const [fromPos] = item.id.split('_')
      move(fromPos, position)
    },
  })

  return (
    <div className="board-square" ref={drop}>
      <Square color={`${color}  ${isDrag ? 'paras-red' : ''}`}>
        {piece && (
          <Piece
            setIsDrag={setIsDrag}
            setPos={setPos}
            id={id}
            piece={piece}
            position={position}
          />
        )}
      </Square>
    </div>
  )
}
