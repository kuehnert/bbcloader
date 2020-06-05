import { Card } from 'primereact/card';
import React from 'react';
import styles from './StatusCard.module.scss';
import classnames from 'classnames'

interface Props {
  title: string;
  condition?: boolean;
  content?: string;
}

const StatusCard: React.FC<Props> = ({ title, condition = true, content }) => {
  return (
    <div className="p-col">
      <Card title={title} className={classnames(styles.card, condition ? 'greenCard' : 'card')}>
        <div className="content">{condition && content}</div>
      </Card>
    </div>
  );
};

export default StatusCard;
