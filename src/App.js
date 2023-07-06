import { useState } from "react";

function Square({ value, onSquareClick, isHighlight }) {
  return (
    <button
      className={isHighlight ? "highlight" : "square"}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + squares[winner[0]];
  } else if (squares.every((square) => square !== null)) {
    status = "Draw";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const createBoard = (size) => {
    const myBoard = [];
    for (let i = 0; i < size; i++) {
      const myRow = [];
      for (let j = 0; j < size; j++) {
        const index = i * size + j;
        const isHighlight = winner && winner.includes(index);
        myRow.push(
          <Square
            value={squares[index]}
            onSquareClick={() => handleClick(index)}
            isHighlight={isHighlight}
          />
        );
      }
      myBoard.push(<div className="board-row">{myRow}</div>);
    }
    return myBoard;
  };

  return (
    <>
      <div className="status">{status}</div>
      {createBoard(3)}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isupper, setisupper] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const handleMove = (squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  };

  let moves = history.map(handleMove);
  if (isupper) {
    moves = history.map(handleMove).slice().reverse();
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        You are at move #{currentMove}
        <div>
          <button
            onClick={() => {
              setisupper(!isupper);
            }}
          >
            switch
          </button>
        </div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c];
    }
  }
  return null;
}
