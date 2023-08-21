import React from 'react'
import { useDrag, DragPreviewImage } from 'react-dnd'
import {
  getMovesforKnights,
  getMovesforQueens,
  positionToIndices,
} from './Logic'
export default function Piece({
  piece: { type, color },
  position,
  id,
  setIsDrag,
  setPos,
}) {
  const [{ isDragging }, drag, preview] = useDrag({
    item: { type: 'piece', id: `${position}_${type}_${color}` },
    begin: () => {
      console.log(id)
      console.log(`${position}_${type}_${color}`)
      setIsDrag(true)
      if (type === 'q') {
        const actualPosition = positionToIndices(position)
        console.log(getMovesforQueens(actualPosition))
        setPos(getMovesforQueens(positionToIndices(position)))
      }
      if (type === 'n') {
        const actualPosition = positionToIndices(position)
        console.log(getMovesforKnights(actualPosition))
        setPos(getMovesforKnights(actualPosition))
      }
    },
    end: () => {
      setIsDrag(false)
      setPos([])
    },
    collect: (monitor) => {
      // console.log('envet 1', monitor, monitor.isDragging()?.id)
      return { isDragging: !!monitor.isDragging() }
    },
  })

  const pieceImg = require(`./assets/${type}_${color}.png`)

  return (
    <>
      <DragPreviewImage connect={preview} src={pieceImg} />
      <div
        className={`piece-container`}
        ref={drag}
        style={{ opacity: isDragging ? 0 : 1 }}
      >
        <img src={pieceImg} alt="" className="piece" />
      </div>
    </>
  )
}
