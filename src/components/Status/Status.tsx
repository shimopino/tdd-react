import styles from './Status.module.scss';

export interface Props {
  status: string;
}

export const Status = ({ status }: Props) => (
  <div className={styles.status} data-e2e="status">
    {status}
  </div>
);
