import { BoardValue } from '../../types/tictactoe';
import { Board } from '../Board/Board';
import { Status } from '../Status/Status';
import { Move } from '../Move/Move';
import styles from './Game.module.scss';

export interface Props {
  status: string;
  current: BoardValue;
  history: BoardValue[];
  handleClick: (i: number) => void;
  jumpTo: (step: number) => void;
}

export const Game = ({
  status,
  current,
  history,
  handleClick,
  jumpTo,
}: Props): JSX.Element => (
  <div className={styles.game}>
    <div>
      <Board squares={current.squares} onClick={(i) => handleClick(i)} />
    </div>
    <div className={styles.gameInfo}>
      <Status status={status} />
      <Move history={history} jumpTo={jumpTo} />
    </div>
  </div>
);
