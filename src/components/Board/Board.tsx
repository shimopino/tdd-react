import { Square } from '../Square/Square';
import { SquareValue } from '../../types/tictactoe';
import styles from './Board.module.scss';

export interface Props {
  squares: SquareValue[];
  onClick(i: number): void;
}

export const Board = ({ squares, onClick }: Props): JSX.Element => {
  const renderSquare = (index: number): JSX.Element => {
    return (
      <Square
        value={squares[index]}
        onClick={() => onClick(index)}
        key={index}
      />
    );
  };

  return (
    <>
      <div className={styles.boardRow}>
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className={styles.boardRow}>
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className={styles.boardRow}>
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </>
  );
};
