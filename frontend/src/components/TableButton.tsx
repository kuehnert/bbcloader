import React from 'react';
import { Button } from 'primereact/button';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import styles from './TableButton.module.scss';

interface Props {
  icon: string;
  label?: string;
  to?: string;
  url?: string;
  tooltip?: string;
  className?: string;
  disabled?: boolean;
  handleClick?: (event: React.MouseEvent) => void;
}

const TableButton: React.FC<Props> = (props) => {
  const { label, to, url, icon, tooltip, className, handleClick, disabled = false } = props;

  const makeButton = (
    <Button
      icon={`mdi mdi-${icon}`}
      label={label}
      tooltip={tooltip}
      tooltipOptions={{ position: 'bottom' }}
      className={classNames('p-button-primary', styles.tableButton, className)}
      onClick={handleClick}
      disabled={disabled}
    />
  );

  if (disabled) {
    return makeButton;
  } else if (url) {
    return <a href={`${url}`}>{makeButton}</a>;
  } else if (to) {
    return <Link to={to}>{makeButton}</Link>;
  } else {
    return makeButton;
  }
};

export default TableButton;
