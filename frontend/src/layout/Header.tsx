import ToolbarButton from 'components/ToolbarButton';
import { Toolbar } from 'primereact/toolbar';
import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteQueue } from '../features/downloads/downloadSlice';
import { confirmDialog } from 'primereact/confirmdialog'; // To use confirmDialog method

const Header: React.FC = () => {
  const dispatch = useDispatch();

  const handleDeleteQueue = () => {
    console.log('Deleting outstanding downloads');
    dispatch(deleteQueue());
  };

  const handleDeleteAll = () => {
    console.log('Deleting all downloads');
    dispatch(deleteQueue({ all: true }));
  };

  const confirmDeleteQueue = () => {
    confirmDialog({
      message: 'Are you sure you want to remove outstanding downloads from queue?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: handleDeleteQueue,
    });
  };

  const confirmDeleteAll = () => {
    confirmDialog({
      message: 'Are you sure you want to remove ALL downloads, including finished ones?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: handleDeleteAll,
    });
  };

  const leftContent = (
    <>
      <ToolbarButton icon='mdi mdi-folder-download' label='Downloads' to='/' />
      <ToolbarButton
        icon='mdi mdi-movie'
        label='Available Programmes'
        to='/available'
      />
      <ToolbarButton
        icon='mdi mdi-file-multiple'
        label='Completed Downloads'
        to='/completed'
      />
      <ToolbarButton
        icon='mdi mdi-plex'
        label='Plex'
        external='https://app.plex.tv'
      />
    </>
  );

  const rightContent = (
    <>
      <ToolbarButton
        icon='mdi mdi-delete'
        label={
          <>
            <b>Alle</b> löschen
          </>
        }
        onClick={confirmDeleteAll}
      />
      <ToolbarButton
        icon='mdi mdi-delete'
        label='Warteschlange löschen'
        onClick={confirmDeleteQueue}
      />
    </>
  );

  return (
    <div className='header'>
      <h1>
        <img
          src='/media/BBCWorldService512.png'
          alt='Logo'
          width='64'
          height='64'
        />{' '}
        BBC-Downloader
      </h1>

      <Toolbar left={leftContent} right={rightContent} />
    </div>
  );
};

export default Header;
