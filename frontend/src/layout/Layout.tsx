import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/nova-light/theme.css';
import React from 'react';
import Alerts from '../components/Alerts';
import Routes from '../Routes';
import './layout.scss';

const Layout: React.FC = () => {
  return (
    <div className="layout-main">
      <Alerts />
      <Routes />
    </div>
  );
};

export default Layout;
