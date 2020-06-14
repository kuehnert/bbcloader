import ToolbarButton from 'components/ToolbarButton';
import { Toolbar } from 'primereact/toolbar';
import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="header">
      <h1>
        <img src="/media/BBCWorldService512.png" alt="Logo" width="64" height="64" /> BBC-Downloader
      </h1>

      <Toolbar>
        <ToolbarButton icon="mdi mdi-folder-download" label="Downloads" to="/" />
        <ToolbarButton icon="mdi mdi-movie" label="Available Programmes" to="/available" />
        <ToolbarButton icon="mdi mdi-file-multiple" label="Completed Downloads" to="/completed" />
        <ToolbarButton icon="mdi mdi-plex" label="Plex" external="https://app.plex.tv" />
      </Toolbar>
    </div>
  );
};

export default Header;
