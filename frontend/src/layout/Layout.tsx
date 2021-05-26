import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/nova/theme.css';
import React from 'react';
import Alerts from '../components/Alerts';
import Routes from '../app/Routes';
import Header from './Header';
import './layout.scss';

const Layout: React.FC = () => {
  return (
    <div className="layout-main">
      <Alerts />
      <Header />
      <Routes />
    </div>
  );
};

export default Layout;
