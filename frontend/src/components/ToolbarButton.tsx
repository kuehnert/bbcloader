import React from 'react';
// import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';
import './ToolbarButton.scss';
import classnames from 'classnames';

interface Props {
  className?: string;
  download?: boolean;
  external?: string;
  icon: string;
  label: string | JSX.Element;
  onClick?: () => void;
  to?: string;
  tooltip?: string;
}

const ToolbarButton: React.FC<Props> = ({
  className,
  download,
  external,
  icon,
  label,
  onClick,
  to,
}) => {
  const makeButton = (external?: boolean) => (
    <button
      className={classnames(
        'toolbarButton',
        {
          'toolbarButton-external': external,
        },
        className
      )}>
      <span className={`icon mdi mdi-${icon}`}></span>
      <span className='label'>{label}</span>
    </button>
  );

  if (to != null) {
    return (
      <Link to={to} download={download}>
        {makeButton()}
      </Link>
    );
  } else {
    return (
      <a
        href={external}
        download={download}
        target={!download ? 'new' : 'old'}
        onClick={onClick}>
        {makeButton(true)}
      </a>
    );
  }
};

export default ToolbarButton;
