import { BehaviorSubject } from 'rxjs'

// to create 8x8 grid
const ROWS = 8
const COLS = 8

// by default white will start game
var validColor = 'w'

// queen default positions. White one is on top followed by black one.
var queenMatrix = [
  [7, 4],
  [0, 3],
]

// variable so that when queen is in Danger a div appears to warn the player
var isQueenInDanger = false

// Create an empty chess board with only spaces
function createEmptyBoard() {
  const board = []
  for (let i = 0; i < ROWS; i++) {
    const row = new Array(COLS).fill(null)
    board.push(row)
  }
  return board
}

// Initialize the chess board with knights and queens
function initializeBoard() {
  const board = createEmptyBoard()

  // Place knights and queens on the board
  board[0][1] = { type: 'n', color: 'b' } // Knight
  board[0][6] = { type: 'n', color: 'b' } // Knight
  board[0][3] = { type: 'q', color: 'b' } // Queen
  board[7][4] = { type: 'q', color: 'w' } // Queen
  board[7][1] = { type: 'n', color: 'w' } // Knight
  board[7][6] = { type: 'n', color: 'w' } // Knight

  return board
}

// Observable to access the data
export const gameSubject = new BehaviorSubject({
  board: initializeBoard(),
  turn: validColor,
  queenPosition: queenMatrix,
  queeninDanger: isQueenInDanger,
})
export function move(fromPosition, toPosition) {
  //After Queen Danger is displayed we set it again false
  isQueenInDanger = false
  // Convert positions to [rowIndex, columnIndex] format
  const from = positionToIndices(fromPosition)
  const to = positionToIndices(toPosition)

  const fromPiece = gameSubject.value.board[from[0]][from[1]]
  const toPiece = gameSubject.value.board[to[0]][to[1]]

  // You need to validate that the move is allowed for the specific piece type
  /** We have Different Validator.
   * isNotEqual checks start and end positions are not same and same color pieces are not sitting on start and end positions
   * isValidColorMove allows only valid color piece to move. This ensures fair turns in the game
   * isValidKnightMove and isValidQueenMove checks if the moves are following the known rules of their respective pieces
   */
  const isNotEqualValue = isNotEqual(
    fromPosition,
    toPosition,
    fromPiece,
    toPiece
  )
  const isValidColorMoveValue = isValidColorMove(fromPiece)

  const isValidKnightMoveValue = isValidKnightMove(from, to, fromPiece)
  const isValidQueenMoveValue = isValidQueenMove(from, to, fromPiece)

  if (
    isNotEqualValue &&
    isValidColorMoveValue &&
    (isValidKnightMoveValue || isValidQueenMoveValue)
  ) {
    // valid color changes ensuring the player can take turns
    validColorMove(fromPiece)

    // both of these functions check if the respective queen is in danger
    // it will show in div and will only appear if the queen is getting approached by an enemy piece
    whiteQueenCheck(gameSubject, fromPiece, to)
    blackQueenCheck(gameSubject, fromPiece, to)

    // updating board
    const updatedBoard = JSON.parse(JSON.stringify(gameSubject.value.board))
    updatedBoard[to[0]][to[1]] = fromPiece
    updatedBoard[from[0]][from[1]] = null

    // here it is ensured that if queen is gone them the game gets over and new game is reloaded again.
    if (endGame(toPiece)) {
      if (toPiece.color === 'w') {
        console.log('game end and black won')
        window.alert('game end and black won')
        window.location.reload()
      } else {
        console.log('game end and white won')
        window.alert('game end and white won')
        window.location.reload()
      }
    }
    if (isValidQueenMoveValue) {
      // updating position of queen to track it in more efficient way (for dangers) instead of getting data from the board
      if (fromPiece.color === 'w') {
        queenMatrix[0] = to
      }
      if (fromPiece.color === 'b') {
        queenMatrix[1] = to
      }

      // updating the observable here
      gameSubject.next({
        board: updatedBoard,
        turn: validColor,
        queenPosition: queenMatrix,
        queeninDanger: isQueenInDanger,
      })
    } else {
      gameSubject.next({
        board: updatedBoard,
        turn: validColor,
        queenPosition: queenMatrix,
        queeninDanger: isQueenInDanger,
      })
    }
  }
}

// Function to convert position in "a1" format to [rowIndex, columnIndex]
export function positionToIndices(position) {
  const columnMap = {
    a: 0,
    b: 1,
    c: 2,
    d: 3,
    e: 4,
    f: 5,
    g: 6,
    h: 7,
  }
  const rowMap = {
    0: 7,
    1: 6,
    2: 5,
    3: 4,
    4: 3,
    5: 2,
    6: 1,
    7: 0,
  }

  const row = rowMap[parseInt(position[1]) - 1]
  const column = columnMap[position[0]]
  return [row, column]
}

// Function to check if start and end positions are not same and same color pieces are not sitting on start and end positions
function isNotEqual(from, to, fromPiece, toPiece) {
  if (from === to || fromPiece?.color === toPiece?.color) {
    return false
  } else {
    return true
  }
}
// Function to check if the move is valid for a knight
function isValidKnightMove(from, to, piece) {
  const deltaX = Math.abs(to[0] - from[0])
  const deltaY = Math.abs(to[1] - from[1])

  // Knights move in an L-shape pattern: 2 squares in one direction and 1 square perpendicular
  return (
    ((deltaX === 2 && deltaY === 1) || (deltaX === 1 && deltaY === 2)) &&
    piece?.type === 'n'
  )
}

// Function to check if the move is valid for a queen
function isValidQueenMove(from, to, piece) {
  const deltaX = Math.abs(to[0] - from[0])
  const deltaY = Math.abs(to[1] - from[1])

  // Queens can move horizontally, vertically, or diagonally
  return (
    (isValidRookMove(deltaX, deltaY) || isValidBishopMove(deltaX, deltaY)) &&
    piece?.type === 'q'
  )
}

// Function to check if the move is valid for a rook
function isValidRookMove(deltaX, deltaY) {
  return deltaX === 0 || deltaY === 0
}

// Function to check if the move is valid for a bishop
function isValidBishopMove(deltaX, deltaY) {
  return deltaX === deltaY
}

// function to check if only allowed piece color can make moves
function isValidColorMove(piece) {
  if (piece?.color === validColor) {
    return true
  } else {
    return false
  }
}

// function to change valid color in-order for player to get turns
function validColorMove(piece) {
  validColor = piece.color === 'w' ? 'b' : 'w'
}

// Function to check if white Queen is in danger
function whiteQueenCheck(gameSubject, fromPiece, to) {
  if (fromPiece?.type === 'n' && fromPiece.color === 'b') {
    const validMoves = getMovesforKnights(to)
    validMoves.forEach((position) => {
      if (
        gameSubject?.value?.queenPosition[0][0] === position[0] &&
        gameSubject?.value?.queenPosition[0][1] === position[1]
      ) {
        console.log('White Queen in Danger')
        isQueenInDanger = true
        return true
      }
    })
  }
  if (fromPiece.type === 'q' && fromPiece.color === 'b') {
    const validMoves = getMovesforQueens(to)
    validMoves.forEach((position) => {
      if (
        gameSubject?.value?.queenPosition[0][0] === position[0] &&
        gameSubject?.value?.queenPosition[0][1] === position[1]
      ) {
        console.log('White Queen in Danger')
        isQueenInDanger = true
        return true
      }
    })
  }
}

// function to check if black Queen is in Danger
function blackQueenCheck(gameSubject, fromPiece, to) {
  if (fromPiece?.type === 'n' && fromPiece.color === 'w') {
    const validMoves = getMovesforKnights(to)
    validMoves.forEach((position) => {
      if (
        gameSubject?.value?.queenPosition[1][0] === position[0] &&
        gameSubject?.value?.queenPosition[1][1] === position[1]
      ) {
        console.log('Black Queen in Danger')
        isQueenInDanger = true
        return true
      }
    })
  }
  if (fromPiece.type === 'q' && fromPiece.color === 'w') {
    const validMoves = getMovesforQueens(to)
    validMoves.forEach((position) => {
      if (
        gameSubject?.value?.queenPosition[1][0] === position[0] &&
        gameSubject?.value?.queenPosition[1][1] === position[1]
      ) {
        console.log('Black Queen in Danger')
        isQueenInDanger = true
        return true
      }
    })
  }
}

// function to get all possible move for knights
export function getMovesforKnights(position) {
  const [row, col] = position
  const possibleMoves = [
    [row - 2, col - 1],
    [row - 2, col + 1],
    [row - 1, col - 2],
    [row - 1, col + 2],
    [row + 1, col - 2],
    [row + 1, col + 2],
    [row + 2, col - 1],
    [row + 2, col + 1],
  ]
  const validMoves = possibleMoves.filter(([r, c]) => {
    return r >= 0 && r < ROWS && c >= 0 && c < COLS
  })

  return validMoves
}

// function to get all possible valid moves for queens
export function getMovesforQueens(position) {
  const [row, col] = position

  const possibleMoves = []

  // Valid moves in horizontal and vertical directions
  for (let i = 0; i < 8; i++) {
    if (i !== col) {
      possibleMoves.push([row, i]) // Horizontal moves
    }
    if (i !== row) {
      possibleMoves.push([i, col]) // Vertical moves
    }
  }

  // Valid moves in diagonal directions
  for (let i = -7; i <= 7; i++) {
    if (i !== 0) {
      possibleMoves.push([row + i, col + i])
      possibleMoves.push([row + i, col - i])
    }
  }

  return possibleMoves.filter((move) => {
    const [moveRow, moveCol] = move
    return isValidPosition(moveRow, moveCol)
  })
}

function isValidPosition(row, col) {
  return row >= 0 && row < 8 && col >= 0 && col < 8
}

// function to check that if queen is gone then the game should end
function endGame(toPiece) {
  if (toPiece?.type === 'q') {
    return true
  }
}
