import classnames from 'classnames';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { RootState } from '../../store';
import { AutoComplete } from 'primereact/autocomplete';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import { Checkbox } from 'primereact/checkbox';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Growl } from 'primereact/growl';
import { InputSwitch } from 'primereact/inputswitch';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { ListBox } from 'primereact/listbox';
import { Menu } from 'primereact/menu';
import { Menubar } from 'primereact/menubar';
import { Paginator } from 'primereact/paginator';
import { Panel } from 'primereact/panel';
import { ProgressSpinner } from 'primereact/progressspinner';
import { RadioButton } from 'primereact/radiobutton';
import { SelectButton } from 'primereact/selectbutton';
import { SplitButton } from 'primereact/splitbutton';
import { Toolbar } from 'primereact/toolbar';
import { Tree } from 'primereact/tree';
import { formatDate } from 'utils/helpers';
import { Available, fetchAvailable } from './availableSlice';
import TableButton from 'components/TableButton';

const AvailableIndex: React.FC = () => {
  const { available } = useSelector((state: RootState) => state.available);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAvailable());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addedOnBody = (available: Available) => formatDate(new Date(available.addedOn));

  const actionBody = (available: Available) => {
    return (
      <>
        <TableButton icon="mdi mdi-eye" url={`https://www.bbc.co.uk/iplayer/episodes/${available.id}`} />
      </>
    );
  };

  return (
    <div>
      <h1>Available Programmes</h1>
      <DataTable value={available} autoLayout={true} paginator={true} rows={20}>
        <Column header="Programme" field="title" />
        <Column header="Synopsis" field="synopsis" />
        <Column header="ID" field="id" />
        <Column header="Added On" body={addedOnBody} />
        <Column header="Actions" body={actionBody} />
      </DataTable>
    </div>
  );
};

export default AvailableIndex;
