import React, { useEffect, useState } from 'react'

import './App.css'
import { gameSubject } from './Logic'
import Board from './Board'

function App() {
  const [board, setBoard] = useState([])
  const [turn, setTurn] = useState()
  const [flip, setFlip] = useState('w')
  const [queenInDanger, setQueenInDanger] = useState(false)
  function flipping() {
    flip === 'w' ? setFlip('b') : setFlip('w')
  }
  useEffect(() => {
    const sub = gameSubject.subscribe((game) => {
      setBoard(game.board)
      setTurn(game.turn)
      setQueenInDanger(game.queeninDanger)
    })
    return () => sub.unsubscribe()
  }, [])
  return (
    <>
      {/* Flip button */}
      <div className="flip-danger">
        <button onClick={flipping} className="flipping">
          Flip
        </button>
        {/* Queen in Danger div */}
        <div className={queenInDanger ? 'dangerVisible' : 'dangerNonVisible'}>
          <div className="danger-text">Queen in Danger</div>
        </div>
      </div>
      {/* Chess */}
      <div className="container">
        <div className="board-container">
          <Board board={board} turn={turn} flip={flip}></Board>
        </div>
      </div>
    </>
  )
}

export default App
