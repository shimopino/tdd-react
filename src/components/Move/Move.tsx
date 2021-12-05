import { BoardValue } from '../../types/tictactoe';
import './Move.module.scss';

export interface Props {
  history: BoardValue[];
  jumpTo: (step: number) => void;
}

export const Move = ({ history, jumpTo }: Props) => {
  const moves = history.map((step, move) => {
    const desc = move ? `Go to move #${move}` : `Go to game start`;
    return (
      <li key={move}>
        <button type="button" onClick={() => jumpTo(move)} data-e2e="move">
          {desc}
        </button>
      </li>
    );
  });

  return <ol>{moves}</ol>;
};
