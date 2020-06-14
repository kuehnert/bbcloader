import React from 'react';
// import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';
import './ToolbarButton.scss';
import classnames from 'classnames';

interface Props {
  label: string;
  icon: string;
  to?: string;
  external?: string;
  download?: boolean;
  tooltip?: string;
}

const ToolbarButton: React.FC<Props> = ({ download, external, label, icon, to }) => {
  const makeButton = (external?: boolean) => (
    <button className={classnames('toolbarButton', { 'toolbarButton-external': external })}>
      <span className={`icon mdi mdi-${icon}`}></span>
      <span className="label">{label}</span>
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
      >
        {makeButton(true)}
      </a>
    );
  }
};

export default ToolbarButton;
