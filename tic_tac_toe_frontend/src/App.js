import React, { useState, useEffect } from 'react';
import './App.css';

// PUBLIC_INTERFACE
/**
 * Main App component for the Tic Tac Toe game.
 * Contains all UI, game logic, and responsive layout.
 */
function App() {
  // Game state
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true); // X always goes first
  const [winner, setWinner] = useState(null);
  const [status, setStatus] = useState('Next player: X');
  const [draw, setDraw] = useState(false);
  const [animateIndex, setAnimateIndex] = useState(null);

  // Theme toggling (light only, but structure kept for flexibility)
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  // Calculate winner or draw and update status text
  useEffect(() => {
    const calculatedWinner = calculateWinner(squares);
    if (calculatedWinner) {
      setWinner(calculatedWinner);
      setStatus(`Winner: ${calculatedWinner}`);
      setDraw(false);
    } else if (squares.every(square => square !== null)) {
      setDraw(true);
      setStatus('Draw!');
      setWinner(null);
    } else {
      setDraw(false);
      setStatus('Next player: ' + (xIsNext ? 'X' : 'O'));
      setWinner(null);
    }
  }, [squares, xIsNext]);

  // PUBLIC_INTERFACE
  function handleSquareClick(idx) {
    if (winner || squares[idx]) return;
    // Animate move
    setAnimateIndex(idx);
    setTimeout(() => setAnimateIndex(null), 400);
    const newSquares = squares.slice();
    newSquares[idx] = xIsNext ? 'X' : 'O';
    setSquares(newSquares);
    setXIsNext(!xIsNext);
  }

  // PUBLIC_INTERFACE
  function handleRestart() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
    setDraw(false);
    setStatus('Next player: X');
  }

  // UI Board rendering
  function renderSquare(i) {
    const isWinSquare = winner && winningLine(squares)?.includes(i);
    return (
      <button
        key={i}
        className={`ttt-square${isWinSquare ? ' win' : ''}${animateIndex === i ? ' anim' : ''}`}
        onClick={() => handleSquareClick(i)}
        aria-label={`Square ${i + 1} for player ${squares[i] || (xIsNext ? 'X' : 'O')}`}
        disabled={Boolean(squares[i]) || Boolean(winner)}
      >
        {squares[i] &&
          <span className="ttt-symbol">
            {squares[i]}
          </span>
        }
      </button>
    );
  }

  // PUBLIC_INTERFACE
  return (
    <div className="ttt-root">
      <main className="ttt-main">
        <header className="ttt-header">
          <h1 className="ttt-title">Tic Tac Toe</h1>
          <div className="ttt-status">{status}</div>
        </header>
        <section className="ttt-board-container">
          <div className="ttt-board" role="grid" aria-label="Tic Tac Toe Board">
            {[0, 1, 2].map(row =>
              <div className="ttt-board-row" key={row} role="row">
                {[0, 1, 2].map(col => renderSquare(row * 3 + col))}
              </div>
            )}
          </div>
        </section>
        <section className="ttt-controls">
          <button
            className="ttt-btn"
            onClick={handleRestart}
            aria-label="Restart Game"
            tabIndex={0}
          >Restart</button>
        </section>
        <footer className="ttt-footer">
          <span className="ttt-brand">
            <span style={{color: "var(--accent-color)"}}>TicTacToe</span>
            <span style={{color: "var(--secondary-color)", marginLeft: 6, fontWeight: 400, fontSize: "1em"}}>by Kavia</span>
          </span>
        </footer>
      </main>
    </div>
  );
}

// PUBLIC_INTERFACE
/**
 * Determines the winner. Returns 'X', 'O', or null.
 */
function calculateWinner(sq) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // columns
    [0,4,8],[2,4,6],         // diagonals
  ];
  for(const [a,b,c] of lines) {
    if (sq[a] && sq[a] === sq[b] && sq[a] === sq[c]) {
      return sq[a];
    }
  }
  return null;
}

// PUBLIC_INTERFACE
/**
 * Returns the winning line as an array of indices, or null.
 */
function winningLine(sq) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // columns
    [0,4,8],[2,4,6],         // diagonals
  ];
  for(const line of lines) {
    const [a,b,c] = line;
    if (sq[a] && sq[a] === sq[b] && sq[a] === sq[c]) {
      return line;
    }
  }
  return null;
}

export default App;
