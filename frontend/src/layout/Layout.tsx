import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/nova-light/theme.css';
import React from 'react';
import Alerts from '../components/Alerts';
import Routes from '../Routes';
import './layout.scss';
import bgImage from './sockalingumHD.jpg';

const Layout: React.FC = () => {
  const bgHead = {
    minHeight: '100vh',
    background: `url(${bgImage}) no-repeat center center fixed`,
    backgroundSize: 'cover',
  };

  return (
    <div style={bgHead}>
      <div className="layout-main">
        <Alerts />
        <Routes />
      </div>
    </div>
  );
};

export default Layout;
