import classnames from 'classnames';
import { Card } from 'primereact/card';
import React from 'react';
import './StatusCard.scss';

interface Props {
  title: string;
  condition?: boolean;
  content?: string | JSX.Element;
}

const StatusCard: React.FC<Props> = ({ title, condition = true, content }) => {
  return (
    <div className="p-col">
      <Card title={title} className={classnames('statusCard', condition ? 'greenCard' : 'warnCard')}>
        <div className={'content'}>{condition && content}</div>
      </Card>
    </div>
  );
};

export default StatusCard;
