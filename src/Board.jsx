import React, { useEffect, useState } from 'react'
import BoardSquare from './BoardSquare'

export default function Board({ board, turn, flip }) {
  const [currentBoard, setCurrentBoard] = useState([])
  const [pos, setPos] = useState([[]])

  //Logic to mark all possible squares when making a move. setPos is getting data from Piece component where all possible moves are loaded in setPos
  pos.forEach((item) => {
    const index = getIndex(item[0], item[1], turn, flip)
    console.log(index)
    const divTag = document.getElementById(index)
    console.log('Div tag value = ', divTag?.children[0]?.children[0])
    if (divTag && divTag?.children[0]?.children[0]) {
      console.log('class list = ', divTag.children[0].children[0].classList)
      divTag.children[0].children[0].classList.add('paras-red')
    }
  })

  useEffect(() => {
    if (!pos.length) {
      for (let i = 0; i < 80; i++) {
        const divTag = document.getElementById(i)
        console.log('Div tag value = ', divTag?.children[0]?.children[0])
        if (divTag && divTag?.children[0]?.children[0]) {
          console.log('class list = ', divTag.children[0].children[0].classList)
          divTag.children[0].children[0].classList.remove('paras-red')
        }
      }
    }
  }, [pos])

  useEffect(() => {
    // flip logic is introduced here
    setCurrentBoard(turn === flip ? board.flat() : board.flat().reverse())
  }, [board, turn, flip])

  // function to give back grid position bases on the index i
  function getPosition(i) {
    const x = turn === flip ? i % 8 : Math.abs((i % 8) - 7)
    const y =
      turn === flip ? Math.abs(Math.floor(i / 8) - 7) : Math.floor(i / 8)

    return { x, y }
  }

  // function to give back the color based on index i. It has to be alternating for it to have a check board pattern.
  function color(i) {
    const { x, y } = getPosition(i)
    if ((x + y) % 2 === 1) return 'black-square'
    else return 'white-square'
  }
  // this function changes the index i to position defined with alphabet and number
  // is not necessary to have it. Can be removed by making some changes in index.js
  function getLocation(i) {
    const { x, y } = getPosition(i)
    const letter = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][x]
    return `${letter}${y + 1}`
  }

  // // Function to get index from rows and columns
  function getIndex(x, y, turn, flip) {
    let i

    if (turn === flip) {
      i = x * 8 + y
    } else {
      i = (7 - x) * 8 + (7 - y)
    }

    return i
  }

  return (
    <div className="board">
      {currentBoard.map((piece, i) => (
        <div key={i} className="square" id={i}>
          <BoardSquare
            piece={piece}
            id={`id_` + i}
            color={color(i)}
            position={getLocation(i)}
            setPos={setPos}
          />
        </div>
      ))}
    </div>
  )
}
