import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import TableButton from './TableButton';
import './TableDeleteButton.module.scss';

interface Props {
  label?: string;
  icon: string;
  className?: string;
  objectName: string;
  objectId: string;
  handleDelete: (id: string) => void;
}

const TableDeleteButton: React.FC<Props> = (props) => {
  const { objectName, objectId, handleDelete } = props;
  const [visible, setVisible] = useState(false);

  const handleClick = () => {
    setVisible(false);
    handleDelete(objectId);
  };

  const footer = (
    <>
      <Button
        label="Abbrechen"
        icon="mdi mdi-arrow-left"
        onClick={() => setVisible(false)}
        className="p-button-secondary"
      />

      <Button label="Löschen" icon="mdi mdi-delete" onClick={handleClick} className="p-button-danger" />
    </>
  );

  return (
    <>
      <TableButton {...props} className="p-button-danger" handleClick={() => setVisible(true)} />

      <Dialog
        header="Vorsicht"
        footer={footer}
        visible={visible}
        onHide={() => setVisible(false)}
        className="deleteDialog"
        dismissableMask
      >
        {objectName} wirklich löschen?
      </Dialog>
    </>
  );
};

export default TableDeleteButton;
