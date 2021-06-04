import bbcApi from 'api/bbcApi';
import React, { createRef } from 'react';
import authHeader from '../utils/authHeader';

interface Props {
  url: string;
  filename: string;
  children?: any;
}

const AuthenticatedLink: React.FC<Props> = ({ url, filename, children }) => {
  const link = createRef<any>();

  const handleAction = async () => {
    if (link.current.href) {
      return;
    }

    // const result = await fetch(url, { headers: authHeader() });
    const response = await bbcApi.get(url, { headers: authHeader() });
    // console.log(response.data);

    // const blob = await response.blob();
    const href = window.URL.createObjectURL(
      new Blob([response.data], { type: 'application/txt' })
    );

    link.current.download = filename;
    link.current.href = href;
    link.current.click();
  };

  return (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <a role='button' ref={link} onClick={handleAction}>
      {children}
    </a>
  );
};

export default AuthenticatedLink;
