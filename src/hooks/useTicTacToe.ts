import { useState } from 'react';
import { BoardValue } from '../types/tictactoe';
import calculateWinner from '../utils/calculateWinner';

const useTicTacToe = (): [
  string,
  BoardValue,
  BoardValue[],
  (i: number) => void,
  (step: number) => void
] => {
  const [xIsNext, setXIsNext] = useState<boolean>(true);
  const [stepNumber, setStepNumber] = useState<number>(0);
  const [history, setHistory] = useState<BoardValue[]>([
    {
      squares: Array(9).fill(null),
    },
  ]);

  const handleClick = (i: number): void => {
    const newHistory = history.slice(0, stepNumber + 1);
    const current = newHistory[newHistory.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = xIsNext ? 'X' : 'O';
    // squares[i] = xIsNext ? '半' : '丁';
    setHistory(
      newHistory.concat([
        {
          squares,
        },
      ])
    );
    setStepNumber(newHistory.length);
    setXIsNext(!xIsNext);
  };

  const jumpTo = (step: number): void => {
    setStepNumber(step);
    setXIsNext(step % 2 === 0);
  };

  const current = history[stepNumber];
  const winner = calculateWinner(current.squares);
  const isDraw = current.squares.every((square) => square != null);

  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (isDraw) {
    status = 'Draw!';
  } else {
    status = `Next Player: ${xIsNext ? 'X' : 'O'}`;
  }

  return [status, current, history, handleClick, jumpTo];
};

export default useTicTacToe;
